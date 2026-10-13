import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

/**
 * Obtiene el listado completo de alumnos.
 * En modo mock retorna mockDb.alumnos.
 * En modo real llama a GET /alumnos.
 */
export const getAlumnos = async () => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return [...mockDb.alumnos]
  }

  const response = await apiClient.get('/alumnos')
  return response.data
}

/**
 * Obtiene un alumno por su ID.
 */
export const getAlumnoById = async (idAlumno) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const found = mockDb.alumnos.find((a) => a.idAlumno === Number(idAlumno))
    if (!found) throw new Error('Alumno no encontrado')
    return { ...found }
  }

  const response = await apiClient.get(`/alumnos/${idAlumno}`)
  return response.data
}

/**
 * Crea un nuevo alumno.
 */
export const createAlumno = async (alumnoData) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const nuevoId = Math.max(...mockDb.alumnos.map((a) => a.idAlumno), 0) + 1
    const nuevo = {
      idAlumno: nuevoId,
      legajo: alumnoData.legajo || `ALU-${1000 + nuevoId}`,
      nombre: alumnoData.nombre,
      apellido: alumnoData.apellido,
      dni: alumnoData.dni,
      email: alumnoData.email,
      telefono: alumnoData.telefono || 'Sin teléfono',
      fechaNacimiento: alumnoData.fechaNacimiento || '2000-01-01',
      direccion: alumnoData.direccion || 'No especificada',
      carrera: alumnoData.carrera || 'Tecnicatura Superior en Desarrollo de Software',
      idCarrera: alumnoData.idCarrera || 1,
      idCurso: alumnoData.idCurso || 1,
      cursoNombre: alumnoData.cursoNombre || '1° Año - Turno Mañana',
      idMatricula: nuevoId,
      estadoMatricula: 'ACTIVA',
      cicloLectivo: 2026,
      estado: 'ACTIVO',
    }
    mockDb.alumnos.unshift(nuevo)
    return { ...nuevo }
  }

  const response = await apiClient.post('/alumnos', alumnoData)
  return response.data
}

/**
 * Actualiza los datos de un alumno existente.
 */
export const updateAlumno = async (idAlumno, alumnoData) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const index = mockDb.alumnos.findIndex((a) => a.idAlumno === Number(idAlumno))
    if (index === -1) throw new Error('Alumno no encontrado')

    mockDb.alumnos[index] = {
      ...mockDb.alumnos[index],
      ...alumnoData,
    }
    return { ...mockDb.alumnos[index] }
  }

  const response = await apiClient.put(`/alumnos/${idAlumno}`, alumnoData)
  return response.data
}

/**
 * Realiza la baja lógica de un alumno.
 */
export const deleteAlumno = async (idAlumno) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const index = mockDb.alumnos.findIndex((a) => a.idAlumno === Number(idAlumno))
    if (index === -1) throw new Error('Alumno no encontrado')

    mockDb.alumnos[index].estado = 'INACTIVO'
    return { success: true }
  }

  const response = await apiClient.delete(`/alumnos/${idAlumno}`)
  return response.data
}
