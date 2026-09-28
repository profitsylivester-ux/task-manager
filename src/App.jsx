import { Routes, Route, NavLink } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import TaskList from './components/TaskList'
import NotesList from './components/NotesList'
import QuoteBox from './components/QuoteBox'

function App() {
  return (
    <div className="app">
      <Header title="Task Manager" subtitle="Organize your tasks. Get things done." />

      <nav className="tab-row">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
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

      <main>
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/notes" element={<NotesList />} />
          <Route path="/quote" element={<QuoteBox />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App