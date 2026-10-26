import { useState } from 'react'
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap'
import PageHeader from '../../components/PageHeader'
import { useToast } from '../../context/ToastContext'
import { cambiarPasswordApi } from '../../api/auth'

export const CambiarPasswordPage = () => {
  const { showToast } = useToast()
  const [actual, setActual] = useState('')
  const [nueva, setNueva] = useState('')
  const [repetir, setRepetir] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!actual || !nueva || !repetir) {
      setError('Todos los campos son obligatorios')
      return
    }

    if (nueva.length < 4) {
      setError('La nueva contraseña debe tener al menos 4 caracteres')
      return
    }

    if (nueva !== repetir) {
      setError('La nueva contraseña y su repetición no coinciden')
      return
    }

    setLoading(true)
    try {
      await cambiarPasswordApi(actual, nueva)
      showToast('Tu contraseña se ha modificado exitosamente', 'success')
      setActual('')
      setNueva('')
      setRepetir('')
    } catch (err) {
      setError(err.message || 'Error al cambiar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Modificar Contraseña"
        subtitle="Actualización de clave de acceso al portal institucional"
        icon="bi-key"
      />

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="border-0 " style={{ backgroundColor: 'var(--m-surface)' }}>
            <Card.Header
              className="p-3 border-bottom border-secondary border-opacity-25"
              style={{ backgroundColor: 'var(--m-surfaceVariant)' }}
            >
              <strong style={{ color: 'var(--m-onSurface)' }}>Seguridad de la Cuenta</strong>
            </Card.Header>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="small py-2 mb-3">
                  <i className="bi bi-exclamation-triangle-fill me-1" /> {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="passActual">
                  <Form.Label className="small fw-semibold">Contraseña Actual</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Ingresá tu contraseña actual (1234 para pruebas)"
                    value={actual}
                    onChange={(e) => setActual(e.target.value)}
                    required
                    style={{
                      backgroundColor: 'var(--m-surfaceVariant)',
                      color: 'var(--m-onSurface)',
                      borderColor: 'var(--m-outline)',
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="passNueva">
                  <Form.Label className="small fw-semibold">Nueva Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Mínimo 4 caracteres"
                    value={nueva}
                    onChange={(e) => setNueva(e.target.value)}
                    required
                    style={{
                      backgroundColor: 'var(--m-surfaceVariant)',
                      color: 'var(--m-onSurface)',
                      borderColor: 'var(--m-outline)',
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="passRepetir">
                  <Form.Label className="small fw-semibold">Repetir Nueva Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Reescribí la nueva contraseña"
                    value={repetir}
                    onChange={(e) => setRepetir(e.target.value)}
                    required
                    style={{
                      backgroundColor: 'var(--m-surfaceVariant)',
                      color: 'var(--m-onSurface)',
                      borderColor: 'var(--m-outline)',
                    }}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  <i className="bi bi-shield-lock" />
                  <span>Actualizar Contraseña</span>
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CambiarPasswordPage
