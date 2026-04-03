import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createCollection } from '../../api/collections'
import CollectionForm from './CollectionForm'

export default function CollectionNew() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const result = await createCollection(data)
      navigate(`/collections/${result.data.id}`)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link to="/collections" className="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Collections</Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-1 mb-6">New Collection</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <CollectionForm onSubmit={handleSubmit} loading={loading} error={error} />
      </div>
    </div>
  )
}
