from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from database import get_db
from models.favorite import Favorite
from models.song import Song
from schemas.favorite import FavoriteOut
from schemas.song import SongOut
from services.auth_service import get_current_user

router = APIRouter(prefix="/favorites", tags=["Favorites"])


def _build_favorite_out(fav: Favorite, db: Session) -> FavoriteOut:
    song = db.query(
        Song.id, Song.title, Song.movie_name, Song.artist,
        Song.album, Song.genre, Song.duration_seconds, Song.created_at
    ).filter(Song.id == fav.song_id).first()

    song_out = SongOut(
        id=song.id, title=song.title, movie_name=song.movie_name,
        artist=song.artist, album=song.album, genre=song.genre,
        duration_seconds=song.duration_seconds, created_at=song.created_at,
    ) if song else None

    return FavoriteOut(
        id=fav.id, user_id=fav.user_id,
        song_id=fav.song_id, created_at=fav.created_at, song=song_out,
    )


@router.get("", response_model=List[FavoriteOut])
def list_favorites(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Return all songs the current user has favorited."""
    favs = db.query(Favorite).filter(Favorite.user_id == current_user.id).order_by(Favorite.created_at.desc()).all()
    return [_build_favorite_out(f, db) for f in favs]


@router.post("/{song_id}", response_model=FavoriteOut, status_code=status.HTTP_201_CREATED)
def add_favorite(song_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Add a song to favorites."""
    if not db.query(Song).filter(Song.id == song_id).first():
        raise HTTPException(status_code=404, detail="Song not found")

    fav = Favorite(user_id=current_user.id, song_id=song_id)
    db.add(fav)
    try:
        db.commit()
        db.refresh(fav)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Song already in favorites")
    return _build_favorite_out(fav, db)


@router.delete("/{song_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(song_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Remove a song from favorites."""
    fav = db.query(Favorite).filter(Favorite.user_id == current_user.id, Favorite.song_id == song_id).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")
    db.delete(fav)
    db.commit()
