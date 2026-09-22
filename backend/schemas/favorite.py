from datetime import datetime
from pydantic import BaseModel
from schemas.song import SongOut


class FavoriteOut(BaseModel):
    id: int
    user_id: int
    song_id: int
    created_at: datetime
    song: SongOut | None = None

    model_config = {"from_attributes": True}
