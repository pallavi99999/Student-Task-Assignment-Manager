import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { initialTasks } from '../data/initialTasks'

const TaskContext = createContext(null)
const STORAGE_KEY = 'taskmate.assignments.v1'
const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '')

export function TaskProvider({ children }) {
  const [syncError, setSyncError] = useState('')
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : initialTasks
    } catch {
      return initialTasks
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    if (!API_URL) return
    fetch(`${API_URL}/api/assignments`)
      .then((response) => {
        if (!response.ok) throw new Error('Could not load assignments from the server.')
        return response.json()
      })
      .then((remoteTasks) => {
        setTasks(remoteTasks.map((task) => ({ ...task, id: task._id || task.id, dueDate: task.dueDate.slice(0, 10) })))
        setSyncError('')
      })
      .catch(() => setSyncError('Server unavailable. Changes are saved in this browser.'))
  }, [])

  const addTask = async (task) => {
    const localTask = { ...task, id: Date.now() }
    setTasks((current) => [localTask, ...current])
    if (!API_URL) return
    try {
      const response = await fetch(`${API_URL}/api/assignments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(task) })
      if (!response.ok) throw new Error('Could not save assignment.')
      const saved = await response.json()
      setTasks((current) => current.map((item) => item.id === localTask.id ? { ...saved, id: saved._id } : item))
      setSyncError('')
    } catch {
      setSyncError('Assignment saved locally. It could not be sent to the server.')
    }
  }

  const updateTask = async (id, changes) => {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, ...changes } : task))
    if (!API_URL || typeof id !== 'string') return
    try {
      const response = await fetch(`${API_URL}/api/assignments/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(changes) })
      if (!response.ok) throw new Error('Could not update assignment.')
      setSyncError('')
    } catch {
      setSyncError('Assignment updated locally. It could not be sent to the server.')
    }
  }

  const deleteTask = async (id) => {
    setTasks((current) => current.filter((task) => task.id !== id))
    if (!API_URL || typeof id !== 'string') return
    try {
      const response = await fetch(`${API_URL}/api/assignments/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Could not delete assignment.')
      setSyncError('')
    } catch {
      setSyncError('Assignment removed locally. It could not be removed from the server.')
    }
  }

  const value = useMemo(() => ({ tasks, addTask, updateTask, deleteTask, syncError }), [tasks, syncError])

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (!context) throw new Error('useTasks must be used inside TaskProvider')
  return context
}