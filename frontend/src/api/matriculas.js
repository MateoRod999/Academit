import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

export const getMatriculas = async () => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return [...mockDb.matriculas]
  }
  const response = await apiClient.get('/matriculas')
  return response.data
}

export const updateMatricula = async (idMatricula, data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const index = mockDb.matriculas.findIndex((m) => m.idMatricula === Number(idMatricula))
    if (index === -1) throw new Error('Matrícula no encontrada')
    mockDb.matriculas[index] = { ...mockDb.matriculas[index], ...data }
    return { ...mockDb.matriculas[index] }
  }
  const response = await apiClient.put(`/matriculas/${idMatricula}`, data)
  return response.data
}

/**
 * Cancelación de matrícula por parte del alumno o secretaría (RF27).
 * Cambia el estado de la matrícula a CANCELADA y actualiza el alumno.
 */
export const cancelarMatricula = async (idAlumno = 1, motivo = '') => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 250))
    const matricula = mockDb.matriculas.find((m) => m.idAlumno === Number(idAlumno))
    if (matricula) {
      matricula.estado = 'CANCELADA'
    }

    const alumno = mockDb.alumnos.find((a) => a.idAlumno === Number(idAlumno))
    if (alumno) {
      alumno.estadoMatricula = 'CANCELADA'
      alumno.estado = 'INACTIVO'
    }

    // Registra como solicitud resuelta
    const nuevoIdSol = Math.max(...mockDb.solicitudes.map((s) => s.idSolicitud), 0) + 1
    mockDb.solicitudes.unshift({
      idSolicitud: nuevoIdSol,
      idAlumno: Number(idAlumno),
      alumnoNombre: alumno ? `${alumno.nombre} ${alumno.apellido}` : 'Alumno',
      tipo: 'Cancelación definitiva de matrícula',
      fechaSolicitud: new Date().toISOString().split('T')[0],
      motivo: motivo || 'Solicitud de baja voluntaria del alumno',
      estado: 'APROBADA',
      fechaResolucion: new Date().toISOString().split('T')[0],
      respuesta: 'Matrícula dada de baja formalmente (RF27).',
    })

    return { success: true, matricula }
  }
  const response = await apiClient.post(`/matriculas/cancelar`, { idAlumno, motivo })
  return response.data
}
