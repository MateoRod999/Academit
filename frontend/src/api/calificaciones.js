import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

export const getCalificaciones = async (filtros = {}) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    let lista = [...mockDb.calificaciones]
    if (filtros.idAlumno) {
      lista = lista.filter((c) => c.idAlumno === Number(filtros.idAlumno))
    }
    if (filtros.tipo) {
      lista = lista.filter((c) => c.tipo === filtros.tipo)
    }
    if (filtros.idMateria) {
      lista = lista.filter((c) => c.idMateria === Number(filtros.idMateria))
    }
    return lista
  }
  const response = await apiClient.get('/calificaciones', { params: filtros })
  return response.data
}

export const saveCalificacion = async (data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const notaNum = Number(data.nota)
    if (isNaN(notaNum) || notaNum < 1 || notaNum > 10) {
      throw new Error('La calificación debe ser un valor numérico entre 1 y 10')
    }

    const index = mockDb.calificaciones.findIndex(
      (c) => c.idAlumno === Number(data.idAlumno) && c.idMateria === Number(data.idMateria) && c.evaluacionNombre === data.evaluacionNombre
    )

    const condicion = notaNum >= 4 ? 'APROBADO' : 'DESAPROBADO'

    if (index !== -1) {
      mockDb.calificaciones[index] = {
        ...mockDb.calificaciones[index],
        nota: notaNum,
        condicion,
        observacion: data.observacion || mockDb.calificaciones[index].observacion,
      }
      return { ...mockDb.calificaciones[index] }
    }

    const alumno = mockDb.alumnos.find((a) => a.idAlumno === Number(data.idAlumno))
    const materia = mockDb.materias.find((m) => m.idMateria === Number(data.idMateria))
    const nuevoId = Math.max(...mockDb.calificaciones.map((c) => c.idCalificacion), 0) + 1

    const nuevo = {
      idCalificacion: nuevoId,
      idAlumno: Number(data.idAlumno),
      alumnoNombre: alumno ? `${alumno.nombre} ${alumno.apellido}` : data.alumnoNombre || 'Alumno',
      idMateria: Number(data.idMateria),
      materiaNombre: materia ? materia.nombre : data.materiaNombre || 'Materia',
      evaluacionNombre: data.evaluacionNombre || 'Evaluación',
      tipo: data.tipo || 'PARCIAL',
      nota: notaNum,
      fecha: data.fecha || new Date().toISOString().split('T')[0],
      condicion,
      observacion: data.observacion || '',
    }
    mockDb.calificaciones.push(nuevo)
    return { ...nuevo }
  }
  const response = await apiClient.post('/calificaciones', data)
  return response.data
}
