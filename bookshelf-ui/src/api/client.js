import axios from 'axios'

const client = axios.create({
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.response.use(
  (response) => {
    if (response.status === 204) return { data: null, meta: null }
    const body = response.data
    return { data: body.data, meta: body.meta || null }
  },
  (error) => {
    if (error.response?.data?.error) {
      return Promise.reject(error.response.data.error)
    }
    return Promise.reject({
      code: 'NETWORK_ERROR',
      message: error.message || 'Network error',
    })
  }
)

export default client
