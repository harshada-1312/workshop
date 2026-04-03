import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createAuthor } from '../../api/authors'
import AuthorForm from './AuthorForm'

export default function AuthorNew() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const result = await createAuthor(data)
      navigate(`/authors/${result.data.id}`)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link to="/authors" className="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Authors</Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-1 mb-6">New Author</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <AuthorForm onSubmit={handleSubmit} loading={loading} error={error} />
      </div>
    </div>
  )
}
