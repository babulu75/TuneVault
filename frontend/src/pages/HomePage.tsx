import SongList from '../_components/organisms/SongList'
import { useSongs } from '../hooks/useSongs'
import { useAuth } from '../hooks/useAuth'
import Button from '../_components/atoms/Button'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const { songs, loading, error } = useSongs()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">All Songs</h1>
          <p className="page-subtitle">{songs.length} tracks in your library</p>
        </div>
        {!isAuthenticated && (
          <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
            Sign in to save favorites & playlists
          </Button>
        )}
      </div>
      <SongList songs={songs} loading={loading} error={error} />
    </div>
  )
}
