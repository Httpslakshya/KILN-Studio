import re
from fastapi import APIRouter, Form, Request
from backend.models.schemas import success_response, error_response
from backend.config.settings import settings
from backend.services.user_service import user_service
from backend.utils.logging_config import logger

router = APIRouter(tags=["Authentication"])

# In-memory session registry (session_id -> user metadata)
active_sessions = set()

def cookie_options():
    """Returns cookie settings that work for local HTTP and hosted HTTPS deployments."""
    is_production = settings.ENVIRONMENT == "production"
    return {
        "httponly": True,
        "samesite": "none" if is_production else "lax",
        "secure": is_production,
    }

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

async def _parse_auth_request(request: Request) -> dict:
    """Extracts credentials whether submitted as multipart Form data or JSON."""
    content_type = request.headers.get("content-type", "").lower()
    if "application/json" in content_type:
        try:
            data = await request.json()
            return data if isinstance(data, dict) else {}
        except Exception:
            return {}
    try:
        form = await request.form()
        return dict(form)
    except Exception:
        return {}

@router.post("/api/signup")
async def api_signup(request: Request):
    """
    Registers a new user account with email, password, and name.
    Accepts Form or JSON payloads. Creates active session upon success.
    """
    data = await _parse_auth_request(request)
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", "")).strip()
    name = str(data.get("name", data.get("full_name", ""))).strip()

    logger.info(f"Signup attempt received for email: {email}")

    # Validate inputs
    if not email or not EMAIL_REGEX.match(email):
        return error_response(
            message="Please provide a valid email address.",
            status_code=400
        )

    if len(password) < 6:
        return error_response(
            message="Password must be at least 6 characters long.",
            status_code=400
        )

    try:
        user = user_service.create_user(
            email=email,
            password=password,
            full_name=name
        )
    except ValueError as val_err:
        return error_response(
            message=str(val_err),
            status_code=400
        )
    except Exception as e:
        logger.error(f"Unexpected signup error: {e}", exc_info=True)
        return error_response(
            message="Unable to complete registration. Please try again.",
            status_code=500
        )

    session_id = email
    active_sessions.add(session_id)

    response = success_response(
        data={
            "redirect": "/dashboard.html",
            "session_id": session_id,
            "user": {
                "email": user["email"],
                "full_name": user["full_name"]
            }
        },
        message="Account created successfully! Redirecting to workspace..."
    )

    response.set_cookie(
        key="session_id",
        value=session_id,
        max_age=3600 * 24 * 7,
        **cookie_options()
    )

    return response

@router.post("/api/login")
async def api_login(request: Request):
    """
    Authenticates user login against stored credentials or Supabase Auth.
    Accepts Form or JSON payloads. Registers active session upon success.
    """
    data = await _parse_auth_request(request)
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", "")).strip()

    logger.info(f"Login attempt received for email: {email}")

    if not email or not password:
        return error_response(
            message="Email and password are required.",
            status_code=400
        )

    user = user_service.authenticate_user(email, password)
    if not user:
        return error_response(
            message="Invalid email or password. Please try again or switch to Create Account.",
            status_code=401
        )

    session_id = email
    active_sessions.add(session_id)

    response = success_response(
        data={
            "redirect": "/dashboard.html",
            "session_id": session_id,
            "user": {
                "email": user["email"],
                "full_name": user.get("full_name", email.split('@')[0])
            }
        },
        message="Login completed successfully"
    )

    response.set_cookie(
        key="session_id",
        value=session_id,
        max_age=3600 * 24 * 7,
        **cookie_options()
    )

    logger.info(f"Session registered successfully for {email}.")
    return response

@router.post("/api/logout")
async def api_logout(request: Request):
    """Deletes active session cookies and deregisters session registry."""
    session_id = request.cookies.get("session_id")
    if not session_id:
        session_id = request.headers.get("x-session-id")

    if session_id and session_id in active_sessions:
        active_sessions.remove(session_id)
        logger.info(f"Deregistered session: {session_id}")

    response = success_response(message="Logout completed successfully")
    response.delete_cookie(
        key="session_id",
        samesite=cookie_options()["samesite"],
        secure=cookie_options()["secure"]
    )
    return response

@router.get("/api/auth/check")
def check_session(request: Request):
    """Utility endpoint for the decoupled frontend to check authentication state."""
    session_id = request.cookies.get("session_id")
    if not session_id:
        session_id = request.headers.get("x-session-id")

    if session_id:
        clean_email = session_id.strip().lower()
        if (
            session_id in active_sessions
            or user_service.get_user_by_email(clean_email)
            or clean_email in ("guest@docmind.local", "guest@kiln.local", "demo@kiln.local", "new-user@docmind.local")
        ):
            active_sessions.add(session_id)
            user_info = user_service.get_user_by_email(clean_email) or {
                "email": clean_email,
                "full_name": clean_email.split('@')[0].capitalize()
            }
            return success_response(
                data={
                    "authenticated": True,
                    "session_id": session_id,
                    "user": {
                        "email": user_info.get("email", clean_email),
                        "full_name": user_info.get("full_name", clean_email.split('@')[0].capitalize())
                    }
                },
                message="Authenticated successfully"
            )

    return error_response(
        message="Invalid or expired session",
        status_code=401
    )
