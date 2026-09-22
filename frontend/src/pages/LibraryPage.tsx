import SongList from '../_components/organisms/SongList'
import { useSongs } from '../hooks/useSongs'

export default function LibraryPage() {
  const { songs, loading, error } = useSongs()
  return (
    <div>
      <h1 className="page-title">Library</h1>
      <p className="page-subtitle">All uploaded tracks</p>
      <SongList songs={songs} loading={loading} error={error} />
    </div>
  )
}
