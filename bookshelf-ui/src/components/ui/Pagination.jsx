export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, page + 2)

  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('...')
  }
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
      <div className="flex flex-1 justify-between sm:hidden">
        <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          Previous
        </button>
        <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
        <nav className="inline-flex -space-x-px rounded-md shadow-sm">
          <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 disabled:opacity-50">
            &laquo;
          </button>
          {pages.map((p, i) =>
            p === '...' ? (
              <span key={`e${i}`} className="relative inline-flex items-center px-4 py-2 text-sm text-gray-700 ring-1 ring-gray-300 ring-inset">...</span>
            ) : (
              <button key={p} onClick={() => onPageChange(p)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 ring-inset ${
                  p === page ? 'bg-indigo-600 text-white' : 'text-gray-900 hover:bg-gray-50'
                }`}>
                {p}
              </button>
            )
          )}
          <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 disabled:opacity-50">
            &raquo;
          </button>
        </nav>
      </div>
    </div>
  )
}
