import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

/**
 * Obtiene el listado de mesas de examen final programadas.
 * REST: GET /api/mesas-examen
 * @returns {Promise<Array<Object>>}
 */
export const getMesasExamen = async () => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return [...mockDb.mesasExamen]
  }
  const response = await apiClient.get('/mesas-examen')
  return response.data
}

/**
 * Inscribe a un alumno en una mesa de examen final (RF49).
 * REST: POST /api/mesas-examen/{id}/inscribir
 * @param {number|string} idMesa - Identificador de la mesa
 * @param {number|string} [idAlumno=1] - Identificador del alumno
 * @returns {Promise<Object>}
 */
export const inscribirseMesa = async (idMesa, idAlumno = 1) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const mesa = mockDb.mesasExamen.find((m) => m.idMesa === Number(idMesa))
    if (!mesa) throw new Error('Mesa de examen no encontrada')

    if (mesa.alumnosInscriptosIds.includes(Number(idAlumno))) {
      throw new Error('Ya se encuentra inscripto en esta mesa de examen')
    }

    if (mesa.inscriptos >= mesa.cupoMaximo) {
      throw new Error('La mesa no posee cupos disponibles')
    }

    mesa.alumnosInscriptosIds.push(Number(idAlumno))
    mesa.inscriptos += 1
    return { ...mesa }
  }
  const response = await apiClient.post(`/mesas-examen/${idMesa}/inscribir`, { idAlumno })
  return response.data
}

/**
 * Da de baja la inscripción de un alumno a una mesa de examen (RF50).
 * REST: POST /api/mesas-examen/{id}/baja
 * @param {number|string} idMesa - Identificador de la mesa
 * @param {number|string} [idAlumno=1] - Identificador del alumno
 * @returns {Promise<Object>}
 */
export const darseDeBajaMesa = async (idMesa, idAlumno = 1) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const mesa = mockDb.mesasExamen.find((m) => m.idMesa === Number(idMesa))
    if (!mesa) throw new Error('Mesa de examen no encontrada')

    mesa.alumnosInscriptosIds = mesa.alumnosInscriptosIds.filter((id) => id !== Number(idAlumno))
    if (mesa.inscriptos > 0) mesa.inscriptos -= 1
    return { ...mesa }
  }
  const response = await apiClient.post(`/mesas-examen/${idMesa}/baja`, { idAlumno })
  return response.data
}

/**
 * Programa una nueva mesa de examen final en secretaría académica.
 * REST: POST /api/mesas-examen
 * @param {Object} data - Datos de la mesa (idMateria, fecha, hora, turno, tribunal, aula, cupoMaximo)
 * @returns {Promise<Object>}
 */
export const createMesa = async (data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const nuevoId = Math.max(...mockDb.mesasExamen.map((m) => m.idMesa), 0) + 1
    const materia = mockDb.materias.find((m) => m.idMateria === Number(data.idMateria))
    const nuevo = {
      idMesa: nuevoId,
      idMateria: Number(data.idMateria),
      materiaNombre: materia ? materia.nombre : data.materiaNombre || 'Materia',
      fecha: data.fecha,
      hora: data.hora || '09:00 hs',
      turno: data.turno || 'MAÑANA',
      tribunal: data.tribunal || 'Por asignar',
      aula: data.aula || 'Aula 101',
      cupoMaximo: Number(data.cupoMaximo) || 30,
      inscriptos: 0,
      estadoMesa: 'ABIERTA',
      alumnosInscriptosIds: [],
    }
    mockDb.mesasExamen.push(nuevo)
    return { ...nuevo }
  }
  const response = await apiClient.post('/mesas-examen', data)
  return response.data
}

/**
 * Actualiza los datos o estado de una mesa de examen final existente.
 * REST: PUT /api/mesas-examen/{id}
 * @param {number|string} idMesa - Identificador de la mesa
 * @param {Object} data - Campos actualizados
 * @returns {Promise<Object>}
 */
export const updateMesa = async (idMesa, data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const index = mockDb.mesasExamen.findIndex((m) => m.idMesa === Number(idMesa))
    if (index === -1) throw new Error('Mesa no encontrada')
    mockDb.mesasExamen[index] = { ...mockDb.mesasExamen[index], ...data }
    return { ...mockDb.mesasExamen[index] }
  }
  const response = await apiClient.put(`/mesas-examen/${idMesa}`, data)
  return response.data
}
