from datetime import datetime
from pydantic import BaseModel


class SongOut(BaseModel):
    id: int
    title: str
    movie_name: str | None = None
    artist: str | None = None
    album: str | None = None
    genre: str | None = None
    duration_seconds: int | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class SongUpload(BaseModel):
    title: str
    movie_name: str | None = None
    artist: str | None = None
    album: str | None = None
    genre: str | None = None
