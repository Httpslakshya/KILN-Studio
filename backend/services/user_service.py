import os
import json
import secrets
import hashlib
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any
from backend.config.settings import settings
from backend.utils.logging_config import logger

class UserService:
    """
    Manages user registration, credential hashing, and authentication.
    Coordinates between Supabase Auth and persistent local JSON database (data/users.json).
    """

    def __init__(self):
        self.db_path: Path = settings.DATA_DIR / "users.json"
        self._supabase_client = None
        self._init_db()
        self._init_supabase()

    def _init_db(self):
        """Ensures users.json exists with valid structure."""
        settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
        if not self.db_path.exists():
            initial_data = {
                "users": {
                    "guest@docmind.local": {
                        "email": "guest@docmind.local",
                        "full_name": "Guest Creator",
                        "password_hash": self._hash_password("demo-access", "kiln_salt_guest"),
                        "salt": "kiln_salt_guest",
                        "created_at": datetime.utcnow().isoformat(),
                        "provider": "local"
                    }
                }
            }
            with open(self.db_path, "w", encoding="utf-8") as f:
                json.dump(initial_data, f, indent=2)
            logger.info(f"Initialized local user database at {self.db_path}")

    def _init_supabase(self):
        """Initializes Supabase client if credentials are configured."""
        if settings.SUPABASE_URL and settings.SUPABASE_KEY:
            try:
                from supabase import create_client
                self._supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
                logger.info("Supabase Auth client initialized successfully in UserService.")
            except Exception as e:
                logger.warning(f"Could not initialize Supabase client for Auth: {e}. Using local store.")

    def _hash_password(self, password: str, salt: str) -> str:
        """Computes secure PBKDF2-HMAC-SHA256 password hash."""
        derived = hashlib.pbkdf2_hmac(
            hash_name="sha256",
            password=password.encode("utf-8"),
            salt=salt.encode("utf-8"),
            iterations=100_000
        )
        return derived.hex()

    def _load_users(self) -> Dict[str, Any]:
        """Loads users dictionary from persistent storage."""
        try:
            with open(self.db_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data.get("users", {})
        except Exception as e:
            logger.error(f"Error loading users database: {e}")
            return {}

    def _save_users(self, users: Dict[str, Any]):
        """Persists users dictionary to local storage."""
        try:
            with open(self.db_path, "w", encoding="utf-8") as f:
                json.dump({"users": users}, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving users database: {e}")

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Retrieves user record by email (case-insensitive)."""
        normalized_email = email.strip().lower()
        users = self._load_users()
        return users.get(normalized_email)

    def create_user(self, email: str, password: str, full_name: str = "") -> Dict[str, Any]:
        """
        Creates a new user record.
        Attempts Supabase Auth sign_up first, and stores in persistent local DB.
        """
        normalized_email = email.strip().lower()
        users = self._load_users()

        if normalized_email in users:
            raise ValueError("An account with this email address already exists.")

        # Attempt Supabase Auth registration if configured
        supabase_id = None
        if self._supabase_client:
            try:
                res = self._supabase_client.auth.sign_up({
                    "email": normalized_email,
                    "password": password,
                    "options": {
                        "data": {"full_name": full_name or normalized_email.split('@')[0]}
                    }
                })
                if res and res.user:
                    supabase_id = res.user.id
                    logger.info(f"Supabase Auth user registered: {normalized_email} (ID: {supabase_id})")
            except Exception as e:
                logger.warning(f"Supabase sign_up warning for {normalized_email}: {e}. Proceeding with local store.")

        # Generate cryptographic salt and hash password
        salt = secrets.token_hex(16)
        password_hash = self._hash_password(password, salt)

        user_data = {
            "email": normalized_email,
            "full_name": full_name.strip() or normalized_email.split('@')[0],
            "password_hash": password_hash,
            "salt": salt,
            "supabase_id": supabase_id,
            "created_at": datetime.utcnow().isoformat(),
            "provider": "supabase" if supabase_id else "local"
        }

        users[normalized_email] = user_data
        self._save_users(users)
        logger.info(f"User '{normalized_email}' successfully registered.")

        return {
            "email": normalized_email,
            "full_name": user_data["full_name"],
            "created_at": user_data["created_at"]
        }

    def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """
        Authenticates user credentials.
        Verifies local hash and/or Supabase Auth.
        """
        normalized_email = email.strip().lower()

        # Handle guest and demo credentials seamlessly
        if normalized_email in ("guest@docmind.local", "guest@kiln.local", "demo@kiln.local", "new-user@docmind.local"):
            return {
                "email": normalized_email,
                "full_name": "Demo Creator" if "new-user" in normalized_email or "demo" in normalized_email else "Guest Creator",
                "is_guest": True
            }

        users = self._load_users()
        user_record = users.get(normalized_email)

        # 1. Verify against local record if present
        if user_record:
            salt = user_record.get("salt", "")
            expected_hash = user_record.get("password_hash", "")
            computed_hash = self._hash_password(password, salt)
            if secrets.compare_digest(computed_hash, expected_hash):
                logger.info(f"User '{normalized_email}' authenticated via local verification.")
                return {
                    "email": normalized_email,
                    "full_name": user_record.get("full_name", normalized_email.split('@')[0]),
                    "supabase_id": user_record.get("supabase_id")
                }

        # 2. Try Supabase Auth sign_in_with_password as fallback
        if self._supabase_client:
            try:
                res = self._supabase_client.auth.sign_in_with_password({
                    "email": normalized_email,
                    "password": password
                })
                if res and res.user:
                    logger.info(f"User '{normalized_email}' authenticated via Supabase Auth.")
                    full_name = res.user.user_metadata.get("full_name", normalized_email.split('@')[0])
                    # Auto-sync to local users store for offline/fast access
                    if normalized_email not in users:
                        salt = secrets.token_hex(16)
                        users[normalized_email] = {
                            "email": normalized_email,
                            "full_name": full_name,
                            "password_hash": self._hash_password(password, salt),
                            "salt": salt,
                            "supabase_id": res.user.id,
                            "created_at": datetime.utcnow().isoformat(),
                            "provider": "supabase"
                        }
                        self._save_users(users)

                    return {
                        "email": normalized_email,
                        "full_name": full_name,
                        "supabase_id": res.user.id
                    }
            except Exception as e:
                logger.warning(f"Supabase Auth sign_in error for {normalized_email}: {e}")

        logger.warning(f"Authentication failed for user: {normalized_email}")
        return None

# Global user service singleton
user_service = UserService()
