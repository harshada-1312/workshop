import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Navbar({ onMenuToggle }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim().length >= 2) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
      <button onClick={onMenuToggle} className="lg:hidden text-gray-500 hover:text-gray-700">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="lg:hidden text-lg font-bold text-indigo-600">BookShelf</div>
      <form onSubmit={handleSearch} className="flex-1 max-w-md ml-auto">
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Quick search..."
          className="w-full rounded-md border border-gray-300 py-1.5 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
      </form>
    </header>
  )
}
