export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, page + 2)

  if (start > 1) { pages.push(1); if (start > 2) pages.push('...') }
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < totalPages) { if (end < totalPages - 1) pages.push('...'); pages.push(totalPages) }

  const btnBase = 'inline-flex items-center justify-center text-sm font-medium transition-all duration-200'

  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}
        className={`${btnBase} w-9 h-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:pointer-events-none`}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`e${i}`} className="w-9 h-9 flex items-center justify-center text-sm text-gray-400">...</span>
        ) : (
          <button key={p} onClick={() => onPageChange(p)}
            className={`${btnBase} w-9 h-9 rounded-lg ${
              p === page
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                : 'text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200'
            }`}>
            {p}
          </button>
        )
      )}

      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}
        className={`${btnBase} w-9 h-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:pointer-events-none`}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  )
}
