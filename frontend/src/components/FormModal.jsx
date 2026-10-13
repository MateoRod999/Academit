import { Modal, Button, Form, Spinner } from 'react-bootstrap'

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
    <Modal show={show} onHide={onHide} size={size} centered backdrop="static">
      <Form onSubmit={onSubmit} noValidate>
        <Modal.Header
          closeButton
          style={{
            backgroundColor: 'var(--m-surface)',
            borderBottom: '1px solid var(--m-outline)',
          }}
        >
          <Modal.Title className="fs-6 fw-bold" style={{ color: 'var(--m-onSurface)' }}>
            {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: 'var(--m-surfaceVariant)',
            color: 'var(--m-onSurfaceVariant)',
            maxHeight: '75vh',
            overflowY: 'auto',
          }}
        >
          {children}
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
            variant="primary"
            type="submit"
            size="sm"
            disabled={loading}
            className="d-flex align-items-center gap-1"
          >
            {loading && <Spinner size="sm" animation="border" className="me-1" />}
            {submitText}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default FormModal
