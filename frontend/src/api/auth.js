import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

/**
 * Inicia sesión con usuario y contraseña.
 * En modo mock valida contra mockDb.usuarios con contraseña "1234".
 * En modo real hace POST a /auth/login.
 */
export const loginApi = async (username, password) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))

    if (password !== '1234') {
      throw new Error('Contraseña incorrecta. (La contraseña de prueba es 1234)')
    }

    const encontrado = mockDb.usuarios.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    )

    if (!encontrado) {
      throw new Error(
        'Usuario no encontrado. Usuarios válidos: admin, administrativo, docente, alumno'
      )
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
 * Cierra la sesión activa.
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
 * Modifica la contraseña del usuario.
 */
export const cambiarPasswordApi = async (actual, nueva) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    if (actual !== '1234') {
      throw new Error('La contraseña actual es incorrecta')
    }
    return { success: true, message: 'Contraseña actualizada con éxito' }
  }

  const response = await apiClient.post('/auth/cambiar-password', { actual, nueva })
  return response.data
}
