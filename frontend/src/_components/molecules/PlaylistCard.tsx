import { ListMusic, Trash2 } from 'lucide-react'
import type { Playlist } from '../../types'

interface Props {
  playlist: Playlist
  onClick: () => void
  onDelete?: () => void
}

export default function PlaylistCard({ playlist, onClick, onDelete }: Props) {
  return (
    <div className="playlist-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}>
      <div className="playlist-card__icon">
        <ListMusic size={22} />
      </div>
      <div className="playlist-card__info">
        <p className="playlist-card__name truncate">{playlist.name}</p>
        <p className="playlist-card__count">{playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}</p>
      </div>
      {onDelete && (
        <button
          className="icon-btn"
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          aria-label="Delete playlist"
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  )
}
