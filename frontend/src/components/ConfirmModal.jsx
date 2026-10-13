import { Modal, Button, Spinner } from 'react-bootstrap'

export const ConfirmModal = ({
  show,
  onHide,
  onConfirm,
  title = '¿Está seguro de continuar?',
  message = 'Esta acción no se puede deshacer.',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  loading = false,
  icon = 'bi-exclamation-triangle',
}) => {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header
        closeButton
        style={{
          backgroundColor: 'var(--m-surface)',
          borderBottom: '1px solid var(--m-outline)',
        }}
      >
        <Modal.Title className="fs-6 fw-bold d-flex align-items-center gap-2" style={{ color: 'var(--m-onSurface)' }}>
          <i className={`bi ${icon} text-${variant}`} />
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: 'var(--m-surfaceVariant)', color: 'var(--m-onSurfaceVariant)' }}>
        <div className="py-2">{message}</div>
      </Modal.Body>
      <Modal.Footer
        style={{
          backgroundColor: 'var(--m-surface)',
          borderTop: '1px solid var(--m-outline)',
        }}
      >
        <Button variant="secondary" size="sm" onClick={onHide} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant={variant}
          size="sm"
          onClick={onConfirm}
          disabled={loading}
          className="d-flex align-items-center gap-1"
        >
          {loading && <Spinner size="sm" animation="border" className="me-1" />}
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmModal
