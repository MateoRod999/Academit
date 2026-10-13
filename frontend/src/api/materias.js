import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

/**
 * Obtiene el catálogo de materias curriculares, con filtros opcionales (idCarrera, idPlan).
 * REST: GET /api/materias
 * @param {Object} [filtros={}] - Parámetros de búsqueda opcionales (idCarrera, idPlan)
 * @returns {Promise<Array<Object>>}
 */
export const getMaterias = async (filtros = {}) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    let lista = [...mockDb.materias]
    if (filtros.idCarrera) {
      lista = lista.filter((m) => m.idCarrera === Number(filtros.idCarrera))
    }
    if (filtros.idPlan) {
      lista = lista.filter((m) => m.idPlan === Number(filtros.idPlan))
    }
    return lista
  }
  const response = await apiClient.get('/materias', { params: filtros })
  return response.data
}

/**
 * Registra una nueva materia en el plan de estudios.
 * REST: POST /api/materias
 * @param {Object} data - Datos de la materia (codigo, nombre, anio, regimen, horasSemanales, correlativas, idCarrera, idPlan)
 * @returns {Promise<Object>}
 */
export const createMateria = async (data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const nuevoId = Math.max(...mockDb.materias.map((m) => m.idMateria), 0) + 1
    const carrera = mockDb.carreras.find((c) => c.idCarrera === Number(data.idCarrera))

    const nuevo = {
      idMateria: nuevoId,
      idCarrera: data.idCarrera ? Number(data.idCarrera) : 1,
      idPlan: data.idPlan ? Number(data.idPlan) : 1,
      carreraNombre: carrera ? carrera.nombre : data.carreraNombre || 'Tecnicatura Superior en Desarrollo de Software',
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

/**
 * Actualiza los datos o régimen de correlatividades de una materia.
 * REST: PUT /api/materias/{id}
 * @param {number|string} idMateria - Identificador de la materia
 * @param {Object} data - Campos a actualizar
 * @returns {Promise<Object>}
 */
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
