import api, { API_BASE_URL } from './api'
import type { Song } from '../types'

export const songService = {
  async getAll(): Promise<Song[]> {
    const { data } = await api.get<Song[]>('/songs')
    return data
  },

  async getById(id: number): Promise<Song> {
    const { data } = await api.get<Song>(`/songs/${id}`)
    return data
  },

  getAudioUrl(id: number): string {
    return `${API_BASE_URL}/songs/${id}/audio`
  },

  async upload(formData: FormData): Promise<Song> {
    const { data } = await api.post<Song>('/songs/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
}
