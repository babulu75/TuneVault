// ── Domain Types ──────────────────────────────────────────────────────────────

export interface User {
  id: number
  username: string
  email: string
  is_active: boolean
  created_at: string
}

export interface Song {
  id: number
  title: string
  movie_name: string | null
  artist: string | null
  album: string | null
  genre: string | null
  duration_seconds: number | null
  created_at: string
}

export interface PlaylistSong {
  id: number
  playlist_id: number
  song_id: number
  position: number
  added_at: string
  song: Song | null
}

export interface Playlist {
  id: number
  name: string
  description: string | null
  owner_id: number
  created_at: string
  songs: PlaylistSong[]
}

export interface Favorite {
  id: number
  user_id: number
  song_id: number
  created_at: string
  song: Song | null
}

export interface AuthToken {
  access_token: string
  token_type: string
  user: User
}

// ── Player State ──────────────────────────────────────────────────────────────

export interface PlayerState {
  currentSong: Song | null
  queue: Song[]
  isPlaying: boolean
  currentIndex: number
  volume: number
}

export type PlayerAction =
  | { type: 'PLAY_SONG'; song: Song; queue?: Song[] }
  | { type: 'PLAY_PAUSE' }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'SET_PLAYING'; playing: boolean }
  | { type: 'SET_QUEUE'; queue: Song[]; index?: number }
