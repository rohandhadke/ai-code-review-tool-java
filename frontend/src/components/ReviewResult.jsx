import { useState } from 'react'
import { downloadAsMarkdown, downloadAsPdf } from '../utils/downloadUtils'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      className={`btn btn-sm ${copied ? 'btn-success' : 'btn-outline-light'}`}
      onClick={handleCopy}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function ReviewResult({ data }) {
  return (
    <div className="review-results mt-4">
      {/* Download Buttons */}
      <div className="d-flex justify-content-end mb-3 gap-2">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => downloadAsMarkdown(data)}
        >
          &#8615; Markdown
        </button>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => downloadAsPdf(data)}
        >
          &#8615; PDF
        </button>
      </div>

      {/* Issues & Bugs */}
      <div className="card result-card mb-4">
        <div className="card-header bg-danger text-white d-flex align-items-center">
          <span className="me-2">&#9888;</span>
          <span className="fw-semibold">Issues & Bugs</span>
        </div>
        <div className="card-body">
          <pre className="result-text mb-0">{data.issues}</pre>
        </div>
      </div>

      {/* Refactored Code */}
      <div className="card result-card mb-4">
        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span className="me-2">&#10003;</span>
            <span className="fw-semibold">Refactored Code</span>
          </div>
          <CopyButton text={data.refactoredCode} />
        </div>
        <div className="card-body p-0">
          <pre className="code-output mb-0">{data.refactoredCode}</pre>
        </div>
      </div>

      {/* Explanation */}
      <div className="card result-card mb-4">
        <div className="card-header bg-info text-white d-flex align-items-center">
          <span className="me-2">&#128712;</span>
          <span className="fw-semibold">Explanation</span>
        </div>
        <div className="card-body">
          <pre className="result-text mb-0">{data.explanation}</pre>
        </div>
      </div>
    </div>
  )
}

export default ReviewResult
