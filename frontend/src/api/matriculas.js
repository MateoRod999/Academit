import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'
import { createApiError } from './errors'

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
    if (index === -1) {
      throw createApiError(404, 'Matrícula no encontrada', [
        { campo: 'idMatricula', mensaje: 'Matrícula no encontrada' },
      ])
    }
    mockDb.matriculas[index] = { ...mockDb.matriculas[index], ...data }
    return { ...mockDb.matriculas[index] }
  }
  const response = await apiClient.put(`/matriculas/${idMatricula}`, data)
  return response.data
}

/**
 * Registra la cancelación definitiva de matrícula de un alumno (RF27).
 * REST: PATCH /api/matriculas/{id}
 * @param {number|string} idMatricula - Identificador de la matrícula a cancelar (o idAlumno)
 * @param {string} [motivo=''] - Motivo opcional de la baja
 * @returns {Promise<Object>}
 */
export const cancelarMatricula = async (idMatricula = 1, motivo = '') => {
  const idNum = Number(idMatricula)

  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 250))
    const matricula = mockDb.matriculas.find((m) => m.idMatricula === idNum || m.idAlumno === idNum)
    if (matricula) {
      matricula.estado = 'CANCELADA'
    }

    const idAlumno = matricula ? matricula.idAlumno : idNum
    const alumno = mockDb.alumnos.find((a) => a.idAlumno === idAlumno)
    if (alumno) {
      alumno.estadoMatricula = 'CANCELADA'
      alumno.estado = 'INACTIVO'
    }

    // Registra como solicitud resuelta
    const nuevoIdSol = Math.max(...mockDb.solicitudes.map((s) => s.idSolicitud), 0) + 1
    mockDb.solicitudes.unshift({
      idSolicitud: nuevoIdSol,
      idAlumno,
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

  const response = await apiClient.patch(`/matriculas/${idNum}`, { estado: 'CANCELADA' })
  return response.data
}


/**
 * Genera el plan de 12 cuotas mensuales y 3 seguros cuatrimestrales para una matrícula individual.
 * REST: POST /api/matriculas/{id}/cuotas
 * @param {number|string} idMatricula - Identificador de la matrícula
 * @returns {Promise<Array<Object>>}
 */
export const generarCuotas = async (idMatricula) => {
  const idMat = Number(idMatricula)

  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const matricula = mockDb.matriculas.find((m) => m.idMatricula === idMat)
    if (!matricula) {
      throw createApiError(404, 'Matrícula no encontrada', [
        { campo: 'idMatricula', mensaje: 'Matrícula no encontrada' },
      ])
    }

    if (matricula.estado === 'CANCELADA') {
      throw createApiError(409, 'No se pueden generar cuotas para una matrícula CANCELADA', [
        { campo: 'estado', mensaje: 'No se pueden generar cuotas para una matrícula CANCELADA' },
      ])
    }

    // Verificar si ya tiene cuotas asociadas por idMatricula o idAlumno
    const cuotasExistentes = mockDb.cuotas.filter(
      (c) => c.idMatricula === idMat || (c.idAlumno === matricula.idAlumno && c.idMatricula === idMat)
    )
    if (cuotasExistentes.length > 0) {
      throw createApiError(409, `La matrícula #${idMat} ya tiene cuotas generadas`, [
        { campo: 'idMatricula', mensaje: `La matrícula #${idMat} ya tiene cuotas generadas` },
      ])
    }

    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ]

    const nuevasCuotas = []
    let nextId = Math.max(...mockDb.cuotas.map((c) => c.idCuota), 0) + 1
    const anio = matricula.cicloLectivo || 2026

    // 12 cuotas mensuales
    for (let i = 1; i <= 12; i++) {
      const mesStr = String(i).padStart(2, '0')
      const cuota = {
        idCuota: nextId++,
        idMatricula: idMat,
        idAlumno: matricula.idAlumno,
        alumnoNombre: matricula.alumnoNombre,
        concepto: `Cuota ${i} - ${meses[i - 1]} ${anio}`,
        tipo: 'MENSUAL',
        numero: i,
        periodo: `${meses[i - 1]} ${anio}`,
        fechaVencimiento: `${anio}-${mesStr}-10`,
        importe: 28000,
        estado: 'PENDIENTE',
        fechaPago: null,
        comprobante: null,
      }
      nuevasCuotas.push(cuota)
    }

    // 3 seguros cuatrimestrales
    const segurosConfig = [
      { num: 1, mesVto: '03', periodo: `1° Cuatrimestre ${anio}` },
      { num: 2, mesVto: '07', periodo: `2° Cuatrimestre ${anio}` },
      { num: 3, mesVto: '11', periodo: `3° Cuatrimestre ${anio}` },
    ]

    for (const seg of segurosConfig) {
      const cuotaSeguro = {
        idCuota: nextId++,
        idMatricula: idMat,
        idAlumno: matricula.idAlumno,
        alumnoNombre: matricula.alumnoNombre,
        concepto: `Seguro Cuatrimestral ${seg.num}/3`,
        tipo: 'SEGURO_CUATRIMESTRAL',
        numero: seg.num,
        periodo: seg.periodo,
        fechaVencimiento: `${anio}-${seg.mesVto}-10`,
        importe: 8000,
        estado: 'PENDIENTE',
        fechaPago: null,
        comprobante: null,
      }
      nuevasCuotas.push(cuotaSeguro)
    }

    mockDb.cuotas.push(...nuevasCuotas)
    return nuevasCuotas
  }

  const response = await apiClient.post(`/matriculas/${idMat}/cuotas`)
  return response.data
}

