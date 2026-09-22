import { useState, useEffect, useCallback } from 'react'
import type { Playlist } from '../types'
import { playlistService } from '../services/playlistService'
import { useAuth } from './useAuth'

export function usePlaylists() {
  const { isAuthenticated } = useAuth()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPlaylists = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      setLoading(true)
      setError(null)
      const data = await playlistService.getAll()
      setPlaylists(data)
    } catch {
      setError('Failed to load playlists')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => { fetchPlaylists() }, [fetchPlaylists])

  const createPlaylist = async (name: string, description?: string) => {
    const pl = await playlistService.create(name, description)
    setPlaylists((prev) => [...prev, pl])
    return pl
  }

  const deletePlaylist = async (id: number) => {
    await playlistService.delete(id)
    setPlaylists((prev) => prev.filter((p) => p.id !== id))
  }

  const addSong = async (playlistId: number, songId: number) => {
    await playlistService.addSong(playlistId, songId)
    await fetchPlaylists()
  }

  const removeSong = async (playlistId: number, songId: number) => {
    await playlistService.removeSong(playlistId, songId)
    await fetchPlaylists()
  }

  return { playlists, loading, error, refetch: fetchPlaylists, createPlaylist, deletePlaylist, addSong, removeSong }
}
