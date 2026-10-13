import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

/**
 * Obtiene el listado de solicitudes y trámites institucionales con filtros opcionales.
 * REST: GET /api/solicitudes
 * @param {Object} [filtros={}] - Filtros por idAlumno, tipo o estado
 * @returns {Promise<Array<Object>>}
 */
export const getSolicitudes = async (filtros = {}) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    let lista = [...mockDb.solicitudes]
    if (filtros.idAlumno) {
      lista = lista.filter((s) => s.idAlumno === Number(filtros.idAlumno))
    }
    if (filtros.tipo) {
      lista = lista.filter((s) => s.tipo.toLowerCase().includes(filtros.tipo.toLowerCase()))
    }
    if (filtros.estado) {
      lista = lista.filter((s) => s.estado === filtros.estado)
    }
    return lista
  }
  const response = await apiClient.get('/solicitudes', { params: filtros })
  return response.data
}

/**
 * Genera una nueva solicitud o trámite del estudiante (constancias, DDJJ, pasantías, título, académicas).
 * REST: POST /api/solicitudes
 * @param {Object} data - Datos de la solicitud (idAlumno, tipo, motivo, observaciones)
 * @returns {Promise<Object>}
 */
export const createSolicitud = async (data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const nuevoId = Math.max(...mockDb.solicitudes.map((s) => s.idSolicitud), 0) + 1
    const idAlumno = data.idAlumno ? Number(data.idAlumno) : 1
    const alumno = mockDb.alumnos.find((a) => a.idAlumno === idAlumno)

    const nuevo = {
      idSolicitud: nuevoId,
      idAlumno,
      alumnoNombre: alumno ? `${alumno.nombre} ${alumno.apellido}` : data.alumnoNombre || 'Lucía Benítez',
      tipo: data.tipo,
      fechaSolicitud: new Date().toISOString().split('T')[0],
      motivo: data.motivo,
      observaciones: data.observaciones || '',
      estado: 'PENDIENTE',
      fechaResolucion: null,
      respuesta: null,
    }
    mockDb.solicitudes.unshift(nuevo)
    return { ...nuevo }
  }
  const response = await apiClient.post('/solicitudes', data)
  return response.data
}

/**
 * Resuelve una solicitud en la bandeja administrativa (APROBADA o RECHAZADA).
 * REST: PATCH /api/solicitudes/{id}
 * @param {number|string} idSolicitud - Identificador de la solicitud
 * @param {Object} resolucion - Datos de resolución
 * @param {string} resolucion.estado - Estado asignado ('APROBADA' | 'RECHAZADA' | 'EN_PROCESO')
 * @param {string} [resolucion.observacion=''] - Observación o respuesta administrativa
 * @returns {Promise<Object>}
 */
export const resolverSolicitud = async (idSolicitud, { estado, observacion, respuesta = '' }) => {
  const idSol = Number(idSolicitud)
  const obs = observacion !== undefined ? observacion : respuesta

  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const index = mockDb.solicitudes.findIndex((s) => s.idSolicitud === idSol)
    if (index === -1) throw new Error('Solicitud no encontrada')

    const textoRespuesta = obs || (estado === 'APROBADA' ? 'Solicitud aprobada por el área administrativa' : 'Solicitud rechazada')
    mockDb.solicitudes[index] = {
      ...mockDb.solicitudes[index],
      estado, // 'APROBADA' | 'RECHAZADA' | 'EN_PROCESO'
      fechaResolucion: new Date().toISOString().split('T')[0],
      respuesta: textoRespuesta,
      observacion: textoRespuesta,
    }
    return { ...mockDb.solicitudes[index] }
  }

  const response = await apiClient.patch(`/solicitudes/${idSol}`, { estado, observacion: obs })
  return response.data
}

