from routers.auth import router as auth_router
from routers.songs import router as songs_router
from routers.playlists import router as playlists_router
from routers.favorites import router as favorites_router

__all__ = ["auth_router", "songs_router", "playlists_router", "favorites_router"]
