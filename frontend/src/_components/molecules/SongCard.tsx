import { Heart, Play, Plus } from 'lucide-react'
import type { Song, Playlist } from '../../types'
import { usePlayer } from '../../context/PlayerContext'
import { useAuth } from '../../hooks/useAuth'
import { useFavorites } from '../../hooks/useFavorites'
import { usePlaylists } from '../../hooks/usePlaylists'
import { useState } from 'react'

function formatDuration(s: number | null) {
  if (!s) return '--:--'
  const m = Math.floor(s / 60), sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

interface Props {
  song: Song
  queue?: Song[]
  showIndex?: number
}

export default function SongCard({ song, queue, showIndex }: Props) {
  const { playSong, state } = usePlayer()
  const { isAuthenticated } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { playlists, addSong } = usePlaylists()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = state.currentSong?.id === song.id
  const fav = isFavorite(song.id)

  const handlePlay = () => playSong(song, queue)

  const handleAddToPlaylist = async (pl: Playlist) => {
    try {
      await addSong(pl.id, song.id)
      setMenuOpen(false)
    } catch { /* ignore duplicate */ }
  }

  return (
    <div className={`song-card ${isActive ? 'song-card--active' : ''}`}>
      {showIndex !== undefined && (
        <span className="song-index">{showIndex + 1}</span>
      )}

      <button className="song-play-btn" onClick={handlePlay} aria-label={`Play ${song.title}`}>
        <Play size={14} fill="currentColor" />
      </button>

      <div className="song-info-block">
        <p className="song-title-text truncate">{song.title}</p>
        <p className="song-meta-text truncate">
          {song.artist ?? 'Unknown Artist'}
          {song.movie_name ? ` · ${song.movie_name}` : ''}
        </p>
      </div>

      <span className="song-genre truncate">{song.genre ?? ''}</span>

      <span className="song-duration">{formatDuration(song.duration_seconds)}</span>

      {isAuthenticated && (
        <div className="song-actions">
          <button
            className={`icon-btn ${fav ? 'icon-btn--active' : ''}`}
            onClick={() => toggleFavorite(song.id)}
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={15} fill={fav ? 'currentColor' : 'none'} />
          </button>

          <div className="relative">
            <button className="icon-btn" onClick={() => setMenuOpen((o) => !o)} aria-label="More options">
              <Plus size={15} />
            </button>
            {menuOpen && playlists.length > 0 && (
              <div className="dropdown">
                <p className="dropdown-label">Add to playlist</p>
                {playlists.map((pl) => (
                  <button key={pl.id} className="dropdown-item" onClick={() => handleAddToPlaylist(pl)}>
                    {pl.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
