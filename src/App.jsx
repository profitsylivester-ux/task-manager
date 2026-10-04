import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import TaskList from './components/TaskList'
import NotesList from './components/NotesList'
import QuoteBox from './components/QuoteBox'
import InstallPrompt from './components/InstallPrompt'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setChecking(false)
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  if (checking) {
    return null
  }

  return (
    <div className="app">
      <Header
        title="Task Manager"
        subtitle="Organize your tasks. Get things done."
        user={user}
        onLogout={handleLogout}
      />

      <InstallPrompt />

      {user && (
        <nav className="tab-row">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            Tasks
          </NavLink>
          <NavLink
            to="/notes"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Notes
          </NavLink>
          <NavLink
            to="/quote"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Quote
          </NavLink>
        </nav>
      )}

      <main>
        <Routes>
          <Route path="/" element={user ? <TaskList /> : <Login />} />
          <Route path="/notes" element={user ? <NotesList /> : <Login />} />
          <Route path="/quote" element={user ? <QuoteBox /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>

      {user && (
        <nav className="bottom-nav">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className="bottom-nav-icon">☑</span>
            <span className="bottom-nav-label">Tasks</span>
          </NavLink>
          <NavLink
            to="/notes"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <span className="bottom-nav-icon">✎</span>
            <span className="bottom-nav-label">Notes</span>
          </NavLink>
          <NavLink
            to="/quote"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <span className="bottom-nav-icon">❝</span>
            <span className="bottom-nav-label">Quote</span>
          </NavLink>
        </nav>
      )}

      <Footer />
    </div>
  )
}

export default App