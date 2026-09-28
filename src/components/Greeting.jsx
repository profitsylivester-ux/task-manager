import { useState } from 'react'

function Greeting() {
  const [name, setName] = useState('')

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <p>Hello, {name || 'stranger'}!</p>
    </div>
  )
}

export default Greeting