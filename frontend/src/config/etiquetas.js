/**
 * Diccionario centralizado de etiquetas visibles para valores de enums en Academit.
 * Regla: Los datos en backend/mocks son códigos sin tildes ni espacios (ej: MANANA, CONSTANCIA, DNI).
 * Ningún texto visible de pantalla debe usarse como valor de dato.
 */

export const ETIQUETAS_TURNO = {
  MANANA: 'Mañana',
  TARDE: 'Tarde',
  NOCHE: 'Noche',
}

export const ETIQUETAS_TIPO_SOLICITUD = {
  CONSTANCIA: 'Constancia de Alumno Regular',
  PASANTIA: 'Pasantía Educativa',
  TITULO_INTERMEDIO: 'Solicitud de Título Intermedio',
  ACADEMICA: 'Solicitud Académica',
  CAMBIO_CARRERA: 'Cambio de Carrera',
  REINCORPORACION: 'Reincorporación a Carrera',
}

export const ETIQUETAS_TIPO_DOCUMENTACION = {
  DNI: 'DNI (Frente y Dorso)',
  TITULO_SECUNDARIO: 'Título Secundario',
  APTO_MEDICO: 'Certificado de Aptitud Médica',
  FOTOS: 'Fotos 4x4',
}

export const ETIQUETAS_ESTADO_ALUMNO = {
  ACTIVO: 'Activo',
  INACTIVO: 'Inactivo',
}

export const ETIQUETAS_ESTADO_DOCENTE = {
  ACTIVO: 'Activo',
  INACTIVO: 'Inactivo',
}

export const ETIQUETAS = {
  TURNO: ETIQUETAS_TURNO,
  TIPO_SOLICITUD: ETIQUETAS_TIPO_SOLICITUD,
  TIPO_DOCUMENTACION: ETIQUETAS_TIPO_DOCUMENTACION,
  ESTADO_ALUMNO: ETIQUETAS_ESTADO_ALUMNO,
  ESTADO_DOCENTE: ETIQUETAS_ESTADO_DOCENTE,
}

export default ETIQUETAS
