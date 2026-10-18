import { Toast, ToastContainer } from 'react-bootstrap'

export const AppToast = ({
  show,
  onClose,
  message,
  errors = [],
  variant = 'success',
  title = 'Notificación',
}) => {
  return (
    <ToastContainer position="top-end" className="p-3 position-fixed" style={{ zIndex: 9999 }}>
      <Toast
        show={show}
        onClose={onClose}
        delay={4500}
        autohide
        animation={false}
        style={{
          backgroundColor: 'var(--superficie)',
          border: '1px solid var(--borde)',
          borderRadius: '2px',
          minWidth: '300px',
        }}
      >
        <Toast.Header
          closeButton
          style={{
            backgroundColor: 'var(--superficie-alt)',
            borderBottom: '1px solid var(--borde)',
          }}
        >
          <strong className="me-auto" style={{ color: variant === 'danger' ? 'var(--error)' : 'var(--primario)' }}>
            {title}
          </strong>
        </Toast.Header>
        <Toast.Body className="py-2 small">
          <div>{message}</div>
          {errors && errors.length > 0 && (
            <div className="mt-2 pt-2 border-top small" style={{ borderColor: 'var(--borde)' }}>
              {errors.map((e, idx) => (
                <div key={idx} style={{ color: 'var(--error)' }}>
                  {e.campo && e.campo !== 'general' && (
                    <strong>{e.campo}: </strong>
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
