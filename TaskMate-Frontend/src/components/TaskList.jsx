import { Check, Edit2, MoreHorizontal, Trash2 } from 'lucide-react'

const formatDate = (value) => new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export default function TaskList({ tasks, onEdit, onDelete, onStatusChange, compact = false }) {
  if (!tasks.length) return <div className="empty-state"><div className="empty-icon">✦</div><strong>No assignments found</strong><p>Add an assignment or change your filters.</p></div>
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <article className="task-row" key={task.id}>
          <button className={`task-check ${task.status === 'Completed' ? 'checked' : ''}`} onClick={() => onStatusChange(task.id, task.status === 'Completed' ? 'Pending' : 'Completed')} aria-label="Toggle completed">{task.status === 'Completed' && <Check size={14} />}</button>
          <div className="task-main">
            <strong className={task.status === 'Completed' ? 'task-done' : ''}>{task.title}</strong>
            <span>{task.subject} <i>·</i> Due {formatDate(task.dueDate)}</span>
          </div>
          {!compact && <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>}
          <span className={`status status-${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span>
          <div className="task-actions">
            <button className="icon-button small" onClick={() => onEdit(task)} aria-label="Edit assignment"><Edit2 size={15} /></button>
            <button className="icon-button small delete-action" onClick={() => onDelete(task.id)} aria-label="Delete assignment"><Trash2 size={15} /></button>
          </div>
        </article>
      ))}
    </div>
  )
}