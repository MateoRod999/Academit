import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

/**
 * Obtiene el listado de carreras institucionales.
 * REST: GET /api/carreras
 * @returns {Promise<Array<Object>>}
 */
export const getCarreras = async () => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return [...mockDb.carreras]
  }

  const response = await apiClient.get('/carreras')
  return response.data
}

/**
 * Obtiene los detalles de una carrera específica por su identificador.
 * REST: GET /api/carreras/{id}
 * @param {number|string} idCarrera
 * @returns {Promise<Object>}
 */
export const getCarreraById = async (idCarrera) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const encontrada = mockDb.carreras.find((c) => c.idCarrera === Number(idCarrera))
    if (!encontrada) throw new Error('Carrera no encontrada')
    return { ...encontrada }
  }

  const response = await apiClient.get(`/carreras/${idCarrera}`)
  return response.data
}

/**
 * Registra una nueva carrera en la oferta académica.
 * REST: POST /api/carreras
 * @param {Object} data - Datos de la carrera a crear
 * @returns {Promise<Object>}
 */
export const createCarrera = async (data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const nuevoId = Math.max(...mockDb.carreras.map((c) => c.idCarrera), 0) + 1
    const nueva = {
      idCarrera: nuevoId,
      codigo: data.codigo,
      nombre: data.nombre,
      tituloOtorgado: data.tituloOtorgado,
      duracion: data.duracion || '3 años',
      resolucion: data.resolucion || 'En trámite',
      estado: 'ACTIVA',
      planesCount: 1,
      cursosCount: 0,
    }
    mockDb.carreras.push(nueva)

    // Crear plan de estudios inicial asociado
    const nuevoPlanId = Math.max(...mockDb.planesEstudio.map((p) => p.idPlan), 0) + 1
    mockDb.planesEstudio.push({
      idPlan: nuevoPlanId,
      idCarrera: nuevoId,
      carreraNombre: nueva.nombre,
      codigo: `PLAN-${new Date().getFullYear()}`,
      nombre: `Plan de Estudios ${new Date().getFullYear()}`,
      anioResolucion: new Date().getFullYear(),
      cantidadMaterias: 0,
      horasTotales: 1600,
      estado: 'VIGENTE',
    })

    return nueva
  }

  const response = await apiClient.post('/carreras', data)
  return response.data
}

/**
 * Actualiza la información de una carrera existente.
 * REST: PUT /api/carreras/{id}
 * @param {number|string} idCarrera
 * @param {Object} data - Datos actualizados
 * @returns {Promise<Object>}
 */
export const updateCarrera = async (idCarrera, data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const idx = mockDb.carreras.findIndex((c) => c.idCarrera === Number(idCarrera))
    if (idx === -1) throw new Error('Carrera no encontrada')
    mockDb.carreras[idx] = {
      ...mockDb.carreras[idx],
      ...data,
    }
    return { ...mockDb.carreras[idx] }
  }

  const response = await apiClient.put(`/carreras/${idCarrera}`, data)
  return response.data
}

/**
 * Realiza la baja lógica de una carrera académica.
 * REST: DELETE /api/carreras/{id}
 * @param {number|string} idCarrera
 * @returns {Promise<Object>}
 */
export const deleteCarrera = async (idCarrera) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const idx = mockDb.carreras.findIndex((c) => c.idCarrera === Number(idCarrera))
    if (idx === -1) throw new Error('Carrera no encontrada')
    mockDb.carreras[idx].estado = 'INACTIVA'
    return { success: true }
  }

  const response = await apiClient.delete(`/carreras/${idCarrera}`)
  return response.data
}

/**
 * Obtiene los planes de estudio correspondientes a una carrera.
 * REST: GET /api/carreras/{id}/planes
 * @param {number|string} idCarrera
 * @returns {Promise<Array<Object>>}
 */
export const getCarreraPlanes = async (idCarrera) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return mockDb.planesEstudio.filter((p) => p.idCarrera === Number(idCarrera))
  }

  const response = await apiClient.get(`/carreras/${idCarrera}/planes`)
  return response.data
}

/**
 * Obtiene los cursos o comisiones vinculados a una carrera.
 * REST: GET /api/carreras/{id}/cursos
 * @param {number|string} idCarrera
 * @returns {Promise<Array<Object>>}
 */
export const getCarreraCursos = async (idCarrera) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return mockDb.cursos.filter((c) => c.idCarrera === Number(idCarrera))
  }

  const response = await apiClient.get(`/carreras/${idCarrera}/cursos`)
  return response.data
}

/**
 * Obtiene todos los planes de estudio del instituto.
 * REST: GET /api/planes-estudio
 * @returns {Promise<Array<Object>>}
 */
export const getPlanesEstudio = async () => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return [...mockDb.planesEstudio]
  }

  const response = await apiClient.get('/planes-estudio')
  return response.data
}
