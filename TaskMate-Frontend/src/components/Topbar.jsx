import { Bell, Menu, Search } from 'lucide-react'

export default function Topbar({ title, onMenu }) {
  const today = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }).format(new Date())
  return (
    <header className="topbar">
      <button className="icon-button menu-button" onClick={onMenu} aria-label="Open menu"><Menu size={21} /></button>
      <div className="topbar-heading"><span className="eyebrow">YOUR WORKSPACE</span><h1>{title}</h1></div>
      <div className="topbar-actions">
        <div className="today-label">{today}</div>
        <button className="icon-button notification-button" aria-label="Notifications"><Bell size={19} /><i /></button>
        <div className="avatar top-avatar">S</div>
      </div>
    </header>
  )
}