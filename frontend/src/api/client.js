import axios from 'axios'
import { ApiError } from './errors'

// Cliente Axios configurado para comunicarse con el backend
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de solicitud: envía Authorization: Bearer en cada pedido
apiClient.interceptors.request.use(
  (config) => {
    let token = sessionStorage.getItem('token')
    if (!token) {
      try {
        const stored = JSON.parse(sessionStorage.getItem('instituto_sesion') || '{}')
        token = stored.token || stored.usuario?.token || null
      } catch {
        token = null
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor de respuesta: guarda token en login y procesa error con message y errors
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && response.data.token) {
      sessionStorage.setItem('token', response.data.token)
    }
    if (response.config?.url?.includes('/auth/logout')) {
      sessionStorage.removeItem('token')
    }
    return response
  },
  (error) => {
    if (error.response && error.response.data) {
      const data = error.response.data
      const status = data.status || error.response.status || 500
      const message = data.message || data.detail || error.message || 'Error del servidor'
      const errors = Array.isArray(data.errors) ? data.errors : []
      return Promise.reject(new ApiError(status, message, errors))
    }
    return Promise.reject(error)
  }
)

// Variable booleana para alternar fácilmente entre datos simulados y API real
export const isMock = import.meta.env.VITE_USE_MOCK === 'true'

export default apiClient
