export default function SortSelect({ options, sortBy, sortOrder, onSortChange }) {
  return (
    <div className="flex items-center gap-2">
      <select value={sortBy} onChange={(e) => onSortChange(e.target.value, sortOrder)}
        className="rounded-md border border-gray-300 py-1.5 px-3 text-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500">
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <button onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
        className="rounded-md border border-gray-300 p-1.5 text-sm text-gray-600 hover:bg-gray-50"
        title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}>
        {sortOrder === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  )
}
