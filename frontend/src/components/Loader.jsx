function Loader() {
  return (
    <div className="loader-container text-center py-5">
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Analyzing code...</span>
      </div>
      <p className="mt-3 text-muted fw-medium">Analyzing your code with AI...</p>
    </div>
  )
}

export default Loader
