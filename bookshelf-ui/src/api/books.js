import client from './client'

export function getBooks(params = {}) {
  return client.get('/api/books', {
    params: {
      page: params.page,
      per_page: params.perPage,
      sort_by: params.sortBy,
      sort_order: params.sortOrder,
      genre: params.genre,
      read_status: params.readStatus,
      author_id: params.authorId,
      language: params.language,
      rating_min: params.ratingMin,
      rating_max: params.ratingMax,
      published_year_min: params.publishedYearMin,
      published_year_max: params.publishedYearMax,
      search: params.search,
    },
  })
}

export function getBook(id) {
  return client.get(`/api/books/${id}`)
}

export function createBook(data) {
  return client.post('/api/books', { book: data })
}

export function updateBook(id, data) {
  return client.put(`/api/books/${id}`, { book: data })
}

export function deleteBook(id) {
  return client.delete(`/api/books/${id}`)
}
