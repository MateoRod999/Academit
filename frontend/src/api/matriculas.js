import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

/**
 * Obtiene el padrón de matrículas anuales registradas.
 * REST: GET /api/matriculas
 * @returns {Promise<Array<Object>>}
 */
export const getMatriculas = async () => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return [...mockDb.matriculas]
  }
  const response = await apiClient.get('/matriculas')
  return response.data
}

/**
 * Actualiza el estado o información de una matrícula anual.
 * REST: PUT /api/matriculas/{id}
 * @param {number|string} idMatricula - Identificador de la matrícula
 * @param {Object} data - Datos actualizados (estado: 'ACTIVA' | 'PENDIENTE' | 'CANCELADA')
 * @returns {Promise<Object>}
 */
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
 * Registra la cancelación definitiva de matrícula de un alumno (RF27).
 * REST: POST /api/matriculas/cancelar
 * @param {number|string} [idAlumno=1] - Identificador del alumno
 * @param {string} [motivo=''] - Motivo de la baja voluntaria
 * @returns {Promise<Object>}
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
