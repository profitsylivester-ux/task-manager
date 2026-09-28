import { useState, useEffect } from 'react'

function QuoteBox() {
  const [quote, setQuote] = useState('')
  const [author, setAuthor] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchQuote() {
    setLoading(true)
    setError(null)

    try {
     const response = await fetch('https://dummyjson.com/quotes/random')
      if (!response.ok) {
        throw new Error('Failed to fetch quote')
      }

      const data = await response.json()
    setQuote(data.quote)
setAuthor(data.author)
    } catch (err) {
      setError('Could not load a quote. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuote()
  }, [])

  return (
    <div className="quote-box">
      {loading && <p>Loading...</p>}

      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <>
          <p className="quote-text">"{quote}"</p>
          <p className="quote-author">— {author}</p>
          <button onClick={fetchQuote}>New Quote</button>
        </>
      )}
    </div>
  )
}

export default QuoteBox