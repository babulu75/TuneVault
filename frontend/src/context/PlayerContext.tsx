import {
  createContext, useContext, useReducer, useRef, useEffect, type ReactNode
} from 'react'
import type { Song, PlayerState, PlayerAction } from '../types'
import { songService } from '../services/songService'

const initialState: PlayerState = {
  currentSong: null,
  queue: [],
  isPlaying: false,
  currentIndex: -1,
  volume: 0.8,
}

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'PLAY_SONG': {
      const queue = action.queue ?? state.queue
      const index = queue.findIndex((s) => s.id === action.song.id)
      return { ...state, currentSong: action.song, queue, currentIndex: index, isPlaying: true }
    }
    case 'PLAY_PAUSE':
      return { ...state, isPlaying: !state.isPlaying }
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.playing }
    case 'NEXT': {
      const next = state.currentIndex + 1
      if (next >= state.queue.length) return state
      return { ...state, currentSong: state.queue[next], currentIndex: next, isPlaying: true }
    }
    case 'PREV': {
      const prev = state.currentIndex - 1
      if (prev < 0) return state
      return { ...state, currentSong: state.queue[prev], currentIndex: prev, isPlaying: true }
    }
    case 'SET_VOLUME':
      return { ...state, volume: action.volume }
    case 'SET_QUEUE':
      return {
        ...state,
        queue: action.queue,
        currentIndex: action.index ?? 0,
        currentSong: action.queue[action.index ?? 0] ?? null,
        isPlaying: true,
      }
    default:
      return state
  }
}

interface PlayerContextValue {
  state: PlayerState
  audioRef: React.RefObject<HTMLAudioElement | null>
  dispatch: React.Dispatch<PlayerAction>
  playSong: (song: Song, queue?: Song[]) => void
  togglePlay: () => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Sync audio element with state
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (state.currentSong) {
      const url = songService.getAudioUrl(state.currentSong.id)
      if (audio.src !== url) {
        audio.src = url
        audio.load()
      }
      if (state.isPlaying) {
        audio.play().catch(() => {})
      } else {
        audio.pause()
      }
    }
  }, [state.currentSong, state.isPlaying])

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = state.volume
  }, [state.volume])

  const playSong = (song: Song, queue?: Song[]) => dispatch({ type: 'PLAY_SONG', song, queue })
  const togglePlay = () => dispatch({ type: 'PLAY_PAUSE' })

  return (
    <PlayerContext.Provider value={{ state, audioRef, dispatch, playSong, togglePlay }}>
      <audio
        ref={audioRef}
        onEnded={() => dispatch({ type: 'NEXT' })}
        onPlay={() => dispatch({ type: 'SET_PLAYING', playing: true })}
        onPause={() => dispatch({ type: 'SET_PLAYING', playing: false })}
      />
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider')
  return ctx
}
