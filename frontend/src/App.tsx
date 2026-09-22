import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PlayerProvider } from './context/PlayerContext'
import AppLayout from './_components/templates/AppLayout'
import HomePage from './pages/HomePage'
import LibraryPage from './pages/LibraryPage'
import PlaylistsPage from './pages/PlaylistsPage'
import PlaylistPage from './pages/PlaylistPage'
import FavoritesPage from './pages/FavoritesPage'
import LoginPage from './pages/LoginPage'
import NowPlayingPage from './pages/NowPlayingPage'
import { useAuth } from './hooks/useAuth'
import './styles/index.css'
import './styles/App.css'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={
              <AppLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/library" element={<LibraryPage />} />
                  <Route path="/now-playing" element={<NowPlayingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
                  <Route path="/playlists" element={<ProtectedRoute><PlaylistsPage /></ProtectedRoute>} />
                  <Route path="/playlists/:id" element={<ProtectedRoute><PlaylistPage /></ProtectedRoute>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppLayout>
            } />
          </Routes>
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
