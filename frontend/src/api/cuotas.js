import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

/**
 * Obtiene el listado de cuotas y seguros (12 cuotas anuales + 3 seguros cuatrimestrales).
 * REST: GET /api/cuotas
 * @param {number|string|null} [idAlumno=null] - Filtro opcional por ID de alumno
 * @returns {Promise<Array<Object>>}
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
