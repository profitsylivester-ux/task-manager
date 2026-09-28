import { useState, useEffect } from 'react'

function TaskList() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [filter, setFilter] = useState('all')
  const [menuOpenId, setMenuOpenId] = useState(null)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    const initialTasks = [
      { id: 1, title: 'Study React', completed: true },
      { id: 2, title: 'Build a task manager', completed: false },
      { id: 3, title: 'Push to GitHub', completed: false },
    ]
    setTasks(initialTasks)
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

  function addTask() {
    if (newTask.trim() === '') return

    const task = {
      id: Date.now(),
      title: newTask,
      completed: false,
    }

    setTasks([...tasks, task])
    setNewTask('')
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  function toggleComplete(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  function saveEdit(id, newTitle) {
    if (newTitle.trim() === '') return

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    )

    setEditingId(null)
  }

  async function handleMenuAction(action, task) {
    if (action === 'delete') {
      deleteTask(task.id)
    } else if (action === 'complete') {
      toggleComplete(task.id)
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
      setEditingId(task.id)
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

  if (tasks.length === 0) {
    return <p>Loading tasks...</p>
  }

  return (
    <div>
      <div className="input-row">
        <input
          type="text"
          placeholder="Add a new task"
          value={newTask}
          onChange={(event) => setNewTask(event.target.value)}
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

      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task.id)}
            />

            {editingId === task.id ? (
              <input
                className="edit-input"
                type="text"
                defaultValue={task.title}
                autoFocus
                onBlur={(event) => saveEdit(task.id, event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    saveEdit(task.id, event.target.value)
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
                  setMenuOpenId(menuOpenId === task.id ? null : task.id)
                }}
              >
                {task.title} {task.completed && '✓'}
              </span>
            )}

            {menuOpenId === task.id && (
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
    </div>
  )
}

export default TaskList