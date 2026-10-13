import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

export const getDocumentacion = async (idAlumno = null) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    if (idAlumno) {
      return mockDb.documentacion.filter((d) => d.idAlumno === Number(idAlumno))
    }
    return [...mockDb.documentacion]
  }
  const response = await apiClient.get('/documentacion', { params: idAlumno ? { idAlumno } : {} })
  return response.data
}

export const updateDocumentacion = async (idDocumento, data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const index = mockDb.documentacion.findIndex((d) => d.idDocumento === Number(idDocumento))
    if (index === -1) throw new Error('Documento no encontrado')
    mockDb.documentacion[index] = { ...mockDb.documentacion[index], ...data }
    return { ...mockDb.documentacion[index] }
  }
  const response = await apiClient.put(`/documentacion/${idDocumento}`, data)
  return response.data
}
