import { useState } from 'react'
import axios from 'axios'
import CodeInput from './components/CodeInput'
import ReviewResult from './components/ReviewResult'
import Loader from './components/Loader'

function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
    } catch (err) {
      const message =
        err.response?.data?.error ||
        'Failed to connect to the server. Make sure the backend is running.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand fw-bold">
            &#128269; AI Code Review Tool
          </span>
        </div>
      </nav>

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
