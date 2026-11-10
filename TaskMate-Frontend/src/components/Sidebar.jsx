import { NavLink } from 'react-router-dom'
import { BookOpenCheck, CalendarDays, CheckCheck, LayoutDashboard, Settings, X } from 'lucide-react'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/assignments', label: 'My Assignments', icon: BookOpenCheck },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/completed', label: 'Completed', icon: CheckCheck },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <button className="mobile-overlay" aria-label="Close menu" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><BookOpenCheck size={22} /></div>
          <span>task<span className="brand-accent">mate</span></span>
          <button className="icon-button sidebar-close" onClick={onClose} aria-label="Close menu"><X size={19} /></button>
        </div>
        <div className="nav-label">MENU</div>
        <nav className="nav-links">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={19} strokeWidth={1.9} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="study-card">
            <div className="study-icon">✦</div>
            <strong>Stay on track!</strong>
            <p>Small steps every day lead to big results.</p>
          </div>
          <div className="profile-row">
            <div className="avatar">S</div>
            <div><strong>Student</strong><span>My workspace</span></div>
          </div>
        </div>
      </aside>
    </>
  )
}