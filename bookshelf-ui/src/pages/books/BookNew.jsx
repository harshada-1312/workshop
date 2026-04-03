import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createBook } from '../../api/books'
import BookForm from './BookForm'

export default function BookNew() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const result = await createBook(data)
      navigate(`/books/${result.data.id}`)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link to="/books" className="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Books</Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-1 mb-6">New Book</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <BookForm onSubmit={handleSubmit} loading={loading} error={error} />
      </div>
    </div>
  )
}
