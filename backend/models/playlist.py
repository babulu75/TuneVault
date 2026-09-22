from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, UniqueConstraint, func
from database import Base


class Playlist(Base):
    """A named collection of songs owned by a user."""

    __tablename__ = "playlists"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name        = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    owner_id    = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at  = Column(DateTime, server_default=func.now())


class PlaylistSong(Base):
    """Join table that tracks which songs belong to which playlist and their order."""

    __tablename__ = "playlist_songs"

    __table_args__ = (
        UniqueConstraint("playlist_id", "song_id", name="uq_playlist_song"),
    )

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    playlist_id = Column(Integer, ForeignKey("playlists.id", ondelete="CASCADE"), nullable=False, index=True)
    song_id     = Column(Integer, ForeignKey("songs.id",     ondelete="CASCADE"), nullable=False, index=True)
    position    = Column(Integer, nullable=False, default=0)
    added_at    = Column(DateTime, server_default=func.now())
