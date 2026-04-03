export const GENRES = [
  'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery',
  'Thriller', 'Romance', 'Horror', 'Biography', 'History',
  'Science', 'Philosophy', 'Self-Help', 'Business', 'Technology',
  'Poetry', 'Children', 'Young Adult', 'Graphic Novel', 'Other',
]

export const READ_STATUSES = [
  { value: 'unread', label: 'Unread' },
  { value: 'reading', label: 'Reading' },
  { value: 'read', label: 'Read' },
]

export const AUTHOR_SORT_OPTIONS = [
  { value: 'last_name', label: 'Last Name' },
  { value: 'first_name', label: 'First Name' },
  { value: 'created_at', label: 'Date Added' },
  { value: 'book_count', label: 'Book Count' },
]

export const BOOK_SORT_OPTIONS = [
  { value: 'date_added', label: 'Date Added' },
  { value: 'title', label: 'Title' },
  { value: 'published_year', label: 'Published Year' },
  { value: 'rating', label: 'Rating' },
  { value: 'page_count', label: 'Page Count' },
]

export const COLLECTION_SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'created_at', label: 'Date Added' },
  { value: 'book_count', label: 'Book Count' },
]

export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ar', label: 'Arabic' },
]

export const STATUS_COLORS = {
  unread: 'bg-slate-100 text-slate-600 border border-slate-200',
  reading: 'bg-sky-50 text-sky-700 border border-sky-200',
  read: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
}

export const GENRE_COLORS = {
  'Fiction': 'bg-violet-50 text-violet-700',
  'Non-Fiction': 'bg-amber-50 text-amber-700',
  'Science Fiction': 'bg-cyan-50 text-cyan-700',
  'Fantasy': 'bg-purple-50 text-purple-700',
  'Mystery': 'bg-rose-50 text-rose-700',
  'Thriller': 'bg-red-50 text-red-700',
  'Romance': 'bg-pink-50 text-pink-700',
  'Horror': 'bg-gray-800 text-gray-100',
  'Biography': 'bg-teal-50 text-teal-700',
  'History': 'bg-orange-50 text-orange-700',
  'Science': 'bg-blue-50 text-blue-700',
  'Philosophy': 'bg-indigo-50 text-indigo-700',
  'Self-Help': 'bg-lime-50 text-lime-700',
  'Business': 'bg-emerald-50 text-emerald-700',
  'Technology': 'bg-sky-50 text-sky-700',
  'Poetry': 'bg-fuchsia-50 text-fuchsia-700',
  'Children': 'bg-yellow-50 text-yellow-700',
  'Young Adult': 'bg-orange-50 text-orange-700',
  'Graphic Novel': 'bg-pink-50 text-pink-700',
  'Other': 'bg-gray-100 text-gray-600',
}

export const BOOK_COVER_GRADIENTS = [
  'from-indigo-500 to-purple-600',
  'from-rose-500 to-pink-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-sky-500 to-blue-600',
  'from-violet-500 to-fuchsia-600',
  'from-cyan-500 to-teal-600',
  'from-red-500 to-rose-600',
]
