import { useState } from 'react'
import { Plus } from 'lucide-react'
import PlaylistCard from '../molecules/PlaylistCard'
import Button from '../atoms/Button'
import Input from '../atoms/Input'
import Spinner from '../atoms/Spinner'
import { usePlaylists } from '../../hooks/usePlaylists'
import { useNavigate } from 'react-router-dom'

export default function PlaylistPanel() {
  const { playlists, loading, createPlaylist, deletePlaylist } = usePlaylists()
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const navigate = useNavigate()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    await createPlaylist(newName.trim())
    setNewName('')
    setShowForm(false)
    setCreating(false)
  }

  if (loading) return <div className="flex-center" style={{ height: 120 }}><Spinner /></div>

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <h2 className="page-title" style={{ marginBottom: 0 }}>Playlists</h2>
        <Button variant="ghost" size="sm" onClick={() => setShowForm((s) => !s)}>
          <Plus size={14} />
          New
        </Button>
      </div>

      {showForm && (
        <form className="create-form" onSubmit={handleCreate}>
          <Input id="playlist-name" placeholder="Playlist name…" value={newName}
            onChange={(e) => setNewName(e.target.value)} />
          <Button size="sm" type="submit" loading={creating}>Create</Button>
        </form>
      )}

      {playlists.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No playlists yet</p>
      ) : (
        <div className="playlist-grid">
          {playlists.map((pl) => (
            <PlaylistCard
              key={pl.id}
              playlist={pl}
              onClick={() => navigate(`/playlists/${pl.id}`)}
              onDelete={() => deletePlaylist(pl.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
