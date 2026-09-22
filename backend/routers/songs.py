from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import Response
from sqlalchemy.orm import Session

from database import get_db
from models.song import Song
from schemas.song import SongOut
from services.auth_service import get_current_user

router = APIRouter(prefix="/songs", tags=["Songs"])


# ── Upload ─────────────────────────────────────────────────────────────────────

@router.post("/upload", response_model=SongOut, status_code=status.HTTP_201_CREATED)
async def upload_song(
    file: UploadFile = File(..., description="MP3 audio file"),
    title: str = Form(...),
    movie_name: Optional[str] = Form(None),
    artist: Optional[str] = Form(None),
    album: Optional[str] = Form(None),
    genre: Optional[str] = Form(None),
    duration_seconds: Optional[int] = Form(None),
    db: Session = Depends(get_db),
    _current_user=Depends(get_current_user),
):
    """Upload an MP3 file with metadata (authenticated users only)."""
    if not file.filename.lower().endswith(".mp3"):
        raise HTTPException(status_code=400, detail="Only MP3 files are accepted")

    audio_bytes = await file.read()
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    song = Song(
        title=title,
        movie_name=movie_name,
        artist=artist,
        album=album,
        genre=genre,
        duration_seconds=duration_seconds,
        audio_data=audio_bytes,
    )
    db.add(song)
    db.commit()
    db.refresh(song)
    return song


# ── List ───────────────────────────────────────────────────────────────────────

@router.get("", response_model=List[SongOut])
def list_songs(db: Session = Depends(get_db)):
    """Return metadata for all songs (no audio binary)."""
    songs = (
        db.query(
            Song.id, Song.title, Song.movie_name, Song.artist,
            Song.album, Song.genre, Song.duration_seconds, Song.created_at
        )
        .order_by(Song.id.asc())
        .all()
    )
    return [
        SongOut(
            id=s.id, title=s.title, movie_name=s.movie_name, artist=s.artist,
            album=s.album, genre=s.genre, duration_seconds=s.duration_seconds,
            created_at=s.created_at,
        )
        for s in songs
    ]


# ── Single metadata ────────────────────────────────────────────────────────────

@router.get("/{song_id}", response_model=SongOut)
def get_song(song_id: int, db: Session = Depends(get_db)):
    """Return metadata for a single song."""
    song = (
        db.query(
            Song.id, Song.title, Song.movie_name, Song.artist,
            Song.album, Song.genre, Song.duration_seconds, Song.created_at
        )
        .filter(Song.id == song_id)
        .first()
    )
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    return SongOut(
        id=song.id, title=song.title, movie_name=song.movie_name, artist=song.artist,
        album=song.album, genre=song.genre, duration_seconds=song.duration_seconds,
        created_at=song.created_at,
    )


# ── Audio stream ──────────────────────────────────────────────────────────────

@router.get("/{song_id}/audio")
def stream_audio(song_id: int, db: Session = Depends(get_db)):
    """Stream the raw MP3 binary with Accept-Ranges support."""
    row = db.query(Song.title, Song.audio_data).filter(Song.id == song_id).first()
    if not row or not row.audio_data:
        raise HTTPException(status_code=404, detail="Audio not found")
    return Response(
        content=row.audio_data,
        media_type="audio/mpeg",
        headers={
            "Accept-Ranges": "bytes",
            "Content-Disposition": f'inline; filename="{row.title}.mp3"',
        },
    )
