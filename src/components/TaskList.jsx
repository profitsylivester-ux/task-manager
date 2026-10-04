import { useState, useEffect } from 'react'
import { requestNotificationPermission, showNotification } from '../notifications'

function TaskList() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [filter, setFilter] = useState('all')
  const [menuOpenId, setMenuOpenId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL
  const token = localStorage.getItem('token')
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch(API_URL, { headers: authHeaders })
        const data = await response.json()
        setTasks(data)
      } catch (error) {
        console.error('Failed to load tasks:', error)
      }
    }

    loadTasks()
  }, [])

  useEffect(() => {
    document.title = `${tasks.length} tasks`
  }, [tasks])

  useEffect(() => {
    requestNotificationPermission()
  }, [])

  useEffect(() => {
    function checkDueTasks() {
      tasks.forEach((task) => {
        if (!task.dueDate || task.completed) return

        const dueTime = new Date(task.dueDate).getTime()
        const now = Date.now()
        const diff = now - dueTime

        if (diff >= 0 && diff < 60000) {
          showNotification('Task due', task.title)
        }
      })
    }

    const interval = setInterval(checkDueTasks, 30000)

    return () => clearInterval(interval)
  }, [tasks])

  useEffect(() => {
    function handleClickOutside() {
      setMenuOpenId(null)
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  async function addTask() {
    if (newTask.trim() === '') return

    try {
      const body = { title: newTask.trim() }
      if (newDueDate) {
        body.dueDate = new Date(newDueDate).toISOString()
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(body),
      })

      const newTaskFromServer = await response.json()
      setTasks([newTaskFromServer, ...tasks])
      setNewTask('')
      setNewDueDate('')
      setSheetOpen(false)
    } catch (error) {
      console.error('Failed to add task:', error)
    }
  }

  async function deleteTask(id) {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      })
      setTasks(tasks.filter((task) => task._id !== id))
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  async function toggleComplete(id) {
    const task = tasks.find((t) => t._id === id)
    if (!task) return

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ completed: !task.completed }),
      })

      const updated = await response.json()
      setTasks(tasks.map((t) => (t._id === id ? updated : t)))
    } catch (error) {
      console.error('Failed to toggle task:', error)
    }
  }

  async function saveEdit(id, newTitle) {
    if (newTitle.trim() === '') {
      setEditingId(null)
      return
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ title: newTitle.trim() }),
      })

      const updated = await response.json()
      setTasks(tasks.map((t) => (t._id === id ? updated : t)))
    } catch (error) {
      console.error('Failed to edit task:', error)
    }

    setEditingId(null)
  }

  async function handleMenuAction(action, task) {
    if (action === 'delete') {
      await deleteTask(task._id)
    } else if (action === 'complete') {
      await toggleComplete(task._id)
    } else if (action === 'copy') {
      navigator.clipboard.writeText(task.title)
      alert('Copied to clipboard!')
    } else if (action === 'share') {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Task',
            text: task.title,
          })
        } catch (error) {
          // user cancelled
        }
      } else {
        alert(`Your browser does not support sharing. Task: ${task.title}`)
      }
    } else if (action === 'edit') {
      setEditingId(task._id)
      setMenuOpenId(null)
      return
    }

    setMenuOpenId(null)
  }

  function formatDueDate(dateString) {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  function isOverdue(task) {
    if (!task.dueDate || task.completed) return false
    return new Date(task.dueDate) < new Date()
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  return (
    <div>
      {/* DESKTOP INPUT ROW */}
      <div className="input-row desktop-only">
        <input
          type="text"
          placeholder="Add a new task"
          value={newTask}
          onChange={(event) => setNewTask(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') addTask()
          }}
        />
        <input
          type="datetime-local"
          value={newDueDate}
          onChange={(event) => setNewDueDate(event.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {/* FLOATING PEN (mobile only) */}
      <button
        className="fab"
        onClick={() => setSheetOpen(true)}
        aria-label="Add task"
      >
        ✎
      </button>

      {/* BOTTOM SHEET (mobile only) */}
      {sheetOpen && (
        <div className="sheet-overlay" onClick={() => setSheetOpen(false)}>
          <div className="sheet" onClick={(event) => event.stopPropagation()}>
            <div className="sheet-handle"></div>
            <h3 className="sheet-title">New Task</h3>

            <input
              type="text"
              placeholder="Task title"
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
              autoFocus
            />

            <label className="sheet-label">Due date (optional)</label>
            <input
              type="datetime-local"
              value={newDueDate}
              onChange={(event) => setNewDueDate(event.target.value)}
            />

            <div className="sheet-actions">
              <button className="sheet-cancel" onClick={() => setSheetOpen(false)}>
                Cancel
              </button>
              <button className="sheet-add" onClick={addTask}>
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="filter-row">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="empty-message">No tasks to show.</p>
      ) : (
        <ul>
          {filteredTasks.map((task) => (
            <li key={task._id} className={isOverdue(task) ? 'overdue' : ''}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task._id)}
              />

              {editingId === task._id ? (
                <input
                  className="edit-input"
                  type="text"
                  defaultValue={task.title}
                  autoFocus
                  onBlur={(event) => saveEdit(task._id, event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      saveEdit(task._id, event.target.value)
                    } else if (event.key === 'Escape') {
                      setEditingId(null)
                    }
                  }}
                />
              ) : (
                <div
                  className="task-info"
                  onClick={(event) => {
                    event.stopPropagation()
                    setMenuOpenId(menuOpenId === task._id ? null : task._id)
                  }}
                >
                  <span className="task-title">
                    {task.title} {task.completed && '✓'}
                  </span>
                  {task.dueDate && (
                    <span className="task-due-date">
                      Due: {formatDueDate(task.dueDate)}
                    </span>
                  )}
                </div>
              )}

              {menuOpenId === task._id && (
                <div
                  className="task-menu"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button onClick={() => handleMenuAction('copy', task)}>
                    Copy
                  </button>
                  <button onClick={() => handleMenuAction('share', task)}>
                    Share
                  </button>
                  <button onClick={() => handleMenuAction('edit', task)}>
                    Edit
                  </button>
                  <button onClick={() => handleMenuAction('complete', task)}>
                    Mark Complete
                  </button>
                  <button onClick={() => handleMenuAction('delete', task)}>
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TaskList