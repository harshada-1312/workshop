import { useState, useEffect } from 'react'
import FormField from '../../components/ui/FormField'
import ErrorAlert from '../../components/ui/ErrorAlert'

export default function AuthorForm({ initialData, onSubmit, loading, error }) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    birth_year: '',
    death_year: '',
    website: '',
  })

  useEffect(() => {
    if (initialData) {
      setForm({
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        bio: initialData.bio || '',
        birth_year: initialData.birth_year ?? '',
        death_year: initialData.death_year ?? '',
        website: initialData.website || '',
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = { ...form }
    if (data.birth_year === '') delete data.birth_year
    else data.birth_year = parseInt(data.birth_year)
    if (data.death_year === '') delete data.death_year
    else data.death_year = parseInt(data.death_year)
    if (!data.bio) delete data.bio
    if (!data.website) delete data.website
    onSubmit(data)
  }

  const inputClass = 'block w-full rounded-md border border-gray-300 py-1.5 px-3 text-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'

  return (
    <form onSubmit={handleSubmit}>
      <ErrorAlert error={error} />
      <div className="grid sm:grid-cols-2 gap-x-4">
        <FormField label="First Name *" name="first_name">
          <input id="first_name" name="first_name" value={form.first_name} onChange={handleChange} required className={inputClass} />
        </FormField>
        <FormField label="Last Name *" name="last_name">
          <input id="last_name" name="last_name" value={form.last_name} onChange={handleChange} required className={inputClass} />
        </FormField>
      </div>
      <FormField label="Bio" name="bio">
        <textarea id="bio" name="bio" value={form.bio} onChange={handleChange} rows={3} className={inputClass} />
      </FormField>
      <div className="grid sm:grid-cols-2 gap-x-4">
        <FormField label="Birth Year" name="birth_year">
          <input id="birth_year" name="birth_year" type="number" value={form.birth_year} onChange={handleChange} className={inputClass} />
        </FormField>
        <FormField label="Death Year" name="death_year">
          <input id="death_year" name="death_year" type="number" value={form.death_year} onChange={handleChange} className={inputClass} />
        </FormField>
      </div>
      <FormField label="Website" name="website">
        <input id="website" name="website" type="url" value={form.website} onChange={handleChange} placeholder="https://..." className={inputClass} />
      </FormField>
      <div className="mt-6 flex gap-3">
        <button type="submit" disabled={loading}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}
