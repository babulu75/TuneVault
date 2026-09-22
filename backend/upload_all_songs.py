import os
import re
from pathlib import Path
from database import SessionLocal
from models import Song

def clean_song_metadata(filename: str):
    """
    Cleans up downloaded filename into readable song metadata.
    e.g. 'Aarambhame Le - SenSongsmp3.Co.mp3' -> 'Aarambhame Le'
    """
    base = os.path.splitext(filename)[0]
    # Remove promotional site watermarks
    cleaned = re.sub(r"\s*-\s*SenSongsmp3(\.Co)?", "", base, flags=re.IGNORECASE).strip()
    cleaned = re.sub(r"\s*-\s*Naa\s*Songs.*", "", cleaned, flags=re.IGNORECASE).strip()
    return cleaned

def upload_all_songs():
    songs_dir = Path(__file__).parent / "songs"
    
    if not songs_dir.exists():
        print(f"[ERROR] Songs directory not found at: {songs_dir}")
        return

    mp3_files = list(songs_dir.glob("*.mp3"))
    if not mp3_files:
        print(f"[INFO] No .mp3 files found in {songs_dir}")
        return

    print("=" * 65)
    print(f"  TuneVault Bulk Song Importer (Total files found: {len(mp3_files)})")
    print("=" * 65)

    db = SessionLocal()
    uploaded_count = 0
    skipped_count = 0

    try:
        for idx, file_path in enumerate(mp3_files, start=1):
            title = clean_song_metadata(file_path.name)
            
            # Check if this song is already uploaded to avoid duplicate blobs
            existing_song = db.query(Song).filter(Song.title == title).first()
            if existing_song:
                print(f"[{idx}/{len(mp3_files)}] [SKIPPED] '{title}' already in DB (ID: {existing_song.id})")
                skipped_count += 1
                continue

            file_size = file_path.stat().st_size
            file_size_mb = round(file_size / (1024 * 1024), 2)

            print(f"[{idx}/{len(mp3_files)}] [UPLOADING] '{title}' ({file_size_mb} MB)...", end="", flush=True)

            with open(file_path, "rb") as f:
                audio_bytes = f.read()

            song = Song(
                title=title,
                movie_name="TuneVault Library",
                artist="Original Artist",
                audio_data=audio_bytes
            )

            db.add(song)
            db.commit()
            db.refresh(song)

            print(f" -> Stored! (Assigned Song ID: {song.id})")
            uploaded_count += 1

        print("=" * 65)
        print(f"IMPORT COMPLETE!")
        print(f"  - Newly uploaded: {uploaded_count}")
        print(f"  - Skipped duplicates: {skipped_count}")
        print(f"  - Total songs in folder: {len(mp3_files)}")
        print("=" * 65)

    except Exception as e:
        db.rollback()
        print(f"\n[ERROR] An error occurred while uploading songs: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    upload_all_songs()
