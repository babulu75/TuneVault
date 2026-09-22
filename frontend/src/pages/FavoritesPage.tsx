import { Heart } from 'lucide-react'
import SongCard from '../_components/molecules/SongCard'
import Spinner from '../_components/atoms/Spinner'
import { useFavorites } from '../hooks/useFavorites'

export default function FavoritesPage() {
  const { favorites, loading } = useFavorites()
  const songs = favorites.map((f) => f.song).filter(Boolean) as any[]

  return (
    <div>
      <h1 className="page-title">Favorites</h1>
      <p className="page-subtitle">{favorites.length} liked song{favorites.length !== 1 ? 's' : ''}</p>

      {loading ? (
        <div className="flex-center" style={{ height: 200 }}><Spinner size={28} /></div>
      ) : favorites.length === 0 ? (
        <div className="empty-state">
          <Heart size={40} />
          <p>No favorites yet — click the ♥ on any song</p>
        </div>
      ) : (
        <div className="song-list">
          {favorites.map((fav, i) =>
            fav.song ? (
              <SongCard key={fav.id} song={fav.song} queue={songs} showIndex={i} />
            ) : null
          )}
        </div>
      )}
    </div>
  )
}
