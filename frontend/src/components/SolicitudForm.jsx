import { useState } from 'react'
import { Form, Button, Card, Row, Col } from 'react-bootstrap'
import { ETIQUETAS_TIPO_SOLICITUD } from '../config/etiquetas'

export const SolicitudForm = ({
  onSubmit,
  loading = false,
  tiposDisponibles = [],
  mostrarMateria = false,
  materias = [],
  mostrarCarrera = false,
  carreras = [],
}) => {
  const [tipo, setTipo] = useState(
    tiposDisponibles.length > 0
      ? typeof tiposDisponibles[0] === 'object'
        ? tiposDisponibles[0].value
        : tiposDisponibles[0]
      : 'CONSTANCIA'
  )
  const [idMateria, setIdMateria] = useState('')
  const [idCarreraDestino, setIdCarreraDestino] = useState('')
  const [motivo, setMotivo] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (mostrarMateria && !idMateria) errs.idMateria = 'Debe seleccionar una materia'
    if (mostrarCarrera && !idCarreraDestino) errs.idCarreraDestino = 'Debe seleccionar una carrera destino'
    if (!motivo.trim()) errs.motivo = 'El motivo es obligatorio'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      tipo,
      motivo: motivo.trim(),
      observaciones: observaciones.trim() || undefined,
    }
    if (mostrarMateria && idMateria) payload.idMateria = Number(idMateria)
    if (mostrarCarrera && idCarreraDestino) payload.idCarreraDestino = Number(idCarreraDestino)

    if (onSubmit) {
      onSubmit(payload)
      setMotivo('')
      setObservaciones('')
    }
  }

  return (
    <Card className="mb-4" style={{ backgroundColor: 'var(--superficie)', border: '1px solid var(--borde)' }}>
      <Card.Header className="p-3 border-bottom d-flex align-items-center gap-2">
        <strong style={{ color: 'var(--texto)' }}>Nueva Solicitud</strong>
      </Card.Header>
      <Card.Body className="p-3 p-md-4">
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={12}>
              <Form.Group controlId="solicitudTipo">
                <Form.Label className="small fw-semibold">
                  Tipo de Solicitud <span className="text-danger">*</span>
                </Form.Label>
                {tiposDisponibles.length > 0 ? (
                  <Form.Select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    isInvalid={Boolean(errors.tipo)}
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
                    disabled
                  />
                )}
              </Form.Group>
            </Col>

            {mostrarMateria && (
              <Col md={12}>
                <Form.Group controlId="solicitudMateria">
                  <Form.Label className="small fw-semibold">
                    Materia Vinculada <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={idMateria}
                    onChange={(e) => setIdMateria(e.target.value)}
                    isInvalid={Boolean(errors.idMateria)}
                  >
                    <option value="">-- Seleccionar Materia --</option>
                    {materias.map((m) => (
                      <option key={m.idMateria} value={m.idMateria}>
                        {m.nombre} ({m.codigo})
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.idMateria}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            )}

            {mostrarCarrera && (
              <Col md={12}>
                <Form.Group controlId="solicitudCarrera">
                  <Form.Label className="small fw-semibold">
                    Carrera Destino Solicitada <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={idCarreraDestino}
                    onChange={(e) => setIdCarreraDestino(e.target.value)}
                    isInvalid={Boolean(errors.idCarreraDestino)}
                  >
                    <option value="">-- Seleccionar Carrera Destino --</option>
                    {carreras.map((c) => (
                      <option key={c.idCarrera} value={c.idCarrera}>
                        {c.nombre}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.idCarreraDestino}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            )}

            <Col md={12}>
              <Form.Group controlId="solicitudMotivo">
                <Form.Label className="small fw-semibold">
                  Motivo o Justificación <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Detalle los motivos institucionales de su solicitud..."
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  isInvalid={Boolean(errors.motivo)}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.motivo}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group controlId="solicitudObservaciones">
                <Form.Label className="small fw-semibold">
                  Observaciones Adicionales (Opcional)
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Información complementaria que considere relevante..."
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={12} className="d-flex justify-content-end">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="px-4"
              >
                {loading ? 'Cargando…' : 'Enviar Solicitud'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default SolicitudForm
