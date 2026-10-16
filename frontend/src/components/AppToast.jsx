import { Toast, ToastContainer } from 'react-bootstrap'

export const AppToast = ({
  show,
  onClose,
  message,
  errors = [],
  variant = 'success',
  title = 'Acción simulada',
}) => {
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
        delay={4500}
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
          <div>{message}</div>
          {errors && errors.length > 0 && (
            <div className="mt-2 pt-2 border-top border-secondary border-opacity-25 small">
              {errors.map((e, idx) => (
                <div key={idx} className="d-flex align-items-baseline gap-1 text-danger">
                  <i className="bi bi-arrow-right-short" />
                  {e.campo && e.campo !== 'general' && (
                    <strong className="text-capitalize">{e.campo}: </strong>
                  )}
                  <span>{e.mensaje}</span>
                </div>
              ))}
            </div>
          )}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  )
}

export default AppToast
