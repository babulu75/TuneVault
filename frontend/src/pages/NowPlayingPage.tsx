import { Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'

export default function NowPlayingPage() {
  const { state, dispatch, togglePlay } = usePlayer()
  const { currentSong, isPlaying } = state

  if (!currentSong) {
    return (
      <div className="empty-state now-playing-empty">
        <img src="/default-cover.jpg" alt="" className="now-playing__cover" />
        <p>Select a song from your library to start listening.</p>
      </div>
    )
  }

  return (
    <section className="now-playing" aria-label="Now playing">
      <img src="/default-cover.jpg" alt="Album cover" className="now-playing__cover" />
      <div className="now-playing__details">
        <p className="now-playing__label">Now playing</p>
        <h1>{currentSong.title}</h1>
        <p>{currentSong.artist ?? 'Unknown Artist'}</p>
        {currentSong.movie_name && <p className="now-playing__album">{currentSong.movie_name}</p>}

        <div className="now-playing__controls">
          <button className="icon-btn" onClick={() => dispatch({ type: 'PREV' })} aria-label="Previous song">
            <SkipBack size={22} />
          </button>
          <button className="now-playing__play" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={26} fill="currentColor" /> : <Play size={26} fill="currentColor" />}
          </button>
          <button className="icon-btn" onClick={() => dispatch({ type: 'NEXT' })} aria-label="Next song">
            <SkipForward size={22} />
          </button>
        </div>
      </div>
    </section>
  )
}
