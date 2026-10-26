import { Modal, Button, Form } from 'react-bootstrap'

export const FormModal = ({
  show,
  onHide,
  onSubmit,
  title,
  children,
  submitText = 'Guardar',
  cancelText = 'Cancelar',
  loading = false,
  size = 'lg',
}) => {
  return (
    <Modal show={show} onHide={onHide} size={size} centered backdrop="static" animation={false}>
      <Form onSubmit={onSubmit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold">
            {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          {children}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={onHide} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant="primary"
            type="submit"
            size="sm"
            disabled={loading}
          >
            {loading ? 'Cargando…' : submitText}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default FormModal
