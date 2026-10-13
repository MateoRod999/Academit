import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

export const getMaterias = async () => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return [...mockDb.materias]
  }
  const response = await apiClient.get('/materias')
  return response.data
}

export const createMateria = async (data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const nuevoId = Math.max(...mockDb.materias.map((m) => m.idMateria), 0) + 1
    const nuevo = {
      idMateria: nuevoId,
      codigo: data.codigo || `MAT-${100 + nuevoId}`,
      nombre: data.nombre,
      anio: Number(data.anio) || 1,
      regimen: data.regimen || 'Anual',
      horasSemanales: Number(data.horasSemanales) || 4,
      correlativas: Array.isArray(data.correlativas) ? data.correlativas : [],
    }
    mockDb.materias.push(nuevo)
    return { ...nuevo }
  }
  const response = await apiClient.post('/materias', data)
  return response.data
}

export const updateMateria = async (idMateria, data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const index = mockDb.materias.findIndex((m) => m.idMateria === Number(idMateria))
    if (index === -1) throw new Error('Materia no encontrada')
    mockDb.materias[index] = { ...mockDb.materias[index], ...data }
    return { ...mockDb.materias[index] }
  }
  const response = await apiClient.put(`/materias/${idMateria}`, data)
  return response.data
}
