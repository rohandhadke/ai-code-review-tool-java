import { useState, useEffect } from 'react'
import axios from 'axios'
import CodeInput from './components/CodeInput'
import ReviewResult from './components/ReviewResult'
import Loader from './components/Loader'
import HistorySidebar from './components/HistorySidebar'

function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [reviews, setReviews] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/reviews')
      setReviews(res.data)
    } catch {
      // Silently fail — sidebar just stays empty
    }
  }

  const handleReview = async (code, language) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await axios.post('http://localhost:8080/api/review', {
        code,
        language
      })
      setResult(response.data)
      fetchReviews()
    } catch (err) {
      const message =
        err.response?.data?.error ||
        'Failed to connect to the server. Make sure the backend is running.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectReview = (review) => {
    setResult(review)
    setError(null)
    setSidebarOpen(false)
  }

  const handleDeleteReview = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/reviews/${id}`)
      setReviews(reviews.filter((r) => r.id !== id))
      if (result && result.id === id) {
        setResult(null)
      }
    } catch {
      // Silently fail
    }
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <div className="app">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid px-3">
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-light btn-sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Review History"
            >
              &#9776;
            </button>
            <span className="navbar-brand mb-0 fw-bold">
              &#128269; AI Code Review Tool
            </span>
          </div>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? '\u263E' : '\u2600'}
          </button>
        </div>
      </nav>

      <HistorySidebar
        reviews={reviews}
        onSelect={handleSelectReview}
        onDelete={handleDeleteReview}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
      />

      <main className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="text-center mb-4">
              <h1 className="h3 fw-bold">AI-Powered Code Review</h1>
              <p className="text-muted">
                Paste your code below and get instant feedback on bugs, improvements, and explanations.
              </p>
            </div>

            <CodeInput onSubmit={handleReview} loading={loading} />

            {error && (
              <div className="alert alert-danger mt-4" role="alert">
                <strong>Error: </strong>{error}
              </div>
            )}

            {loading && <Loader />}

            {result && !loading && <ReviewResult data={result} />}
          </div>
        </div>
      </main>

      <footer className="text-center text-muted py-3 mt-4 border-top">
        <small>Made by Rohan☺</small>
      </footer>
    </div>
  )
}

export default App
