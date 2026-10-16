/**
 * Estructura estandarizada de errores para la API y Mocks de Academit.
 * Cumple con el contrato: { status, message, errors: [{ campo, mensaje }] }
 */
export class ApiError extends Error {
  constructor(status, message, errors = []) {
    super(message)
    this.name = 'ApiError'
    this.status = Number(status) || 500

    // Asegurar que siempre exista al menos un item en errors con formato { campo, mensaje }
    if (Array.isArray(errors) && errors.length > 0) {
      this.errors = errors.map((e) => ({
        campo: e.campo || 'general',
        mensaje: e.mensaje || e.message || String(e),
      }))
    } else {
      this.errors = [{ campo: 'general', mensaje: message }]
    }

    // Construye un mensaje descriptivo con los detalles de cada campo
    const fieldDetails = this.errors
      .filter((e) => e.campo && e.campo !== 'general')
      .map((e) => `${e.campo}: ${e.mensaje}`)
      .join('; ')

    if (fieldDetails && !message.includes(fieldDetails)) {
      this.message = `${message} (${fieldDetails})`
    } else {
      this.message = message
    }
  }

  toJSON() {
    return {
      status: this.status,
      message: this.message,
      errors: this.errors,
    }
  }
}

export const createApiError = (status, message, errors = []) => {
  return new ApiError(status, message, errors)
}

export default createApiError
