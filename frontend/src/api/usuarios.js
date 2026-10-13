import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

/**
 * Obtiene el listado de cuentas de usuario y roles del sistema.
 * REST: GET /api/usuarios
 * @returns {Promise<Array<Object>>}
 */
export const getUsuarios = async () => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return [...mockDb.usuarios]
  }
  const response = await apiClient.get('/usuarios')
  return response.data
}

/**
 * Registra un nuevo usuario con credenciales y asignación de rol.
 * REST: POST /api/usuarios
 * @param {Object} data - Datos del usuario (username, nombre, email, rol)
 * @returns {Promise<Object>}
 */
export const createUsuario = async (data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const nuevoId = Math.max(...mockDb.usuarios.map((u) => u.idUsuario), 0) + 1
    const nuevo = {
      idUsuario: nuevoId,
      username: data.username.toLowerCase().trim(),
      nombre: data.nombre,
      email: data.email,
      rol: data.rol, // 'ADMINISTRADOR' | 'ADMINISTRATIVO' | 'DOCENTE' | 'ALUMNO'
      estado: 'ACTIVO',
      ultimoAcceso: 'Nunca',
    }
    mockDb.usuarios.push(nuevo)
    return { ...nuevo }
  }
  const response = await apiClient.post('/usuarios', data)
  return response.data
}

/**
 * Actualiza los datos de perfil o rol de un usuario existente.
 * REST: PUT /api/usuarios/{id}
 * @param {number|string} idUsuario - Identificador del usuario
 * @param {Object} data - Campos a modificar
 * @returns {Promise<Object>}
 */
export const updateUsuario = async (idUsuario, data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const index = mockDb.usuarios.findIndex((u) => u.idUsuario === Number(idUsuario))
    if (index === -1) throw new Error('Usuario no encontrado')
    mockDb.usuarios[index] = { ...mockDb.usuarios[index], ...data }
    return { ...mockDb.usuarios[index] }
  }
  const response = await apiClient.put(`/usuarios/${idUsuario}`, data)
  return response.data
}

/**
 * Realiza la baja lógica de un usuario del sistema.
 * REST: DELETE /api/usuarios/{id}
 * @param {number|string} idUsuario - Identificador del usuario
 * @returns {Promise<Object>}
 */
export const deleteUsuario = async (idUsuario) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const index = mockDb.usuarios.findIndex((u) => u.idUsuario === Number(idUsuario))
    if (index === -1) throw new Error('Usuario no encontrado')
    mockDb.usuarios[index].estado = 'INACTIVO'
    return { success: true }
  }
  const response = await apiClient.delete(`/usuarios/${idUsuario}`)
  return response.data
}
