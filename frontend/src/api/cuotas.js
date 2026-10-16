import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'
import { createApiError } from './errors'

/**
 * Enriquecer cuota con campos calculados derivados de la matrícula (idAlumno, alumnoNombre)
 * @param {Object} cuota
 * @returns {Object}
 */
const calcularCamposCuota = (cuota) => {
  const matricula = mockDb.matriculas.find((m) => m.idMatricula === cuota.idMatricula)
  return {
    ...cuota,
    idAlumno: matricula ? matricula.idAlumno : (cuota.idAlumno || null),
    alumnoNombre: matricula ? matricula.alumnoNombre : (cuota.alumnoNombre || 'Estudiante'),
  }
}

/**
 * Obtiene el listado de cuotas y seguros (12 cuotas anuales + 3 seguros cuatrimestrales).
 * REST: GET /api/cuotas
 * @param {number|string|null} [idAlumno=null] - Filtro opcional por ID de alumno
 * @returns {Promise<Array<Object>>}
 */
export const getCuotas = async (idAlumno = null) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const cuotasConCalculados = mockDb.cuotas.map(calcularCamposCuota)
    if (idAlumno) {
      return cuotasConCalculados.filter((c) => c.idAlumno === Number(idAlumno))
    }
    return cuotasConCalculados
  }

  const response = await apiClient.get('/cuotas', {
    params: idAlumno ? { idAlumno } : {},
  })
  return response.data
}

/**
 * Anula una cuota administrativa (solo para administradores).
 * REST: PATCH /api/cuotas/{id}/anular
 * @param {number|string} idCuota - Identificador de la cuota
 * @returns {Promise<Object>}
 */
export const anularCuota = async (idCuota) => {
  const id = Number(idCuota)

  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const cuota = mockDb.cuotas.find((c) => c.idCuota === id)
    if (!cuota) {
      throw createApiError(404, 'Cuota no encontrada', [
        { campo: 'idCuota', mensaje: 'Cuota no encontrada' },
      ])
    }

    if (cuota.estado === 'PAGADA') {
      throw createApiError(409, 'No se puede anular una cuota pagada', [
        { campo: 'estado', mensaje: 'No se puede anular una cuota que ya se encuentra pagada' },
      ])
    }

    cuota.estado = 'ANULADA'
    return calcularCamposCuota(cuota)
  }

  const response = await apiClient.patch(`/cuotas/${id}/anular`)
  return response.data
}
