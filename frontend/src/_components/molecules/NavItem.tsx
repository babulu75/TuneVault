import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'

interface Props {
  to: string
  icon: LucideIcon
  label: string
}

export default function NavItem({ to, icon: Icon, label }: Props) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}
    >
      <Icon size={18} />
      <span className="nav-item__label">{label}</span>
    </NavLink>
  )
}
