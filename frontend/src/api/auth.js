import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'
import { createApiError } from './errors'

/**
 * Inicia sesión con usuario y contraseña.
 * REST: POST /api/auth/login
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise<Object>} Datos del usuario autenticado
 */
export const loginApi = async (username, password) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))

    if (password !== '1234') {
      throw createApiError(401, 'Credenciales inválidas', [
        { campo: 'password', mensaje: 'Contraseña incorrecta. (La contraseña de prueba es 1234)' },
      ])
    }

    const encontrado = mockDb.usuarios.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    )

    if (!encontrado) {
      throw createApiError(404, 'Usuario no encontrado', [
        {
          campo: 'username',
          mensaje: 'Usuario no encontrado. Usuarios válidos: admin, administrativo, docente, alumno',
        },
      ])
    }

    return {
      idUsuario: encontrado.idUsuario,
      usuario: encontrado.username,
      nombre: encontrado.nombre,
      rol: encontrado.rol,
      email: encontrado.email,
    }
  }

  const response = await apiClient.post('/auth/login', { username, password })
  return response.data
}

/**
 * Cierra la sesión activa en el sistema.
 * REST: POST /api/auth/logout
 * @returns {Promise<Object>}
 */
export const logoutApi = async () => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return { success: true }
  }

  const response = await apiClient.post('/auth/logout')
  return response.data
}

/**
 * Modifica la contraseña del usuario en sesión.
 * REST: POST /api/auth/cambiar-password
 * @param {string} actual - Contraseña vigente
 * @param {string} nueva - Nueva contraseña deseada
 * @returns {Promise<Object>}
 */
export const cambiarPasswordApi = async (actual, nueva) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    if (actual !== '1234') {
      throw createApiError(400, 'Error al cambiar contraseña', [
        { campo: 'actual', mensaje: 'La contraseña actual es incorrecta' },
      ])
    }
    return { success: true, message: 'Contraseña actualizada con éxito' }
  }

  const response = await apiClient.post('/auth/cambiar-password', { actual, nueva })
  return response.data
}
