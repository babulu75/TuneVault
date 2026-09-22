import { Home, Library, Heart, LogOut, LogIn, Music2, Radio } from 'lucide-react'
import NavItem from '../molecules/NavItem'
import Avatar from '../atoms/Avatar'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Sidebar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar__logo">
        <Music2 size={22} className="sidebar__logo-icon" />
        <span className="sidebar__logo-text">TuneFault</span>
      </div>

      {/* Nav links */}
      <nav className="sidebar__nav">
        <NavItem to="/" icon={Home} label="Home" />
        <NavItem to="/library" icon={Library} label="Library" />
        <NavItem to="/now-playing" icon={Radio} label="Now Playing" />
        {isAuthenticated && <NavItem to="/favorites" icon={Heart} label="Favorites" />}
        {isAuthenticated && <NavItem to="/playlists" icon={Library} label="Playlists" />}
      </nav>

      {/* User section */}
      <div className="sidebar__footer">
        {isAuthenticated && user ? (
          <>
            <div className="sidebar__user">
              <Avatar name={user.username} size={30} />
              <span className="sidebar__username truncate">{user.username}</span>
            </div>
            <button className="sidebar__logout" onClick={handleLogout} aria-label="Logout">
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <NavItem to="/login" icon={LogIn} label="Sign In" />
        )}
      </div>
    </aside>
  )
}
