import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="mt-4 text-lg text-gray-600">Page not found</p>
      <Link to="/" className="mt-6 inline-block text-indigo-600 hover:text-indigo-800">
        Back to Dashboard
      </Link>
    </div>
  )
}
