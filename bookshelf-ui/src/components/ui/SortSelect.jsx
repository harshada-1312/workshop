export default function SortSelect({ options, sortBy, sortOrder, onSortChange }) {
  return (
    <div className="flex items-center gap-1.5">
      <select value={sortBy} onChange={(e) => onSortChange(e.target.value, sortOrder)}
        className="rounded-xl border border-gray-200 bg-gray-50 py-2 px-3 text-sm text-gray-700 focus:bg-white focus:border-brand-300 focus:ring-2 focus:ring-brand-100 focus:outline-none">
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <button onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}>
        {sortOrder === 'asc' ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" transform="scale(1,-1) translate(0,-24)" />
          </svg>
        )}
      </button>
    </div>
  )
}
