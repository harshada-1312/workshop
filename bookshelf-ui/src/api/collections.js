import client from './client'

export function getCollections(params = {}) {
  return client.get('/api/collections', {
    params: {
      page: params.page,
      per_page: params.perPage,
      sort_by: params.sortBy,
      sort_order: params.sortOrder,
      is_public: params.isPublic,
      search: params.search,
    },
  })
}

export function getCollection(id) {
  return client.get(`/api/collections/${id}`)
}

export function createCollection(data) {
  return client.post('/api/collections', { collection: data })
}

export function updateCollection(id, data) {
  return client.put(`/api/collections/${id}`, { collection: data })
}

export function deleteCollection(id) {
  return client.delete(`/api/collections/${id}`)
}

export function addBookToCollection(collectionId, bookId) {
  return client.post(`/api/collections/${collectionId}/books`, { book_id: bookId })
}

export function removeBookFromCollection(collectionId, bookId) {
  return client.delete(`/api/collections/${collectionId}/books/${bookId}`)
}

export function reorderCollectionBooks(collectionId, bookIds) {
  return client.put(`/api/collections/${collectionId}/books/reorder`, { book_ids: bookIds })
}
