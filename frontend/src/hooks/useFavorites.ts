import { useState, useEffect, useCallback } from 'react'
import type { Favorite } from '../types'
import { favoriteService } from '../services/favoriteService'
import { useAuth } from './useAuth'

export function useFavorites() {
  const { isAuthenticated } = useAuth()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(false)

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      setLoading(true)
      const data = await favoriteService.getAll()
      setFavorites(data)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => { fetchFavorites() }, [fetchFavorites])

  const isFavorite = (songId: number) => favorites.some((f) => f.song_id === songId)

  const toggleFavorite = async (songId: number) => {
    if (isFavorite(songId)) {
      await favoriteService.remove(songId)
      setFavorites((prev) => prev.filter((f) => f.song_id !== songId))
    } else {
      const fav = await favoriteService.add(songId)
      setFavorites((prev) => [fav, ...prev])
    }
  }

  return { favorites, loading, isFavorite, toggleFavorite, refetch: fetchFavorites }
}
