import { useState } from 'react'

function NotesList() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Project ideas',
      body: 'Ideas for new engineering and frontend projects.',
    },
    {
      id: 2,
      title: 'React learning notes',
      body: 'Components, props, state, useEffect, lists, forms.',
    },
  ])

  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')

  function addNote() {
    if (newTitle.trim() === '' && newBody.trim() === '') return

    const note = {
      id: Date.now(),
      title: newTitle || 'Untitled',
      body: newBody,
    }

    setNotes([...notes, note])
    setNewTitle('')
    setNewBody('')
  }

  function deleteNote(id) {
    setNotes(notes.filter((note) => note.id !== id))
  }

  function startEdit(note) {
    setEditingId(note.id)
    setEditTitle(note.title)
    setEditBody(note.body)
  }

  function saveEdit() {
    setNotes(
      notes.map((note) =>
        note.id === editingId
          ? { ...note, title: editTitle, body: editBody }
          : note
      )
    )
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

      <div className="notes-list">
        {notes.map((note) => (
          <div className="note-card" key={note.id}>
            {editingId === note.id ? (
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
                  <button onClick={() => deleteNote(note.id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotesList