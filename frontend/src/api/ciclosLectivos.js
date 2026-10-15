import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'
import { createApiError } from './errors'

/**
 * Obtiene el catálogo de ciclos lectivos.
 * REST: GET /api/ciclos-lectivos
 * @returns {Promise<Array<Object>>}
 */
export const getCiclosLectivos = async () => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return [...mockDb.ciclosLectivos]
  }
  const response = await apiClient.get('/ciclos-lectivos')
  return response.data
}

/**
 * Registra un nuevo ciclo lectivo anual.
 * REST: POST /api/ciclos-lectivos
 * @param {Object} data - Datos del ciclo lectivo (anio, nombre, fechaInicio, fechaFin, estado)
 * @returns {Promise<Object>}
 */
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

/**
 * Actualiza los datos o estado de un ciclo lectivo existente.
 * REST: PUT /api/ciclos-lectivos/{id}
 * @param {number|string} idCiclo
 * @param {Object} data - Campos a modificar
 * @returns {Promise<Object>}
 */
export const updateCicloLectivo = async (idCiclo, data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const index = mockDb.ciclosLectivos.findIndex((c) => c.idCiclo === Number(idCiclo))
    if (index === -1) {
      throw createApiError(404, 'Ciclo lectivo no encontrado', [
        { campo: 'idCiclo', mensaje: 'Ciclo lectivo no encontrado' },
      ])
    }
    mockDb.ciclosLectivos[index] = { ...mockDb.ciclosLectivos[index], ...data }
    return { ...mockDb.ciclosLectivos[index] }
  }
  const response = await apiClient.put(`/ciclos-lectivos/${idCiclo}`, data)
  return response.data
}
