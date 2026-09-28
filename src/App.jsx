import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import TaskList from './components/TaskList'
import NotesList from './components/NotesList'

function App() {
  const [activeTab, setActiveTab] = useState('tasks')

  return (
    <div className="app">
      <Header title="Task Manager" subtitle="Organize your tasks. Get things done." />

      <div className="tab-row">
        <button
          className={activeTab === 'tasks' ? 'active' : ''}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button
          className={activeTab === 'notes' ? 'active' : ''}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
      </div>

      <main>
        {activeTab === 'tasks' && <TaskList />}
        {activeTab === 'notes' && <NotesList />}
      </main>

      <Footer />
    </div>
  )
}

export default App
