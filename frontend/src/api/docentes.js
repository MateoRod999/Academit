import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'
import { createApiError } from './errors'

/**
 * Obtiene el padrón completo de docentes institucionales.
 * REST: GET /api/docentes
 * @returns {Promise<Array<Object>>}
 */
export const getDocentes = async () => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return [...mockDb.docentes]
  }
  const response = await apiClient.get('/docentes')
  return response.data
}

/**
 * Registra un nuevo docente en el cuerpo académico.
 * REST: POST /api/docentes
 * @param {Object} data - Datos personales y título del docente
 * @returns {Promise<Object>}
 */
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
      titulo: data.titulo || 'General',
      telefono: data.telefono || 'Sin teléfono',
      estado: 'ACTIVO',
    }
    mockDb.docentes.unshift(nuevo)
    return { ...nuevo }
  }
  const response = await apiClient.post('/docentes', data)
  return response.data
}

/**
 * Actualiza los datos de legajo o contacto de un docente.
 * REST: PUT /api/docentes/{id}
 * @param {number|string} idDocente - Identificador del docente
 * @param {Object} data - Campos a modificar
 * @returns {Promise<Object>}
 */
export const updateDocente = async (idDocente, data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const index = mockDb.docentes.findIndex((d) => d.idDocente === Number(idDocente))
    if (index === -1) {
      throw createApiError(404, 'Docente no encontrado', [
        { campo: 'idDocente', mensaje: 'Docente no encontrado' },
      ])
    }
    mockDb.docentes[index] = { ...mockDb.docentes[index], ...data }
    return { ...mockDb.docentes[index] }
  }
  const response = await apiClient.put(`/docentes/${idDocente}`, data)
  return response.data
}

/**
 * Realiza la baja lógica de un docente.
 * REST: DELETE /api/docentes/{id}
 * @param {number|string} idDocente - Identificador del docente
 * @returns {Promise<Object>}
 */
export const deleteDocente = async (idDocente) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const index = mockDb.docentes.findIndex((d) => d.idDocente === Number(idDocente))
    if (index === -1) {
      throw createApiError(404, 'Docente no encontrado', [
        { campo: 'idDocente', mensaje: 'Docente no encontrado' },
      ])
    }
    mockDb.docentes[index].estado = 'INACTIVO'
    return { success: true }
  }
  const response = await apiClient.delete(`/docentes/${idDocente}`)
  return response.data
}
