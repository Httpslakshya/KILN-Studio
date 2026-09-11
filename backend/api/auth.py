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

@router.post("/api/signup")
def api_signup(
    email: str = Form(...),
    password: str = Form(...),
    name: str = Form("")
):
    """
    Registers a new user account with email, password, and name.
    Creates session upon successful creation and returns redirect to dashboard.
    """
    clean_email = email.strip().lower()
    clean_name = name.strip()
    
    logger.info(f"Signup attempt received for email: {clean_email}")

    # Validate inputs
    if not clean_email or not EMAIL_REGEX.match(clean_email):
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
            email=clean_email,
            password=password,
            full_name=clean_name
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

    session_id = clean_email
    active_sessions.add(session_id)

    response = success_response(
        data={
            "redirect": "/dashboard",
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
def api_login(email: str = Form(...), password: str = Form(...)):
    """
    Authenticates user login against stored credentials or Supabase Auth.
    Registers active session and returns cookie/metadata.
    """
    clean_email = email.strip().lower()
    logger.info(f"Login attempt received for email: {clean_email}")

    if not clean_email or not password:
        return error_response(
            message="Email and password are required.",
            status_code=400
        )

    user = user_service.authenticate_user(clean_email, password)
    if not user:
        return error_response(
            message="Invalid email or password. Please try again or create an account.",
            status_code=401
        )

    session_id = clean_email
    active_sessions.add(session_id)

    response = success_response(
        data={
            "redirect": "/dashboard",
            "session_id": session_id,
            "user": {
                "email": user["email"],
                "full_name": user.get("full_name", clean_email.split('@')[0])
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

    logger.info(f"Session registered successfully for {clean_email}.")
    return response

@router.post("/api/logout")
def api_logout(request: Request):
    """Deletes active session cookies and deregisters session registry."""
    session_id = request.cookies.get("session_id")
    if not session_id:
        session_id = request.headers.get("x-session-id")

    if session_id in active_sessions:
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
        # Check active memory sessions or known persistent users
        clean_email = session_id.strip().lower()
        if session_id in active_sessions or user_service.get_user_by_email(clean_email) or clean_email in ("guest@docmind.local", "guest@kiln.local"):
            active_sessions.add(session_id)
            user_info = user_service.get_user_by_email(clean_email) or {"email": clean_email, "full_name": clean_email.split('@')[0]}
            return success_response(
                data={
                    "authenticated": True,
                    "session_id": session_id,
                    "user": {
                        "email": user_info.get("email", clean_email),
                        "full_name": user_info.get("full_name", clean_email.split('@')[0])
                    }
                },
                message="Authenticated successfully"
            )

    return error_response(
        message="Invalid or expired session",
        status_code=401
    )
