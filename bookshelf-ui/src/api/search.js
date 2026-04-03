import client from './client'

export function searchAll(params = {}) {
  return client.get('/api/search', {
    params: {
      q: params.q,
      type: params.type,
      page: params.page,
      per_page: params.perPage,
    },
  })
}
