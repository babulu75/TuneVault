from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.dialects.mysql import LONGBLOB
from database import Base


class Song(Base):
    """Song metadata + raw binary MP3 audio stored as LONGBLOB."""

    __tablename__ = "songs"

    id               = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title            = Column(String(255), nullable=False)
    movie_name       = Column(String(255), nullable=True)
    artist           = Column(String(255), nullable=True)
    album            = Column(String(255), nullable=True)
    genre            = Column(String(100), nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    audio_data       = Column(LONGBLOB, nullable=False)
    created_at       = Column(DateTime, server_default=func.now())
