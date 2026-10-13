import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

export const getUsuarios = async () => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return [...mockDb.usuarios]
  }
  const response = await apiClient.get('/usuarios')
  return response.data
}

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
