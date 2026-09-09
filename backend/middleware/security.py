from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config.settings import settings
from backend.utils.logging_config import logger

def setup_cors(app: FastAPI):
    """Configures production-ready CORS middleware for decoupled frontend clients."""
    logger.info(f"Setting up CORS for frontend. Configured FRONTEND_URL: '{settings.FRONTEND_URL}'")
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )
