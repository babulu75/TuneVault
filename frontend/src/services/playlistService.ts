import api from './api'
import type { Playlist } from '../types'

export const playlistService = {
  async getAll(): Promise<Playlist[]> {
    const { data } = await api.get<Playlist[]>('/playlists')
    return data
  },

  async getById(id: number): Promise<Playlist> {
    const { data } = await api.get<Playlist>(`/playlists/${id}`)
    return data
  },

  async create(name: string, description?: string): Promise<Playlist> {
    const { data } = await api.post<Playlist>('/playlists', { name, description })
    return data
  },

  async update(id: number, name?: string, description?: string): Promise<Playlist> {
    const { data } = await api.put<Playlist>(`/playlists/${id}`, { name, description })
    return data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/playlists/${id}`)
  },

  async addSong(playlistId: number, songId: number, position = 0): Promise<void> {
    await api.post(`/playlists/${playlistId}/songs`, { song_id: songId, position })
  },

  async removeSong(playlistId: number, songId: number): Promise<void> {
    await api.delete(`/playlists/${playlistId}/songs/${songId}`)
  },
}
