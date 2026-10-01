import { useState, useEffect } from 'react'

function TaskList() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [filter, setFilter] = useState('all')
  const [menuOpenId, setMenuOpenId] = useState(null)
  const [editingId, setEditingId] = useState(null)

  const API_URL = 'http://localhost:3000/tasks'

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch(API_URL)
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
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask.trim() }),
      })

      const newTaskFromServer = await response.json()
      setTasks([newTaskFromServer, ...tasks])
      setNewTask('')
    } catch (error) {
      console.error('Failed to add task:', error)
    }
  }

  async function deleteTask(id) {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  return (
    <div>
      <div className="input-row">
        <input
          type="text"
          placeholder="Add a new task"
          value={newTask}
          onChange={(event) => setNewTask(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') addTask()
          }}
        />
        <button onClick={addTask}>Add</button>
      </div>

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
            <li key={task._id}>
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
                <span
                  className="task-title"
                  onClick={(event) => {
                    event.stopPropagation()
                    setMenuOpenId(menuOpenId === task._id ? null : task._id)
                  }}
                >
                  {task.title} {task.completed && '✓'}
                </span>
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