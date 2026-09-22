import api from './api'
import type { Favorite } from '../types'

export const favoriteService = {
  async getAll(): Promise<Favorite[]> {
    const { data } = await api.get<Favorite[]>('/favorites')
    return data
  },

  async add(songId: number): Promise<Favorite> {
    const { data } = await api.post<Favorite>(`/favorites/${songId}`)
    return data
  },

  async remove(songId: number): Promise<void> {
    await api.delete(`/favorites/${songId}`)
  },
}
