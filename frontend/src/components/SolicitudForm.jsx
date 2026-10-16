import { useState } from 'react'
import { Form, Button, Card, Row, Col, Spinner } from 'react-bootstrap'
import { ETIQUETAS_TIPO_SOLICITUD } from '../config/etiquetas'

export const SolicitudForm = ({
  tipoPredefinido = '',
  tiposDisponibles = [],
  onSubmit,
  loading = false,
  extraFields = null,
}) => {
  const [tipo, setTipo] = useState(tipoPredefinido || (tiposDisponibles[0] || ''))
  const [motivo, setMotivo] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const newErrors = {}
    if (!tipo.trim()) {
      newErrors.tipo = 'Debe seleccionar o indicar el tipo de solicitud'
    }
    if (!motivo.trim()) {
      newErrors.motivo = 'El motivo o fundamentación es obligatorio'
    } else if (motivo.trim().length < 10) {
      newErrors.motivo = 'El motivo debe contener al menos 10 caracteres'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    if (onSubmit) {
      onSubmit({
        tipo,
        motivo: motivo.trim(),
        observaciones: observaciones.trim(),
      })
      // Limpiar formulario tras envío exitoso
      setMotivo('')
      setObservaciones('')
    }
  }

  return (
    <Card className="border-0 shadow-sm mb-4" style={{ backgroundColor: 'var(--m-surface)' }}>
      <Card.Header
        className="p-3 border-bottom border-secondary border-opacity-25 d-flex align-items-center gap-2"
        style={{ backgroundColor: 'var(--m-surfaceVariant)' }}
      >
        <i className="bi bi-pencil-square" style={{ color: 'var(--m-primary)' }} />
        <strong style={{ color: 'var(--m-onSurface)' }}>Nueva Solicitud</strong>
      </Card.Header>
      <Card.Body className="p-3 p-md-4">
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={12}>
              <Form.Group controlId="solicitudTipo">
                <Form.Label className="small fw-semibold" style={{ color: 'var(--m-onSurface)' }}>
                  Tipo de Solicitud <span className="text-danger">*</span>
                </Form.Label>
                {tiposDisponibles.length > 0 ? (
                  <Form.Select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    isInvalid={Boolean(errors.tipo)}
                    style={{
                      backgroundColor: 'var(--m-surfaceVariant)',
                      color: 'var(--m-onSurface)',
                      borderColor: 'var(--m-outline)',
                    }}
                  >
                    {tiposDisponibles.map((t, idx) => {
                      const val = typeof t === 'object' ? t.value : t
                      const lbl = typeof t === 'object' ? t.label : (ETIQUETAS_TIPO_SOLICITUD[t] || t)
                      return (
                        <option key={idx} value={val}>
                          {lbl}
                        </option>
                      )
                    })}
                  </Form.Select>
                ) : (
                  <Form.Control
                    type="text"
                    value={ETIQUETAS_TIPO_SOLICITUD[tipo] || tipo}
                    readOnly
                    isInvalid={Boolean(errors.tipo)}
                    style={{
                      backgroundColor: 'var(--m-surfaceVariant)',
                      color: 'var(--m-onSurface)',
                      borderColor: 'var(--m-outline)',
                    }}
                  />
                )}
                <Form.Control.Feedback type="invalid">{errors.tipo}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {extraFields}

            <Col md={12}>
              <Form.Group controlId="solicitudMotivo">
                <Form.Label className="small fw-semibold" style={{ color: 'var(--m-onSurface)' }}>
                  Motivo / Justificación detallada <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Describa el motivo o justificación de su solicitud (mínimo 10 caracteres)..."
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  isInvalid={Boolean(errors.motivo)}
                  style={{
                    backgroundColor: 'var(--m-surfaceVariant)',
                    color: 'var(--m-onSurface)',
                    borderColor: 'var(--m-outline)',
                  }}
                />
                <Form.Control.Feedback type="invalid">{errors.motivo}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group controlId="solicitudObservaciones">
                <Form.Label className="small fw-semibold" style={{ color: 'var(--m-onSurface)' }}>
                  Observaciones adicionales (opcional)
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Detalles complementarios, teléfono alternativo, etc..."
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  style={{
                    backgroundColor: 'var(--m-surfaceVariant)',
                    color: 'var(--m-onSurface)',
                    borderColor: 'var(--m-outline)',
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={12} className="d-flex justify-content-end">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="d-flex align-items-center gap-2 px-4"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" animation="border" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-send-fill" />
                    <span>Enviar Solicitud</span>
                  </>
                )}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default SolicitudForm
