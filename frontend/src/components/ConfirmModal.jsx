import { Modal, Button } from 'react-bootstrap'

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
}) => {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" animation={false}>
      <Modal.Header closeButton>
        <Modal.Title className="fs-6 fw-bold">
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="py-1 small">{message}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" size="sm" onClick={onHide} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          size="sm"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Cargando…' : confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmModal
