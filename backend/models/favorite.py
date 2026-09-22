from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint, func
from database import Base


class Favorite(Base):
    """A song that a user has marked as favorite."""

    __tablename__ = "favorites"

    __table_args__ = (
        UniqueConstraint("user_id", "song_id", name="uq_user_song_favorite"),
    )

    id         = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id    = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    song_id    = Column(Integer, ForeignKey("songs.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, server_default=func.now())
