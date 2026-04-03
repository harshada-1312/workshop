import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/books', label: 'Books', icon: '📚' },
  { to: '/authors', label: 'Authors', icon: '✍️' },
  { to: '/collections', label: 'Collections', icon: '📁' },
  { to: '/search', label: 'Search', icon: '🔍' },
]

export default function Sidebar({ open, onClose }) {
  const nav = (
    <nav className="flex flex-col gap-1 p-4">
      {links.map((link) => (
        <NavLink key={link.to} to={link.to} end={link.to === '/'}
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
            }`
          }>
          <span>{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-56 lg:border-r lg:border-gray-200 lg:bg-white lg:min-h-screen">
        <div className="px-4 py-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-indigo-600">BookShelf</h1>
        </div>
        {nav}
      </div>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600/75" onClick={onClose} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="px-4 py-5 border-b border-gray-200 flex items-center justify-between">
              <h1 className="text-xl font-bold text-indigo-600">BookShelf</h1>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            {nav}
          </div>
        </div>
      )}
    </>
  )
}
