import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'
import { createApiError } from './errors'

/**
 * Obtiene el listado de calificaciones según filtros opcionales (idAlumno, tipo, idMateria).
 * REST: GET /api/calificaciones
 * @param {Object} [filtros={}] - Parámetros de consulta
 * @returns {Promise<Array<Object>>}
 */
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
    if (filtros.idEvaluacion) {
      lista = lista.filter((c) => c.idEvaluacion === Number(filtros.idEvaluacion))
    }
    return lista
  }
  const response = await apiClient.get('/calificaciones', { params: filtros })
  return response.data
}

/**
 * Guarda las calificaciones de una evaluación en lote (atómico, todo o nada).
 * REST: POST /api/evaluaciones/{idEvaluacion}/calificaciones
 * @param {number|string} idEvaluacion - ID de la evaluación
 * @param {Array<{ idAlumno: number|string, nota: number|string, observacion?: string }>} lista - Lista de notas por alumno
 * @returns {Promise<Array<Object>>}
 */
export const guardarCalificaciones = async (idEvaluacion, lista) => {
  const idEval = Number(idEvaluacion)

  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const evaluacion = mockDb.evaluaciones.find((e) => e.idEvaluacion === idEval)
    const errores = {}

    // Validación atómica "todo o nada" de todo el lote
    for (const item of lista) {
      const idAlu = Number(item.idAlumno)
      const notaNum = Number(item.nota)
      const alumno = mockDb.alumnos.find((a) => a.idAlumno === idAlu)

      if (!alumno) {
        errores[idAlu] = `El alumno ID ${idAlu} no existe.`
        continue
      }

      if (evaluacion && evaluacion.idCurso && alumno.idCurso !== evaluacion.idCurso) {
        errores[idAlu] = `El alumno ${alumno.apellido}, ${alumno.nombre} no está inscripto en el curso correspondiente.`
        continue
      }

      if (isNaN(notaNum) || !Number.isInteger(notaNum) || notaNum < 1 || notaNum > 10) {
        errores[idAlu] = `La nota (${item.nota}) debe ser un número entero entre 1 y 10.`
      }
    }

    if (Object.keys(errores).length > 0) {
      const err = new Error('Se detectaron errores de validación en el lote de calificaciones. Ninguna nota fue guardada.')
      err.status = 400
      err.errores = errores
      err.detalles = Object.entries(errores).map(([idAlu, error]) => ({ idAlumno: Number(idAlu), error }))
      throw err
    }

    // Si todas son válidas, se persisten en mockDb
    const materia = evaluacion
      ? mockDb.materias.find((m) => m.idMateria === evaluacion.idMateria)
      : mockDb.materias[0]

    const hoy = new Date().toISOString().split('T')[0]
    const resultados = []

    for (const item of lista) {
      const idAlu = Number(item.idAlumno)
      const notaNum = Number(item.nota)
      const condicion = notaNum >= 4 ? 'APROBADO' : 'DESAPROBADO'
      const alumno = mockDb.alumnos.find((a) => a.idAlumno === idAlu)

      const index = mockDb.calificaciones.findIndex(
        (c) =>
          c.idAlumno === idAlu &&
          (c.idEvaluacion === idEval ||
            (evaluacion && c.idMateria === evaluacion.idMateria && c.evaluacionNombre === evaluacion.descripcion))
      )

      if (index !== -1) {
        mockDb.calificaciones[index] = {
          ...mockDb.calificaciones[index],
          idEvaluacion: idEval,
          nota: notaNum,
          condicion,
          observacion: item.observacion !== undefined ? item.observacion : mockDb.calificaciones[index].observacion,
        }
        resultados.push({ ...mockDb.calificaciones[index] })
      } else {
        const nuevoId = Math.max(...mockDb.calificaciones.map((c) => c.idCalificacion), 0) + 1
        const nuevo = {
          idCalificacion: nuevoId,
          idEvaluacion: idEval,
          idAlumno: idAlu,
          alumnoNombre: alumno ? `${alumno.nombre} ${alumno.apellido}` : 'Alumno',
          idMateria: evaluacion ? evaluacion.idMateria : (materia ? materia.idMateria : 1),
          materiaNombre: evaluacion ? evaluacion.materiaNombre : (materia ? materia.nombre : 'Materia'),
          evaluacionNombre: evaluacion ? evaluacion.descripcion : 'Evaluación',
          tipo: evaluacion ? evaluacion.tipo : 'PARCIAL',
          nota: notaNum,
          fecha: evaluacion ? evaluacion.fecha : hoy,
          condicion,
          observacion: item.observacion || '',
        }
        mockDb.calificaciones.push(nuevo)
        resultados.push(nuevo)
      }
    }

    return resultados
  }

  // Cuerpo: [{ idAlumno, nota }]
  const cuerpo = lista.map((i) => ({
    idAlumno: Number(i.idAlumno),
    nota: Number(i.nota),
  }))
  const response = await apiClient.post(`/evaluaciones/${idEval}/calificaciones`, cuerpo)
  return response.data
}

/**
 * Registra o actualiza la calificación individual de un alumno.
 * REST: POST /api/calificaciones
 * @param {Object} data - Datos de la calificación
 * @returns {Promise<Object>}
 */
export const saveCalificacion = async (data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const notaNum = Number(data.nota)
    if (isNaN(notaNum) || !Number.isInteger(notaNum) || notaNum < 1 || notaNum > 10) {
      throw createApiError(400, 'Calificación inválida', [
        { campo: 'nota', mensaje: 'La calificación debe ser un valor entero entre 1 y 10' },
      ])
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

