import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePlayer } from '../../context/PlayerContext'
import { useNavigate } from 'react-router-dom'

export default function AudioPlayer() {
  const { state, dispatch, audioRef, togglePlay } = usePlayer()
  const navigate = useNavigate()
  const { currentSong, isPlaying, volume } = state
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setProgress(audio.currentTime)
    const onDur = () => setDuration(audio.duration)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('durationchange', onDur)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('durationchange', onDur)
    }
  }, [audioRef])

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value)
    if (audioRef.current) audioRef.current.currentTime = t
    setProgress(t)
  }

  const fmt = (s: number) => {
    if (!isFinite(s)) return '0:00'
    const m = Math.floor(s / 60)
    return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}`
  }

  const toggleMute = () => {
    if (audioRef.current) audioRef.current.muted = !muted
    setMuted((m) => !m)
  }

  if (!currentSong) return (
    <div className="audio-player audio-player--empty">
      <p className="audio-player__idle">Select a song to play</p>
    </div>
  )

  return (
    <div className="audio-player">
      {/* Song info */}
      <button className="audio-player__song" onClick={() => navigate('/now-playing')} aria-label="Open now playing">
        <div className="audio-player__disc" />
        <div>
          <p className="audio-player__title truncate">{currentSong.title}</p>
          <p className="audio-player__artist truncate">{currentSong.artist ?? 'Unknown'}</p>
        </div>
      </button>

      {/* Controls + Progress */}
      <div className="audio-player__center">
        <div className="audio-player__controls">
          <button className="icon-btn" onClick={() => dispatch({ type: 'PREV' })} aria-label="Previous">
            <SkipBack size={18} />
          </button>
          <button className="play-btn" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
          <button className="icon-btn" onClick={() => dispatch({ type: 'NEXT' })} aria-label="Next">
            <SkipForward size={18} />
          </button>
        </div>

        <div className="audio-player__progress">
          <span className="audio-player__time">{fmt(progress)}</span>
          <input
            type="range"
            className="progress-bar"
            min={0}
            max={duration || 100}
            value={progress}
            onChange={seek}
            aria-label="Seek"
          />
          <span className="audio-player__time">{fmt(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="audio-player__volume">
        <button className="icon-btn" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input
          type="range"
          className="progress-bar volume-bar"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={(e) => dispatch({ type: 'SET_VOLUME', volume: Number(e.target.value) })}
          aria-label="Volume"
        />
      </div>
    </div>
  )
}
