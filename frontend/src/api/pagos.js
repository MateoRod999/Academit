import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

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
 * Registra un nuevo pago arancelario por el importe total (EFECTIVO, TRANSFERENCIA, TARJETA, OTRO).
 * REST: POST /api/pagos
 * @param {Object} pagoData - Datos del pago (idAlumno, concepto, monto, medioPago, fechaPago, idCuota)
 * @returns {Promise<Object>}
 */
export const registrarPago = async (pagoData) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const nuevoId = Math.max(...mockDb.pagos.map((p) => p.idPago), 0) + 1
    const alumno = mockDb.alumnos.find((a) => a.idAlumno === Number(pagoData.idAlumno))
    const comprobante = `REC-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`

    const nuevo = {
      idPago: nuevoId,
      idAlumno: Number(pagoData.idAlumno),
      alumnoNombre: alumno ? `${alumno.nombre} ${alumno.apellido}` : pagoData.alumnoNombre || 'Alumno',
      concepto: pagoData.concepto,
      monto: Number(pagoData.monto),
      fechaPago: pagoData.fechaPago || new Date().toISOString().split('T')[0],
      medioPago: pagoData.medioPago || 'TRANSFERENCIA', // 'EFECTIVO' | 'TRANSFERENCIA' | 'TARJETA' | 'OTRO'
      comprobante,
      estado: 'ACREDITADO',
    }

    mockDb.pagos.unshift(nuevo)

    // Si se especificó idCuota, marcar la cuota como pagada
    if (pagoData.idCuota) {
      const cuota = mockDb.cuotas.find((c) => c.idCuota === Number(pagoData.idCuota))
      if (cuota) {
        cuota.estado = 'PAGADA'
        cuota.fechaPago = nuevo.fechaPago
        cuota.comprobante = comprobante
      }
    }

    return { ...nuevo }
  }
  const response = await apiClient.post('/pagos', pagoData)
  return response.data
}
