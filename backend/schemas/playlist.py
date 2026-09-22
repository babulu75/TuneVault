from datetime import datetime
from pydantic import BaseModel
from schemas.song import SongOut


class PlaylistCreate(BaseModel):
    name: str
    description: str | None = None


class PlaylistUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


class PlaylistSongAdd(BaseModel):
    song_id: int
    position: int = 0


class PlaylistSongOut(BaseModel):
    id: int
    playlist_id: int
    song_id: int
    position: int
    added_at: datetime
    song: SongOut | None = None

    model_config = {"from_attributes": True}


class PlaylistOut(BaseModel):
    id: int
    name: str
    description: str | None = None
    owner_id: int
    created_at: datetime
    songs: list[PlaylistSongOut] = []

    model_config = {"from_attributes": True}
