import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

export const getCursos = async () => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return [...mockDb.cursos]
  }
  const response = await apiClient.get('/cursos')
  return response.data
}

export const createCurso = async (data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const nuevoId = Math.max(...mockDb.cursos.map((c) => c.idCurso), 0) + 1
    const capMax = Number(data.capacidadMaxima) || 30
    const inscriptos = Number(data.inscriptos) || 0
    const nuevo = {
      idCurso: nuevoId,
      codigo: data.codigo || `${nuevoId}A-INF`,
      nombre: data.nombre,
      turno: data.turno || 'MAÑANA',
      capacidadMaxima: capMax,
      inscriptos: inscriptos,
      cuposDisponibles: Math.max(capMax - inscriptos, 0),
      cicloLectivo: Number(data.cicloLectivo) || 2026,
      aula: data.aula || 'Aula por asignar',
    }
    mockDb.cursos.push(nuevo)
    return { ...nuevo }
  }
  const response = await apiClient.post('/cursos', data)
  return response.data
}

export const updateCurso = async (idCurso, data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const index = mockDb.cursos.findIndex((c) => c.idCurso === Number(idCurso))
    if (index === -1) throw new Error('Curso no encontrado')
    const capMax = data.capacidadMaxima !== undefined ? Number(data.capacidadMaxima) : mockDb.cursos[index].capacidadMaxima
    const inscriptos = data.inscriptos !== undefined ? Number(data.inscriptos) : mockDb.cursos[index].inscriptos

    mockDb.cursos[index] = {
      ...mockDb.cursos[index],
      ...data,
      capacidadMaxima: capMax,
      inscriptos: inscriptos,
      cuposDisponibles: Math.max(capMax - inscriptos, 0),
    }
    return { ...mockDb.cursos[index] }
  }
  const response = await apiClient.put(`/cursos/${idCurso}`, data)
  return response.data
}
