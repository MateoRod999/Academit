import axios from 'axios'
import { ApiError } from './errors'

// Cliente Axios configurado para comunicarse con el backend
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      const data = error.response.data
      const status = data.status || error.response.status || 500
      const message = data.message || error.message || 'Error del servidor'
      const errors = Array.isArray(data.errors) ? data.errors : []
      return Promise.reject(new ApiError(status, message, errors))
    }
    return Promise.reject(error)
  }
)

// Variable booleana para alternar fácilmente entre datos simulados y API real
export const isMock = import.meta.env.VITE_USE_MOCK === 'true'

export default apiClient
