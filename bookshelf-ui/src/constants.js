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
  unread: 'bg-gray-100 text-gray-700',
  reading: 'bg-blue-100 text-blue-700',
  read: 'bg-green-100 text-green-700',
}
