import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ListMusic } from 'lucide-react'
import SongCard from '../_components/molecules/SongCard'
import Spinner from '../_components/atoms/Spinner'
import Button from '../_components/atoms/Button'
import { playlistService } from '../services/playlistService'
import type { Playlist } from '../types'

export default function PlaylistPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    playlistService.getById(Number(id))
      .then(setPlaylist)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex-center" style={{ height: 300 }}><Spinner size={28} /></div>
  if (!playlist) return <p style={{ color: 'var(--danger)' }}>Playlist not found</p>

  const songs = playlist.songs.map((ps) => ps.song).filter(Boolean) as any[]

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate('/playlists')} style={{ marginBottom: 20 }}>
        <ArrowLeft size={15} /> Back
      </Button>

      <div className="playlist-header">
        <div className="playlist-header__icon">
          <ListMusic size={36} />
        </div>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>{playlist.name}</h1>
          {playlist.description && <p className="page-subtitle" style={{ marginBottom: 4 }}>{playlist.description}</p>}
          <p className="page-subtitle">{playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {playlist.songs.length === 0 ? (
        <div className="empty-state">
          <ListMusic size={40} />
          <p>This playlist is empty — add songs from the library</p>
        </div>
      ) : (
        <div className="song-list">
          {playlist.songs.map((ps, i) =>
            ps.song ? <SongCard key={ps.id} song={ps.song} queue={songs} showIndex={i} /> : null
          )}
        </div>
      )}
    </div>
  )
}
