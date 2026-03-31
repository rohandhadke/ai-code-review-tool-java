import { useState } from 'react'

const languages = [
  'Java', 'Python', 'JavaScript', 'TypeScript', 'C++',
  'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin'
]

function CodeInput({ onSubmit, loading }) {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('')

  const handleSubmit = () => {
    if (!code.trim()) return
    onSubmit(code, language || undefined)
  }

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="code-input-section">
      <div className="mb-3">
        <label htmlFor="language-select" className="form-label fw-semibold">
          Programming Language
        </label>
        <select
          id="language-select"
          className="form-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="">Auto-detect</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="code-textarea" className="form-label fw-semibold">
          Your Code
        </label>
        <textarea
          id="code-textarea"
          className="form-control code-textarea"
          rows="14"
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck="false"
        />
        <div className="form-text">Press Ctrl + Enter to submit</div>
      </div>

      <button
        className="btn btn-primary btn-lg w-100"
        onClick={handleSubmit}
        disabled={loading || !code.trim()}
      >
        {loading ? 'Reviewing...' : 'Review Code'}
      </button>
    </div>
  )
}

export default CodeInput
