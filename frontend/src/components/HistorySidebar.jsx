function HistorySidebar({ reviews, onSelect, onDelete, isOpen, onToggle }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateCode = (code, maxLen = 50) => {
    if (!code) return ''
    const firstLine = code.split('\n')[0]
    return firstLine.length > maxLen ? firstLine.substring(0, maxLen) + '...' : firstLine
  }

  return (
    <>
      <div className={`history-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header d-flex justify-content-between align-items-center p-3 border-bottom">
          <h6 className="mb-0 fw-bold">Review History</h6>
          <button className="btn btn-sm btn-outline-secondary" onClick={onToggle}>
            &#10005;
          </button>
        </div>

        <div className="sidebar-content">
          {reviews.length === 0 ? (
            <div className="text-center text-muted p-4">
              <p className="mb-0">No reviews yet</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="history-item p-3 border-bottom"
                onClick={() => onSelect(review)}
              >
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <span className="badge bg-secondary">
                    {review.language || 'Auto'}
                  </span>
                  <button
                    className="btn btn-outline-danger btn-sm py-0 px-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(review.id)
                    }}
                    title="Delete"
                  >
                    &#128465;
                  </button>
                </div>
                <div className="history-code text-truncate mt-1">
                  {truncateCode(review.code)}
                </div>
                <small className="text-muted">
                  {formatDate(review.createdAt)}
                </small>
              </div>
            ))
          )}
        </div>
      </div>

      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}
    </>
  )
}

export default HistorySidebar
