import type { ReactNode } from 'react'
import Sidebar from '../organisms/Sidebar'
import AudioPlayer from '../molecules/AudioPlayer'

/** The shared authenticated application frame. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">{children}</main>
      <AudioPlayer />
    </div>
  )
}
