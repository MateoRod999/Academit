import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

export const getInscripciones = async () => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return [...mockDb.inscripciones]
  }
  const response = await apiClient.get('/inscripciones')
  return response.data
}

export const createInscripcion = async (data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const curso = mockDb.cursos.find((c) => c.idCurso === Number(data.idCurso))
    if (curso && curso.cuposDisponibles <= 0) {
      throw new Error(`El curso "${curso.nombre}" no cuenta con cupos disponibles (capacidad: ${curso.capacidadMaxima})`)
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

export const cancelarInscripcion = async (idInscripcion) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const index = mockDb.inscripciones.findIndex((i) => i.idInscripcion === Number(idInscripcion))
    if (index === -1) throw new Error('Inscripción no encontrada')

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
