import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

export const getAsistencias = async (filtros = {}) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    let lista = [...mockDb.asistencias]
    if (filtros.idAlumno) {
      lista = lista.filter((a) => a.idAlumno === Number(filtros.idAlumno))
    }
    if (filtros.idCurso) {
      lista = lista.filter((a) => a.idCurso === Number(filtros.idCurso))
    }
    if (filtros.fecha) {
      lista = lista.filter((a) => a.fecha === filtros.fecha)
    }
    return lista
  }
  const response = await apiClient.get('/asistencias', { params: filtros })
  return response.data
}

export const registrarAsistencias = async (asistenciasList) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    asistenciasList.forEach((item) => {
      const index = mockDb.asistencias.findIndex(
        (a) => a.idAlumno === Number(item.idAlumno) && a.fecha === item.fecha && a.idCurso === Number(item.idCurso)
      )

      if (index !== -1) {
        mockDb.asistencias[index].estado = item.estado
      } else {
        const nuevoId = Math.max(...mockDb.asistencias.map((a) => a.idAsistencia), 0) + 1
        const alumno = mockDb.alumnos.find((al) => al.idAlumno === Number(item.idAlumno))
        mockDb.asistencias.push({
          idAsistencia: nuevoId,
          idAlumno: Number(item.idAlumno),
          alumnoNombre: alumno ? `${alumno.nombre} ${alumno.apellido}` : item.alumnoNombre || 'Alumno',
          idMateria: item.idMateria || 1,
          materiaNombre: item.materiaNombre || 'Programación I',
          idCurso: Number(item.idCurso),
          fecha: item.fecha,
          estado: item.estado, // 'PRESENTE' | 'AUSENTE' | 'TARDANZA' | 'JUSTIFICADO'
        })
      }
    })
    return { success: true, count: asistenciasList.length }
  }
  const response = await apiClient.post('/asistencias/lote', asistenciasList)
  return response.data
}
