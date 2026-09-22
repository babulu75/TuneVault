import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Music2 } from 'lucide-react'
import Input from '../_components/atoms/Input'
import Button from '../_components/atoms/Button'
import { authService } from '../services/authService'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    navigate('/')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = mode === 'login'
        ? await authService.login(username, password)
        : await authService.register(username, email, password)
      login(data.access_token, data.user)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.detail ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__logo">
          <Music2 size={28} />
          <span>TuneFault</span>
        </div>

        <h1 className="login-card__title">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="login-card__subtitle">
          {mode === 'login' ? 'Sign in to continue' : 'Start your music journey'}
        </p>

        <form className="login-card__form" onSubmit={handleSubmit}>
          <Input
            id="login-username"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your_username"
            autoComplete="username"
            required
          />
          {mode === 'register' && (
            <Input
              id="login-email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          )}
          <Input
            id="login-password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <Button type="submit" loading={loading} style={{ width: '100%' }}>
            {mode === 'login' ? 'Sign In' : 'Register'}
          </Button>
        </form>

        <p className="login-card__switch">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button className="link-btn" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null) }}>
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  )
}
