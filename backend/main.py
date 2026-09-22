from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import APP_NAME, APP_VERSION, ALLOWED_ORIGINS
from database import engine, Base

# Import all models so SQLAlchemy knows about them before create_all
import models  # noqa: F401

from routers import auth_router, songs_router, playlists_router, favorites_router

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="TuneFault — Full-stack Music Streaming API (v2)",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(songs_router)
app.include_router(playlists_router)
app.include_router(favorites_router)


@app.get("/", tags=["Root"])
def root():
    return {
        "app": APP_NAME,
        "version": APP_VERSION,
        "docs": "/docs",
        "status": "online",
    }
