import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'
import { createApiError } from './errors'

/**
 * Obtiene el registro de inscripciones de alumnos a comisiones y cursos.
 * REST: GET /api/inscripciones
 * @returns {Promise<Array<Object>>}
 */
export const getInscripciones = async () => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return [...mockDb.inscripciones]
  }
  const response = await apiClient.get('/inscripciones')
  return response.data
}

/**
 * Realiza la inscripción de un alumno a una comisión/curso con control de cupos disponibles.
 * REST: POST /api/inscripciones
 * @param {Object} data - Datos de la inscripción (idAlumno, idCurso, cicloLectivo)
 * @returns {Promise<Object>}
 */
export const createInscripcion = async (data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const curso = mockDb.cursos.find((c) => c.idCurso === Number(data.idCurso))
    if (curso && curso.cuposDisponibles <= 0) {
      throw createApiError(409, 'Sin cupos disponibles', [
        {
          campo: 'idCurso',
          mensaje: `El curso "${curso.nombre}" no cuenta con cupos disponibles (capacidad: ${curso.capacidadMaxima})`,
        },
      ])
    }

    const alumno = mockDb.alumnos.find((a) => a.idAlumno === Number(data.idAlumno))
    const nuevoId = Math.max(...mockDb.inscripciones.map((i) => i.idInscripcion), 0) + 1

    const nuevo = {
      idInscripcion: nuevoId,
      idAlumno: Number(data.idAlumno),
      alumnoNombre: alumno ? `${alumno.nombre} ${alumno.apellido}` : data.alumnoNombre || 'Alumno',
      idCurso: Number(data.idCurso),
      cursoNombre: curso ? curso.nombre : data.cursoNombre || 'Curso',
      cicloLectivo: Number(data.cicloLectivo) || 2026,
      fechaInscripcion: new Date().toISOString().split('T')[0],
      estado: 'CONFIRMADA',
    }

    mockDb.inscripciones.unshift(nuevo)

    // Descontar cupo en el curso
    if (curso) {
      curso.inscriptos += 1
      curso.cuposDisponibles = Math.max(curso.capacidadMaxima - curso.inscriptos, 0)
    }

    return { ...nuevo }
  }
  const response = await apiClient.post('/inscripciones', data)
  return response.data
}

/**
 * Cancela una inscripción de un alumno y libera el cupo correspondiente en la comisión.
 * REST: DELETE /api/inscripciones/{id}
 * @param {number|string} idInscripcion - Identificador de la inscripción
 * @returns {Promise<Object>}
 */
export const cancelarInscripcion = async (idInscripcion) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const index = mockDb.inscripciones.findIndex((i) => i.idInscripcion === Number(idInscripcion))
    if (index === -1) {
      throw createApiError(404, 'Inscripción no encontrada', [
        { campo: 'idInscripcion', mensaje: 'Inscripción no encontrada' },
      ])
    }

    const insc = mockDb.inscripciones[index]
    insc.estado = 'CANCELADA'

    // Liberar cupo
    const curso = mockDb.cursos.find((c) => c.idCurso === insc.idCurso)
    if (curso && curso.inscriptos > 0) {
      curso.inscriptos -= 1
      curso.cuposDisponibles = Math.max(curso.capacidadMaxima - curso.inscriptos, 0)
    }

    return { success: true }
  }
  const response = await apiClient.delete(`/inscripciones/${idInscripcion}`)
  return response.data
}
