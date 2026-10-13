import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

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

export const resolverSolicitud = async (idSolicitud, { estado, respuesta = '' }) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const index = mockDb.solicitudes.findIndex((s) => s.idSolicitud === Number(idSolicitud))
    if (index === -1) throw new Error('Solicitud no encontrada')

    mockDb.solicitudes[index] = {
      ...mockDb.solicitudes[index],
      estado, // 'APROBADA' | 'RECHAZADA' | 'EN_PROCESO'
      fechaResolucion: new Date().toISOString().split('T')[0],
      respuesta: respuesta || (estado === 'APROBADA' ? 'Solicitud aprobada por el área administrativa' : 'Solicitud rechazada'),
    }
    return { ...mockDb.solicitudes[index] }
  }
  const response = await apiClient.put(`/solicitudes/${idSolicitud}/resolver`, { estado, respuesta })
  return response.data
}
