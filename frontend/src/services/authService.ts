import api from './api'
import type { AuthToken, User } from '../types'

export const authService = {
  async register(username: string, email: string, password: string): Promise<AuthToken> {
    const { data } = await api.post<AuthToken>('/auth/register', { username, email, password })
    return data
  },

  async login(username: string, password: string): Promise<AuthToken> {
    const { data } = await api.post<AuthToken>('/auth/login', { username, password })
    return data
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<User>('/auth/me')
    return data
  },
}
