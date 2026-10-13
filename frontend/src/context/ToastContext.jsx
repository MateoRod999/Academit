/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react'
import AppToast from '../components/AppToast'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    show: false,
    message: '',
    variant: 'success', // 'success' | 'danger' | 'warning' | 'info'
    title: 'Notificación',
  })

  const showToast = useCallback((message, variant = 'success', title = 'Acción simulada') => {
    setToast({
      show: true,
      message,
      variant,
      title,
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
