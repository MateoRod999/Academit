/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react'
import AppToast from '../components/AppToast'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    show: false,
    message: '',
    errors: [],
    variant: 'success', // 'success' | 'danger' | 'warning' | 'info'
    title: 'Notificación',
  })

  const showToast = useCallback((messageOrError, variant = 'success', title = 'Acción simulada') => {
    let message
    let errors = []
    let resolvedVariant = variant
    let resolvedTitle = title

    if (messageOrError instanceof Error || (typeof messageOrError === 'object' && messageOrError !== null)) {
      message = messageOrError.message || 'Ha ocurrido un error inesperado'
      errors = Array.isArray(messageOrError.errors) ? messageOrError.errors : []
      if (variant === 'success') resolvedVariant = 'danger'
      if (title === 'Acción simulada') {
        resolvedTitle = messageOrError.status ? `Error ${messageOrError.status}` : 'Error'
      }
    } else {
      message = String(messageOrError || '')
    }

    setToast({
      show: true,
      message,
      errors,
      variant: resolvedVariant,
      title: resolvedTitle,
    })
  }, [])

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <AppToast
        show={toast.show}
        onClose={hideToast}
        message={toast.message}
        errors={toast.errors}
        variant={toast.variant}
        title={toast.title}
      />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast debe ser utilizado dentro de un ToastProvider')
  }
  return context
}

export default ToastContext
