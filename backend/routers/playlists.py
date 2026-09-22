from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models.playlist import Playlist, PlaylistSong
from models.song import Song
from schemas.playlist import PlaylistCreate, PlaylistUpdate, PlaylistOut, PlaylistSongAdd, PlaylistSongOut
from schemas.song import SongOut
from services.auth_service import get_current_user

router = APIRouter(prefix="/playlists", tags=["Playlists"])


def _get_playlist_or_404(playlist_id: int, owner_id: int, db: Session) -> Playlist:
    pl = db.query(Playlist).filter(Playlist.id == playlist_id, Playlist.owner_id == owner_id).first()
    if not pl:
        raise HTTPException(status_code=404, detail="Playlist not found")
    return pl


def _build_playlist_out(pl: Playlist, db: Session) -> PlaylistOut:
    """Build a PlaylistOut with nested song data."""
    ps_rows = (
        db.query(PlaylistSong)
        .filter(PlaylistSong.playlist_id == pl.id)
        .order_by(PlaylistSong.position.asc())
        .all()
    )
    songs_out = []
    for ps in ps_rows:
        song = db.query(
            Song.id, Song.title, Song.movie_name, Song.artist,
            Song.album, Song.genre, Song.duration_seconds, Song.created_at
        ).filter(Song.id == ps.song_id).first()

        song_detail = SongOut(
            id=song.id, title=song.title, movie_name=song.movie_name,
            artist=song.artist, album=song.album, genre=song.genre,
            duration_seconds=song.duration_seconds, created_at=song.created_at,
        ) if song else None

        songs_out.append(
            PlaylistSongOut(
                id=ps.id, playlist_id=ps.playlist_id, song_id=ps.song_id,
                position=ps.position, added_at=ps.added_at, song=song_detail,
            )
        )
    return PlaylistOut(
        id=pl.id, name=pl.name, description=pl.description,
        owner_id=pl.owner_id, created_at=pl.created_at, songs=songs_out,
    )


# ── CRUD ───────────────────────────────────────────────────────────────────────

@router.get("", response_model=List[PlaylistOut])
def list_playlists(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    playlists = db.query(Playlist).filter(Playlist.owner_id == current_user.id).all()
    return [_build_playlist_out(pl, db) for pl in playlists]


@router.post("", response_model=PlaylistOut, status_code=status.HTTP_201_CREATED)
def create_playlist(payload: PlaylistCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    pl = Playlist(name=payload.name, description=payload.description, owner_id=current_user.id)
    db.add(pl)
    db.commit()
    db.refresh(pl)
    return _build_playlist_out(pl, db)


@router.get("/{playlist_id}", response_model=PlaylistOut)
def get_playlist(playlist_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    pl = _get_playlist_or_404(playlist_id, current_user.id, db)
    return _build_playlist_out(pl, db)


@router.put("/{playlist_id}", response_model=PlaylistOut)
def update_playlist(playlist_id: int, payload: PlaylistUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    pl = _get_playlist_or_404(playlist_id, current_user.id, db)
    if payload.name is not None:
        pl.name = payload.name
    if payload.description is not None:
        pl.description = payload.description
    db.commit()
    db.refresh(pl)
    return _build_playlist_out(pl, db)


@router.delete("/{playlist_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_playlist(playlist_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    pl = _get_playlist_or_404(playlist_id, current_user.id, db)
    db.delete(pl)
    db.commit()


# ── Playlist ↔ Song membership ────────────────────────────────────────────────

@router.post("/{playlist_id}/songs", response_model=PlaylistSongOut, status_code=status.HTTP_201_CREATED)
def add_song_to_playlist(playlist_id: int, payload: PlaylistSongAdd, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    _get_playlist_or_404(playlist_id, current_user.id, db)

    # Check song exists
    if not db.query(Song).filter(Song.id == payload.song_id).first():
        raise HTTPException(status_code=404, detail="Song not found")

    # Prevent duplicates
    if db.query(PlaylistSong).filter(PlaylistSong.playlist_id == playlist_id, PlaylistSong.song_id == payload.song_id).first():
        raise HTTPException(status_code=409, detail="Song already in playlist")

    ps = PlaylistSong(playlist_id=playlist_id, song_id=payload.song_id, position=payload.position)
    db.add(ps)
    db.commit()
    db.refresh(ps)
    return PlaylistSongOut(id=ps.id, playlist_id=ps.playlist_id, song_id=ps.song_id, position=ps.position, added_at=ps.added_at)


@router.delete("/{playlist_id}/songs/{song_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_song_from_playlist(playlist_id: int, song_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    _get_playlist_or_404(playlist_id, current_user.id, db)
    ps = db.query(PlaylistSong).filter(PlaylistSong.playlist_id == playlist_id, PlaylistSong.song_id == song_id).first()
    if not ps:
        raise HTTPException(status_code=404, detail="Song not in this playlist")
    db.delete(ps)
    db.commit()
