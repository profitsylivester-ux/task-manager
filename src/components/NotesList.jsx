import { useState, useEffect } from 'react'

function NotesList() {
  const [notes, setNotes] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')

  const API_URL = `${import.meta.env.VITE_API_URL.replace('/tasks', '/notes')}`
  const token = localStorage.getItem('token')
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  useEffect(() => {
    async function loadNotes() {
      try {
        const response = await fetch(API_URL, { headers: authHeaders })
        const data = await response.json()
        setNotes(data)
      } catch (error) {
        console.error('Failed to load notes:', error)
      }
    }

    loadNotes()
  }, [])

  async function addNote() {
    if (newTitle.trim() === '' && newBody.trim() === '') return

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ title: newTitle, body: newBody }),
      })

      const newNote = await response.json()
      setNotes([newNote, ...notes])
      setNewTitle('')
      setNewBody('')
    } catch (error) {
      console.error('Failed to add note:', error)
    }
  }

  async function deleteNote(id) {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      })
      setNotes(notes.filter((note) => note._id !== id))
    } catch (error) {
      console.error('Failed to delete note:', error)
    }
  }

  function startEdit(note) {
    setEditingId(note._id)
    setEditTitle(note.title)
    setEditBody(note.body)
  }

  async function saveEdit() {
    try {
      const response = await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ title: editTitle, body: editBody }),
      })

      const updated = await response.json()
      setNotes(notes.map((n) => (n._id === editingId ? updated : n)))
    } catch (error) {
      console.error('Failed to edit note:', error)
    }

    setEditingId(null)
    setEditTitle('')
    setEditBody('')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditTitle('')
    setEditBody('')
  }

  return (
    <div>
      <div className="note-form">
        <input
          type="text"
          placeholder="Note title"
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
        />
        <textarea
          placeholder="Write your note..."
          value={newBody}
          onChange={(event) => setNewBody(event.target.value)}
        />
        <button onClick={addNote}>Add Note</button>
      </div>

      {notes.length === 0 ? (
        <p className="empty-message">No notes yet.</p>
      ) : (
        <div className="notes-list">
          {notes.map((note) => (
            <div className="note-card" key={note._id}>
              {editingId === note._id ? (
                <div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                  />
                  <textarea
                    value={editBody}
                    onChange={(event) => setEditBody(event.target.value)}
                  />
                  <div className="note-actions">
                    <button onClick={saveEdit}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3>{note.title}</h3>
                  <p>{note.body}</p>
                  <div className="note-actions">
                    <button onClick={() => startEdit(note)}>Edit</button>
                    <button onClick={() => deleteNote(note._id)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotesList