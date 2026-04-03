import { useState, useEffect } from 'react'
import FormField from '../../components/ui/FormField'
import ErrorAlert from '../../components/ui/ErrorAlert'

export default function CollectionForm({ initialData, onSubmit, loading, error }) {
  const [form, setForm] = useState({ name: '', description: '', is_public: false })

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        is_public: initialData.is_public || false,
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = { ...form }
    if (!data.description) delete data.description
    onSubmit(data)
  }

  const inputClass = 'block w-full rounded-md border border-gray-300 py-1.5 px-3 text-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'

  return (
    <form onSubmit={handleSubmit}>
      <ErrorAlert error={error} />
      <FormField label="Name *" name="name">
        <input id="name" name="name" value={form.name} onChange={handleChange} required className={inputClass} />
      </FormField>
      <FormField label="Description" name="description">
        <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={3} className={inputClass} />
      </FormField>
      <div className="flex items-center gap-2 mb-4">
        <input id="is_public" name="is_public" type="checkbox" checked={form.is_public} onChange={handleChange}
          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
        <label htmlFor="is_public" className="text-sm text-gray-700">Public collection</label>
      </div>
      <div className="mt-6 flex gap-3">
        <button type="submit" disabled={loading}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}
