const today = new Date()
const dateAfter = (days) => {
  const date = new Date(today)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

export const initialTasks = [
  { id: 1, title: 'Build a responsive portfolio page', subject: 'Web Development', dueDate: dateAfter(1), priority: 'High', status: 'In Progress', description: 'Create a responsive portfolio using HTML, CSS and JavaScript.' },
  { id: 2, title: 'Prepare PCA experiment record', subject: 'Machine Learning', dueDate: dateAfter(2), priority: 'Medium', status: 'Pending', description: 'Complete the PCA implementation and record observations.' },
  { id: 3, title: 'Study network layer services', subject: 'Computer Networks', dueDate: dateAfter(4), priority: 'Low', status: 'Pending', description: 'Revise IPv4 addressing and network service models.' },
  { id: 4, title: 'Java OOP practice problems', subject: 'Java Programming', dueDate: dateAfter(-1), priority: 'Medium', status: 'Completed', description: 'Practice classes, objects and inheritance.' },
]
