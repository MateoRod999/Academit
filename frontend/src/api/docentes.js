import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

export const getDocentes = async () => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return [...mockDb.docentes]
  }
  const response = await apiClient.get('/docentes')
  return response.data
}

export const createDocente = async (data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const nuevoId = Math.max(...mockDb.docentes.map((d) => d.idDocente), 0) + 1
    const nuevo = {
      idDocente: nuevoId,
      legajo: data.legajo || `DOC-${200 + nuevoId}`,
      nombre: data.nombre,
      apellido: data.apellido,
      dni: data.dni,
      email: data.email,
      especialidad: data.especialidad || 'General',
      telefono: data.telefono || 'Sin teléfono',
      estado: 'ACTIVO',
    }
    mockDb.docentes.unshift(nuevo)
    return { ...nuevo }
  }
  const response = await apiClient.post('/docentes', data)
  return response.data
}

export const updateDocente = async (idDocente, data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const index = mockDb.docentes.findIndex((d) => d.idDocente === Number(idDocente))
    if (index === -1) throw new Error('Docente no encontrado')
    mockDb.docentes[index] = { ...mockDb.docentes[index], ...data }
    return { ...mockDb.docentes[index] }
  }
  const response = await apiClient.put(`/docentes/${idDocente}`, data)
  return response.data
}

export const deleteDocente = async (idDocente) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const index = mockDb.docentes.findIndex((d) => d.idDocente === Number(idDocente))
    if (index === -1) throw new Error('Docente no encontrado')
    mockDb.docentes[index].estado = 'INACTIVO'
    return { success: true }
  }
  const response = await apiClient.delete(`/docentes/${idDocente}`)
  return response.data
}
