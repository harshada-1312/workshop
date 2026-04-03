import { useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useApi from '../../hooks/useApi'
import { getBook, updateBook } from '../../api/books'
import BookForm from './BookForm'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function BookEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchBook = useCallback(() => getBook(id), [id])
  const { data: book, loading: fetchLoading } = useApi(fetchBook)

  const handleSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      await updateBook(id, data)
      navigate(`/books/${id}`)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) return <LoadingSpinner />

  return (
    <div>
      <Link to={`/books/${id}`} className="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Book</Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-1 mb-6">Edit Book</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <BookForm initialData={book} onSubmit={handleSubmit} loading={loading} error={error} />
      </div>
    </div>
  )
}
