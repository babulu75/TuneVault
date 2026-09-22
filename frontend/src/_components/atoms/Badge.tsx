import type { ReactNode } from 'react'

type BadgeColor = 'default' | 'accent' | 'success' | 'danger'

export default function Badge({ children, color = 'default' }: { children: ReactNode; color?: BadgeColor }) {
  return <span className={`badge badge-${color}`}>{children}</span>
}
