import axios from 'axios'

// Cliente Axios configurado para comunicarse con el backend
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Variable booleana para alternar fácilmente entre datos simulados y API real
export const isMock = import.meta.env.VITE_USE_MOCK === 'true'

export default apiClient
