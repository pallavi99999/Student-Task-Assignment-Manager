import { useState } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import { CalendarClock, CheckCircle2, Clock3, ListTodo, Plus, Search } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import TaskModal from './components/TaskModal'
import TaskList from './components/TaskList'
import StatCard from './components/StatCard'
import { TaskProvider, useTasks } from './context/TaskContext'

const titles = { '/': 'Dashboard', '/assignments': 'My Assignments', '/calendar': 'Calendar', '/completed': 'Completed Tasks', '/settings': 'Settings' }
const prettyDate = (date) => new Intl.DateTimeFormat('en-IN', { weekday: 'long', month: 'long', day: 'numeric' }).format(date)

function Workspace() {
  const { tasks, addTask, updateTask, deleteTask, syncError } = useTasks()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const openAdd = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (task) => { setEditing(task); setModalOpen(true) }
  const saveTask = (task) => editing ? updateTask(editing.id, task) : addTask(task)
  const changeStatus = (id, status) => updateTask(id, { status })
  const activeTasks = tasks.filter((task) => task.status !== 'Completed')
  const completedTasks = tasks.filter((task) => task.status === 'Completed')
  const dueSoon = activeTasks.filter((task) => {
    const diff = (new Date(`${task.dueDate}T00:00:00`) - new Date(new Date().toDateString())) / 86400000
    return diff >= 0 && diff <= 7
  })
  const filtered = tasks.filter((task) => {
    const matchesSearch = `${task.title} ${task.subject}`.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'All' || task.status === filter
    return matchesSearch && matchesFilter
  })
  const pageTitle = titles[location.pathname] || 'Dashboard'

  const actions = { onEdit: openEdit, onDelete: (id) => { if (window.confirm('Delete this assignment?')) deleteTask(id) }, onStatusChange: changeStatus }

  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="main-area">
        <Topbar title={pageTitle} onMenu={() => setMenuOpen(true)} />
        <div className="page-content">
          {syncError && <div className="sync-notice" role="status">{syncError}</div>}
          <Routes>
            <Route path="/" element={<Dashboard tasks={tasks} activeTasks={activeTasks} completedTasks={completedTasks} dueSoon={dueSoon} onAdd={openAdd} actions={actions} />} />
            <Route path="/assignments" element={<Assignments tasks={filtered} search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} onAdd={openAdd} actions={actions} />} />
            <Route path="/calendar" element={<CalendarPage tasks={activeTasks} actions={actions} />} />
            <Route path="/completed" element={<CompletedPage tasks={completedTasks} actions={actions} />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </main>
      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={saveTask} task={editing} />
    </div>
  )
}

function Dashboard({ tasks, activeTasks, completedTasks, dueSoon, onAdd, actions }) {
  const firstName = 'Student'
  const today = new Date()
  const upcoming = [...activeTasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 4)
  return <>
    <section className="welcome-row"><div><span className="eyebrow">{prettyDate(today).toUpperCase()}</span><h2>Good to see you, {firstName} <span>✦</span></h2><p>Ready to make today productive? Here's your overview.</p></div><button className="button button-primary" onClick={onAdd}><Plus size={18} /> Add assignment</button></section>
    <section className="stats-grid">
      <StatCard label="Total assignments" value={tasks.length} note="Across all subjects" icon={ListTodo} tone="purple" />
      <StatCard label="In progress" value={tasks.filter((t) => t.status === 'In Progress').length} note="Keep the momentum" icon={Clock3} tone="blue" />
      <StatCard label="Due this week" value={dueSoon.length} note="Plan your study time" icon={CalendarClock} tone="orange" />
      <StatCard label="Completed" value={completedTasks.length} note="Great work so far" icon={CheckCircle2} tone="green" />
    </section>
    <section className="content-grid">
      <div className="panel assignments-panel"><div className="panel-heading"><div><h3>Upcoming assignments</h3><p>Your next tasks at a glance</p></div><Link to="/assignments" className="text-link">View all</Link></div><TaskList tasks={upcoming} {...actions} compact /></div>
      <div className="panel focus-panel"><div className="panel-heading"><div><h3>Your progress</h3><p>A little progress adds up</p></div></div><div className="progress-number">{tasks.length ? Math.round(completedTasks.length / tasks.length * 100) : 0}<span>%</span></div><div className="progress-track"><div style={{ width: `${tasks.length ? completedTasks.length / tasks.length * 100 : 0}%` }} /></div><p className="progress-caption">{completedTasks.length} of {tasks.length} assignments completed</p><div className="focus-tip"><span>✦</span><div><strong>Study tip</strong><p>Break bigger assignments into smaller, manageable steps.</p></div></div></div>
    </section>
    <section className="panel all-tasks-panel"><div className="panel-heading"><div><h3>All assignments</h3><p>Everything you're working on</p></div><button className="button button-light" onClick={onAdd}><Plus size={16} /> New task</button></div><TaskList tasks={tasks.slice(0, 5)} {...actions} /></section>
  </>
}

function Assignments({ tasks, search, setSearch, filter, setFilter, onAdd, actions }) {
  return <section className="panel page-panel"><div className="panel-heading"><div><h3>All assignments</h3><p>Organize and keep track of your coursework</p></div><button className="button button-primary" onClick={onAdd}><Plus size={17} /> Add assignment</button></div><div className="toolbar"><div className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assignments..." /></div><select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status"><option>All</option><option>Pending</option><option>In Progress</option><option>Completed</option></select></div><TaskList tasks={tasks} {...actions} /></section>
}

function CalendarPage({ tasks, actions }) {
  const sorted = [...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  const groups = sorted.reduce((acc, task) => { (acc[task.dueDate] ||= []).push(task); return acc }, {})
  return <section className="panel page-panel"><div className="panel-heading"><div><h3>Upcoming deadlines</h3><p>Keep an eye on what's coming up</p></div></div>{Object.keys(groups).length ? Object.entries(groups).map(([date, items]) => <div className="date-group" key={date}><div className="date-chip"><CalendarClock size={17} /><strong>{new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</strong></div><TaskList tasks={items} {...actions} compact /></div>) : <TaskList tasks={[]} {...actions} />}</section>
}

function CompletedPage({ tasks, actions }) {
  return <section className="panel page-panel"><div className="panel-heading"><div><h3>Completed assignments</h3><p>Look at everything you've finished</p></div><span className="completed-count">{tasks.length} completed</span></div><TaskList tasks={tasks} {...actions} /></section>
}

function SettingsPage() {
  const apiConfigured = Boolean(import.meta.env.VITE_API_URL)
  return <section className="panel page-panel settings-panel"><div className="panel-heading"><div><h3>Workspace settings</h3><p>Basic information about your TaskMate workspace</p></div></div><div className="settings-item"><div className="avatar">S</div><div><strong>Student workspace</strong><p>Your personal assignment manager</p></div></div><div className="settings-item"><div><strong>Data storage</strong><p>{apiConfigured ? 'Assignments sync with the TaskMate API and remain cached in this browser.' : 'Assignments are saved in this browser on this device.'}</p></div><span className="local-badge">{apiConfigured ? 'API sync' : 'Local storage'}</span></div><div className="settings-note">TaskMate helps students organize coursework, track deadlines, and build consistent study progress.</div></section>
}

export default function App() {
  return <TaskProvider><Workspace /></TaskProvider>
}