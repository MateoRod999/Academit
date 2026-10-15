import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'
import { createApiError } from './errors'

/**
 * Obtiene el historial de pagos registrados con filtros opcionales.
 * REST: GET /api/pagos
 * @param {Object} [filtros={}] - Filtros de búsqueda (idAlumno)
 * @returns {Promise<Array<Object>>}
 */
export const getPagos = async (filtros = {}) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    let lista = [...mockDb.pagos]
    if (filtros.idAlumno) {
      lista = lista.filter((p) => p.idAlumno === Number(filtros.idAlumno))
    }
    return lista
  }
  const response = await apiClient.get('/pagos', { params: filtros })
  return response.data
}

/**
 * Registra un nuevo pago arancelario por el importe total de la cuota (RN09).
 * El usuario que registra sale de la sesión en el backend.
 * REST: POST /api/pagos
 * @param {Object} pagoData - Datos del pago
 * @param {number|string} pagoData.idCuota - Identificador de la cuota
 * @param {number} pagoData.importe - Importe exacto de la cuota
 * @param {string} [pagoData.medioPago='EFECTIVO'] - Medio de pago utilizado
 * @returns {Promise<Object>}
 */
export const registrarPago = async ({ idCuota, importe, medioPago = 'EFECTIVO' }) => {
  const imp = Number(importe)
  const idC = Number(idCuota)

  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const cuota = mockDb.cuotas.find((c) => c.idCuota === idC)
    if (!cuota) {
      throw createApiError(404, 'Cuota no encontrada', [
        { campo: 'idCuota', mensaje: 'Cuota no encontrada' },
      ])
    }

    if (cuota.estado === 'PAGADA' || cuota.estado === 'ANULADA') {
      throw createApiError(409, `No se puede pagar una cuota en estado ${cuota.estado}`, [
        { campo: 'estado', mensaje: `No se puede pagar una cuota en estado ${cuota.estado}` },
      ])
    }

    const valorCuota = Number(cuota.importe)
    if (imp !== valorCuota) {
      throw createApiError(
        400,
        `El importe ingresado ($${imp}) no coincide con el valor exacto de la cuota ($${valorCuota}). No se permiten pagos parciales (RN09).`,
        [
          {
            campo: 'importe',
            mensaje: `El importe ($${imp}) debe ser igual al valor de la cuota ($${valorCuota}). No se permiten pagos parciales.`,
          },
        ]
      )
    }

    const hoy = new Date().toISOString().split('T')[0]
    const comprobante = `REC-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`

    // Al pagar con éxito, el mock pasa la cuota a PAGADA
    cuota.estado = 'PAGADA'
    cuota.fechaPago = hoy
    cuota.comprobante = comprobante

    const nuevoId = Math.max(...mockDb.pagos.map((p) => p.idPago), 0) + 1
    const nuevoPago = {
      idPago: nuevoId,
      idCuota: cuota.idCuota,
      idAlumno: cuota.idAlumno,
      alumnoNombre: cuota.alumnoNombre,
      concepto: cuota.concepto,
      importe: valorCuota,
      fechaPago: hoy,
      medioPago: medioPago || 'EFECTIVO',
      comprobante,
      estado: 'ACREDITADO',
    }

    mockDb.pagos.unshift(nuevoPago)
    return { ...nuevoPago }
  }

  const response = await apiClient.post('/pagos', {
    idCuota: idC,
    importe: imp,
    medioPago,
  })
  return response.data
}
