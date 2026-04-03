import { useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useApi from '../../hooks/useApi'
import { getAuthor, updateAuthor } from '../../api/authors'
import AuthorForm from './AuthorForm'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function AuthorEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAuthor = useCallback(() => getAuthor(id), [id])
  const { data: author, loading: fetchLoading } = useApi(fetchAuthor)

  const handleSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      await updateAuthor(id, data)
      navigate(`/authors/${id}`)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) return <LoadingSpinner />

  return (
    <div>
      <Link to={`/authors/${id}`} className="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Author</Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-1 mb-6">Edit Author</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <AuthorForm initialData={author} onSubmit={handleSubmit} loading={loading} error={error} />
      </div>
    </div>
  )
}
