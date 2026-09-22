import { useState, useEffect, useCallback } from 'react'
import type { Song } from '../types'
import { songService } from '../services/songService'

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSongs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await songService.getAll()
      setSongs(data)
    } catch {
      setError('Failed to load songs')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSongs() }, [fetchSongs])

  return { songs, loading, error, refetch: fetchSongs }
}
