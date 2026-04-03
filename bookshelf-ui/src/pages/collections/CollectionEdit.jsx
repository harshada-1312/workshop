import { useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useApi from '../../hooks/useApi'
import { getCollection, updateCollection } from '../../api/collections'
import CollectionForm from './CollectionForm'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function CollectionEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCollection = useCallback(() => getCollection(id), [id])
  const { data: collection, loading: fetchLoading } = useApi(fetchCollection)

  const handleSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      await updateCollection(id, data)
      navigate(`/collections/${id}`)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) return <LoadingSpinner />

  return (
    <div>
      <Link to={`/collections/${id}`} className="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Collection</Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-1 mb-6">Edit Collection</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <CollectionForm initialData={collection} onSubmit={handleSubmit} loading={loading} error={error} />
      </div>
    </div>
  )
}
