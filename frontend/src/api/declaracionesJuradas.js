import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

/**
 * Obtiene el listado de declaraciones juradas de materias a cursar.
 * REST: GET /api/declaraciones-juradas
 * @param {Object} [filtros={}] - Filtros opcionales (idAlumno, idCiclo)
 * @returns {Promise<Array<Object>>}
 */
export const getDeclaracionesJuradas = async (filtros = {}) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    let lista = [...(mockDb.declaracionesJuradas || [])]
    if (filtros.idAlumno) {
      lista = lista.filter((d) => d.idAlumno === Number(filtros.idAlumno))
    }
    if (filtros.idCiclo) {
      lista = lista.filter((d) => d.idCiclo === Number(filtros.idCiclo))
    }
    return lista
  }
  const response = await apiClient.get('/declaraciones-juradas', { params: filtros })
  return response.data
}

/**
 * Presenta una nueva declaración jurada de materias (RF51).
 * REST: POST /api/declaraciones-juradas
 * @param {Object} data - Datos ({ idAlumno, idCiclo, materiasDeclaradasIds, observaciones })
 * @returns {Promise<Object>}
 */
export const createDeclaracionJurada = async (data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const list = mockDb.declaracionesJuradas || []
    const nuevoId = Math.max(...list.map((d) => d.idDeclaracion), 0) + 1
    const idAlumno = data.idAlumno ? Number(data.idAlumno) : 1
    const alumno = mockDb.alumnos?.find((a) => a.idAlumno === idAlumno)
    const ciclo = mockDb.ciclosLectivos?.find((c) => c.idCiclo === Number(data.idCiclo || 1))

    const materiasIds = Array.isArray(data.materiasDeclaradasIds) ? data.materiasDeclaradasIds : []
    const materiasNombres = materiasIds
      .map((id) => mockDb.materias?.find((m) => m.idMateria === Number(id))?.nombre)
      .filter(Boolean)

    const nueva = {
      idDeclaracion: nuevoId,
      idAlumno,
      alumnoNombre: alumno ? `${alumno.nombre} ${alumno.apellido}` : 'Lucía Benítez',
      idCiclo: data.idCiclo ? Number(data.idCiclo) : 1,
      cicloNombre: ciclo ? ciclo.nombre : 'Ciclo Lectivo 2026',
      fecha: new Date().toISOString().split('T')[0],
      materiasDeclaradasIds: materiasIds,
      materiasNombres: materiasNombres.length > 0 ? materiasNombres : ['Programación I', 'Bases de Datos I'],
      estado: 'VALIDADA',
      observaciones: data.observaciones || data.motivo || 'Cumple con el régimen de correlatividades.',
    }
    list.unshift(nueva)
    mockDb.declaracionesJuradas = list
    return { ...nueva }
  }
  const response = await apiClient.post('/declaraciones-juradas', data)
  return response.data
}
