import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-100 to-violet-100 flex items-center justify-center mb-6">
        <span className="text-5xl font-bold text-brand-300">?</span>
      </div>
      <h1 className="text-6xl font-bold bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent">404</h1>
      <p className="mt-3 text-lg text-gray-600 font-medium">Page not found</p>
      <p className="mt-1 text-sm text-gray-400">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        Back to Dashboard
      </Link>
    </div>
  )
}
