import { Toast, ToastContainer } from 'react-bootstrap'

export const AppToast = ({ show, onClose, message, variant = 'success', title = 'Acción simulada' }) => {
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return 'bi-check-circle-fill text-success'
      case 'danger':
        return 'bi-x-circle-fill text-danger'
      case 'warning':
        return 'bi-exclamation-triangle-fill text-warning'
      default:
        return 'bi-info-circle-fill text-info'
    }
  }

  return (
    <ToastContainer position="top-end" className="p-3 position-fixed" style={{ zIndex: 9999 }}>
      <Toast
        show={show}
        onClose={onClose}
        delay={4000}
        autohide
        className="shadow-lg border-0"
        style={{
          backgroundColor: 'var(--m-surfaceVariant)',
          color: 'var(--m-onSurfaceVariant)',
          minWidth: '320px',
        }}
      >
        <Toast.Header
          closeButton
          style={{
            backgroundColor: 'var(--m-surface)',
            color: 'var(--m-onSurface)',
            borderBottom: '1px solid var(--m-outline)',
          }}
        >
          <i className={`bi ${getIcon()} me-2 fs-6`} />
          <strong className="me-auto" style={{ color: 'var(--m-primary)' }}>
            {title}
          </strong>
          <small className="text-muted">Ahora</small>
        </Toast.Header>
        <Toast.Body className="py-3 fs-6">
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  )
}

export default AppToast
