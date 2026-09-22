import { useState } from 'react'
import SongCard from '../molecules/SongCard'
import SearchBar from '../molecules/SearchBar'
import Spinner from '../atoms/Spinner'
import type { Song } from '../../types'
import { Music } from 'lucide-react'

interface Props {
  songs: Song[]
  loading?: boolean
  error?: string | null
}

export default function SongList({ songs, loading, error }: Props) {
  const [query, setQuery] = useState('')

  const filtered = songs.filter((s) =>
    [s.title, s.artist, s.movie_name, s.genre]
      .filter(Boolean)
      .some((f) => f!.toLowerCase().includes(query.toLowerCase()))
  )

  if (loading) return <div className="flex-center" style={{ height: 200 }}><Spinner size={28} /></div>
  if (error) return <p style={{ color: 'var(--danger)' }}>{error}</p>

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {/* Column headers */}
      <div className="song-list-header">
        <span>#</span>
        <span style={{ gridColumn: '2/4' }}>Title</span>
        <span>Genre</span>
        <span>Time</span>
        <span />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Music size={40} />
          <p>{query ? 'No songs match your search' : 'No songs found'}</p>
        </div>
      ) : (
        <div className="song-list">
          {filtered.map((song, i) => (
            <SongCard key={song.id} song={song} queue={filtered} showIndex={i} />
          ))}
        </div>
      )}
    </div>
  )
}
