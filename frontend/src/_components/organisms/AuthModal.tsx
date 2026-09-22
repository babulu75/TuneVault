import { useState } from 'react'
import { X } from 'lucide-react'
import Input from '../atoms/Input'
import Button from '../atoms/Button'
import { authService } from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'

interface Props {
  onClose: () => void
}

export default function AuthModal({ onClose }: Props) {
  const { login } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      let data
      if (mode === 'login') {
        data = await authService.login(username, password)
      } else {
        data = await authService.register(username, email, password)
      }
      login(data.access_token, data.user)
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.detail ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{mode === 'login' ? 'Sign In' : 'Create Account'}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          <Input id="auth-username" label="Username" value={username}
            onChange={(e) => setUsername(e.target.value)} placeholder="your_username" required />
          {mode === 'register' && (
            <Input id="auth-email" label="Email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          )}
          <Input id="auth-password" label="Password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />

          {error && <p className="auth-error">{error}</p>}

          <Button type="submit" loading={loading} style={{ width: '100%', marginTop: 8 }}>
            {mode === 'login' ? 'Sign In' : 'Register'}
          </Button>
        </form>

        <p className="modal__switch">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button className="link-btn" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null) }}>
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  )
}
