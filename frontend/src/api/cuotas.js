import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

/**
 * Obtiene el listado de cuotas y seguros.
 * Puede filtrarse por idAlumno opcionalmente.
 */
export const getCuotas = async (idAlumno = null) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    if (idAlumno) {
      return mockDb.cuotas.filter((c) => c.idAlumno === Number(idAlumno))
    }
    return [...mockDb.cuotas]
  }

  const response = await apiClient.get('/cuotas', {
    params: idAlumno ? { idAlumno } : {},
  })
  return response.data
}

/**
 * Registra el pago completo de una cuota.
 */
export const pagarCuota = async (idCuota, medioPago = 'EFECTIVO') => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const index = mockDb.cuotas.findIndex((c) => c.idCuota === Number(idCuota))
    if (index === -1) throw new Error('Cuota no encontrada')

    const cuota = mockDb.cuotas[index]
    const hoy = new Date().toISOString().split('T')[0]
    const comprobante = `REC-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`

    // Actualiza estado de la cuota
    mockDb.cuotas[index] = {
      ...cuota,
      estado: 'PAGADA',
      fechaPago: hoy,
      comprobante,
    }

    // Registra en mockDb.pagos
    const nuevoIdPago = Math.max(...mockDb.pagos.map((p) => p.idPago), 0) + 1
    mockDb.pagos.unshift({
      idPago: nuevoIdPago,
      idAlumno: cuota.idAlumno,
      alumnoNombre: cuota.alumnoNombre,
      concepto: cuota.concepto,
      monto: cuota.monto,
      fechaPago: hoy,
      medioPago,
      comprobante,
      estado: 'ACREDITADO',
    })

    return { ...mockDb.cuotas[index] }
  }

  const response = await apiClient.post(`/cuotas/${idCuota}/pagar`, { medioPago })
  return response.data
}
