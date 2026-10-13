import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

/**
 * Obtiene el listado de asignaciones docentes a cursos y materias.
 * REST: GET /api/asignaciones
 * @returns {Promise<Array<Object>>}
 */
export const getAsignaciones = async () => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return [...mockDb.asignaciones]
  }
  const response = await apiClient.get('/asignaciones')
  return response.data
}

/**
 * Registra una nueva asignación docente a una cátedra y curso.
 * REST: POST /api/asignaciones
 * @param {Object} data - Datos de la asignación (idDocente, idMateria, idCurso, rolDocente)
 * @returns {Promise<Object>}
 */
export const createAsignacion = async (data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const nuevoId = Math.max(...mockDb.asignaciones.map((a) => a.idAsignacion), 0) + 1
    const docente = mockDb.docentes.find((d) => d.idDocente === Number(data.idDocente))
    const materia = mockDb.materias.find((m) => m.idMateria === Number(data.idMateria))
    const curso = mockDb.cursos.find((c) => c.idCurso === Number(data.idCurso))

    const nuevo = {
      idAsignacion: nuevoId,
      idDocente: Number(data.idDocente),
      docenteNombre: docente ? `${docente.nombre} ${docente.apellido}` : data.docenteNombre || 'Docente',
      idMateria: Number(data.idMateria),
      materiaNombre: materia ? materia.nombre : data.materiaNombre || 'Materia',
      idCurso: Number(data.idCurso),
      cursoNombre: curso ? curso.nombre : data.cursoNombre || 'Curso',
      rolDocente: data.rolDocente || 'Titular',
    }
    mockDb.asignaciones.push(nuevo)
    return { ...nuevo }
  }
  const response = await apiClient.post('/asignaciones', data)
  return response.data
}

/**
 * Elimina una asignación docente existente.
 * REST: DELETE /api/asignaciones/{id}
 * @param {number|string} idAsignacion
 * @returns {Promise<Object>}
 */
export const deleteAsignacion = async (idAsignacion) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const index = mockDb.asignaciones.findIndex((a) => a.idAsignacion === Number(idAsignacion))
    if (index === -1) throw new Error('Asignación no encontrada')
    mockDb.asignaciones.splice(index, 1)
    return { success: true }
  }
  const response = await apiClient.delete(`/asignaciones/${idAsignacion}`)
  return response.data
}
