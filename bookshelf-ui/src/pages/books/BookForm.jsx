import { useState, useEffect, useCallback } from 'react'
import useApi from '../../hooks/useApi'
import { getAuthors } from '../../api/authors'
import { GENRES, READ_STATUSES } from '../../constants'
import FormField from '../../components/ui/FormField'
import ErrorAlert from '../../components/ui/ErrorAlert'

export default function BookForm({ initialData, onSubmit, loading, error }) {
  const [form, setForm] = useState({
    title: '', isbn: '', author_id: '', published_year: '', genre: '',
    description: '', page_count: '', language: 'en', rating: '', read_status: 'unread',
  })

  const fetchAuthors = useCallback(() => getAuthors({ perPage: 100, sortBy: 'last_name' }), [])
  const { data: authors } = useApi(fetchAuthors)

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        isbn: initialData.isbn || '',
        author_id: initialData.author_id || initialData.author?.id || '',
        published_year: initialData.published_year ?? '',
        genre: initialData.genre || '',
        description: initialData.description || '',
        page_count: initialData.page_count ?? '',
        language: initialData.language || 'en',
        rating: initialData.rating ?? '',
        read_status: initialData.read_status || 'unread',
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = { ...form }
    data.author_id = parseInt(data.author_id)
    if (data.published_year !== '') data.published_year = parseInt(data.published_year)
    else delete data.published_year
    if (data.page_count !== '') data.page_count = parseInt(data.page_count)
    else delete data.page_count
    if (data.rating !== '') data.rating = parseFloat(data.rating)
    else delete data.rating
    if (!data.isbn) delete data.isbn
    if (!data.description) delete data.description
    onSubmit(data)
  }

  const inputClass = 'block w-full rounded-md border border-gray-300 py-1.5 px-3 text-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
  const selectClass = inputClass

  return (
    <form onSubmit={handleSubmit}>
      <ErrorAlert error={error} />

      <FormField label="Title *" name="title">
        <input id="title" name="title" value={form.title} onChange={handleChange} required className={inputClass} />
      </FormField>

      <div className="grid sm:grid-cols-2 gap-x-4">
        <FormField label="Author *" name="author_id">
          <select id="author_id" name="author_id" value={form.author_id} onChange={handleChange} required className={selectClass}>
            <option value="">Select author...</option>
            {authors?.map((a) => (
              <option key={a.id} value={a.id}>{a.first_name} {a.last_name}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Genre *" name="genre">
          <select id="genre" name="genre" value={form.genre} onChange={handleChange} required className={selectClass}>
            <option value="">Select genre...</option>
            {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </FormField>
      </div>

      <FormField label="ISBN-13" name="isbn">
        <input id="isbn" name="isbn" value={form.isbn} onChange={handleChange} placeholder="13-digit ISBN" maxLength={13} className={inputClass} />
      </FormField>

      <FormField label="Description" name="description">
        <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={3} className={inputClass} />
      </FormField>

      <div className="grid sm:grid-cols-3 gap-x-4">
        <FormField label="Published Year" name="published_year">
          <input id="published_year" name="published_year" type="number" value={form.published_year} onChange={handleChange} min={1000} max={new Date().getFullYear()} className={inputClass} />
        </FormField>
        <FormField label="Page Count" name="page_count">
          <input id="page_count" name="page_count" type="number" value={form.page_count} onChange={handleChange} min={1} className={inputClass} />
        </FormField>
        <FormField label="Language" name="language">
          <input id="language" name="language" value={form.language} onChange={handleChange} maxLength={2} placeholder="en" className={inputClass} />
        </FormField>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-4">
        <FormField label="Rating (0-5, in 0.5 steps)" name="rating">
          <select id="rating" name="rating" value={form.rating} onChange={handleChange} className={selectClass}>
            <option value="">No rating</option>
            {Array.from({ length: 11 }, (_, i) => i * 0.5).map((v) => (
              <option key={v} value={v}>{v.toFixed(1)}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Read Status" name="read_status">
          <select id="read_status" name="read_status" value={form.read_status} onChange={handleChange} className={selectClass}>
            {READ_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </FormField>
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
