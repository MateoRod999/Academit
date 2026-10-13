import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

export const getEvaluaciones = async (filtros = {}) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    let lista = [...mockDb.evaluaciones]
    if (filtros.tipo) {
      lista = lista.filter((e) => e.tipo === filtros.tipo)
    }
    if (filtros.idCurso) {
      lista = lista.filter((e) => e.idCurso === Number(filtros.idCurso))
    }
    return lista
  }
  const response = await apiClient.get('/evaluaciones', { params: filtros })
  return response.data
}

export const createEvaluacion = async (data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const nuevoId = Math.max(...mockDb.evaluaciones.map((e) => e.idEvaluacion), 0) + 1
    const materia = mockDb.materias.find((m) => m.idMateria === Number(data.idMateria))
    const curso = mockDb.cursos.find((c) => c.idCurso === Number(data.idCurso))

    const nuevo = {
      idEvaluacion: nuevoId,
      idMateria: Number(data.idMateria),
      materiaNombre: materia ? materia.nombre : data.materiaNombre || 'Materia',
      idCurso: Number(data.idCurso),
      cursoNombre: curso ? curso.nombre : data.cursoNombre || 'Curso',
      fecha: data.fecha,
      tipo: data.tipo, // 'PARCIAL' | 'TRABAJO_PRACTICO'
      descripcion: data.descripcion,
      ponderacion: data.ponderacion || '30%',
    }
    mockDb.evaluaciones.unshift(nuevo)
    return { ...nuevo }
  }
  const response = await apiClient.post('/evaluaciones', data)
  return response.data
}
