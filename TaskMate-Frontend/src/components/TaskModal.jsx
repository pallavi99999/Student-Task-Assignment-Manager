import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const emptyForm = { title: '', subject: '', dueDate: '', priority: 'Medium', status: 'Pending', description: '' }

export default function TaskModal({ open, onClose, onSave, task }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (open) setForm(task ? { ...emptyForm, ...task } : emptyForm)
  }, [open, task])

  if (!open) return null

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = (event) => {
    event.preventDefault()
    if (!form.title.trim() || !form.subject.trim() || !form.dueDate) return
    onSave({ ...form, title: form.title.trim(), subject: form.subject.trim() })
    onClose()
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()} onKeyDown={(event) => event.key === 'Escape' && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <div><span className="eyebrow">ASSIGNMENT DETAILS</span><h2 id="modal-title">{task ? 'Edit assignment' : 'Add new assignment'}</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <form onSubmit={submit} className="task-form">
          <label>Assignment title<input autoFocus name="title" value={form.title} onChange={change} placeholder="e.g. Complete React project" required /></label>
          <div className="form-grid">
            <label>Subject<input name="subject" value={form.subject} onChange={change} placeholder="e.g. Web Development" required /></label>
            <label>Due date<input type="date" name="dueDate" value={form.dueDate} onChange={change} required /></label>
            <label>Priority<select name="priority" value={form.priority} onChange={change}><option>Low</option><option>Medium</option><option>High</option></select></label>
            <label>Status<select name="status" value={form.status} onChange={change}><option>Pending</option><option>In Progress</option><option>Completed</option></select></label>
          </div>
          <label>Description <span className="optional">(optional)</span><textarea name="description" value={form.description} onChange={change} placeholder="Add a few details..." rows="3" /></label>
          <div className="modal-footer"><button type="button" className="button button-ghost" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit">{task ? 'Save changes' : 'Add assignment'}</button></div>
        </form>
      </section>
    </div>
  )
}