import client from './client'

export function getAuthors(params = {}) {
  return client.get('/api/authors', {
    params: {
      page: params.page,
      per_page: params.perPage,
      sort_by: params.sortBy,
      sort_order: params.sortOrder,
      search: params.search,
    },
  })
}

export function getAuthor(id) {
  return client.get(`/api/authors/${id}`)
}

export function getAuthorBooks(id, params = {}) {
  return client.get(`/api/authors/${id}/books`, {
    params: {
      page: params.page,
      per_page: params.perPage,
      sort_by: params.sortBy,
      sort_order: params.sortOrder,
    },
  })
}

export function createAuthor(data) {
  return client.post('/api/authors', { author: data })
}

export function updateAuthor(id, data) {
  return client.put(`/api/authors/${id}`, { author: data })
}

export function deleteAuthor(id) {
  return client.delete(`/api/authors/${id}`)
}
