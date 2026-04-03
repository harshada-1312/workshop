import { useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useApi from '../../hooks/useApi'
import { getAuthor, getAuthorBooks, deleteAuthor } from '../../api/authors'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorAlert from '../../components/ui/ErrorAlert'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import Badge from '../../components/ui/Badge'
import RatingStars from '../../components/ui/RatingStars'

export default function AuthorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showDelete, setShowDelete] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [booksPage, setBooksPage] = useState(1)

  const fetchAuthor = useCallback(() => getAuthor(id), [id])
  const fetchBooks = useCallback((params) => getAuthorBooks(id, params), [id])

  const { data: author, loading, error } = useApi(fetchAuthor)
  const { data: books, meta: booksMeta, loading: booksLoading } = useApi(fetchBooks, { page: booksPage, perPage: 10 })

  const handleDelete = async () => {
    try {
      await deleteAuthor(id)
      navigate('/authors')
    } catch (err) {
      setDeleteError(err)
      setShowDelete(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorAlert error={error} />
  if (!author) return null

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link to="/authors" className="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Authors</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{author.first_name} {author.last_name}</h1>
        </div>
        <div className="flex gap-2">
          <Link to={`/authors/${id}/edit`}
            className="rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Edit
          </Link>
          <button onClick={() => setShowDelete(true)}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>

      <ErrorAlert error={deleteError} onDismiss={() => setDeleteError(null)} />

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <dl className="grid sm:grid-cols-2 gap-4">
          {author.bio && <div className="sm:col-span-2"><dt className="text-sm font-medium text-gray-500">Bio</dt><dd className="mt-1 text-sm text-gray-900">{author.bio}</dd></div>}
          <div><dt className="text-sm font-medium text-gray-500">Birth Year</dt><dd className="mt-1 text-sm text-gray-900">{author.birth_year || '—'}</dd></div>
          <div><dt className="text-sm font-medium text-gray-500">Death Year</dt><dd className="mt-1 text-sm text-gray-900">{author.death_year || '—'}</dd></div>
          {author.website && <div className="sm:col-span-2"><dt className="text-sm font-medium text-gray-500">Website</dt><dd className="mt-1 text-sm"><a href={author.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{author.website}</a></dd></div>}
          <div><dt className="text-sm font-medium text-gray-500">Total Books</dt><dd className="mt-1 text-sm text-gray-900 font-semibold">{author.book_count}</dd></div>
        </dl>
      </div>

      {/* Books by this author */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Books</h2>
        {booksLoading ? <LoadingSpinner size="sm" /> : books?.length === 0 ? (
          <p className="text-sm text-gray-500">No books by this author yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {books?.map((book) => (
              <li key={book.id} className="py-3 flex items-center justify-between">
                <div>
                  <Link to={`/books/${book.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">{book.title}</Link>
                  <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                    <span>{book.genre}</span>
                    <Badge text={book.read_status} variant={book.read_status} />
                  </div>
                </div>
                {book.rating != null && <RatingStars value={book.rating} readonly />}
              </li>
            ))}
          </ul>
        )}
        {booksMeta && <Pagination page={booksMeta.page} totalPages={booksMeta.total_pages} onPageChange={setBooksPage} />}
      </div>

      <Modal open={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete}
        title="Delete Author" confirmText="Delete" confirmVariant="danger">
        Are you sure you want to delete {author.first_name} {author.last_name}? This cannot be undone.
      </Modal>
    </div>
  )
}
