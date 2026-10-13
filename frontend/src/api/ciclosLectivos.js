import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

export const getCiclosLectivos = async () => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return [...mockDb.ciclosLectivos]
  }
  const response = await apiClient.get('/ciclos-lectivos')
  return response.data
}

export const createCicloLectivo = async (data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const nuevoId = Math.max(...mockDb.ciclosLectivos.map((c) => c.idCiclo), 0) + 1
    const nuevo = {
      idCiclo: nuevoId,
      anio: Number(data.anio) || new Date().getFullYear(),
      nombre: data.nombre || `Ciclo Lectivo ${data.anio}`,
      fechaInicio: data.fechaInicio || '2026-03-01',
      fechaFin: data.fechaFin || '2026-12-20',
      estado: data.estado || 'ACTIVO',
    }
    mockDb.ciclosLectivos.unshift(nuevo)
    return { ...nuevo }
  }
  const response = await apiClient.post('/ciclos-lectivos', data)
  return response.data
}

export const updateCicloLectivo = async (idCiclo, data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const index = mockDb.ciclosLectivos.findIndex((c) => c.idCiclo === Number(idCiclo))
    if (index === -1) throw new Error('Ciclo lectivo no encontrado')
    mockDb.ciclosLectivos[index] = { ...mockDb.ciclosLectivos[index], ...data }
    return { ...mockDb.ciclosLectivos[index] }
  }
  const response = await apiClient.put(`/ciclos-lectivos/${idCiclo}`, data)
  return response.data
}
