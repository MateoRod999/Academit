import { useState, useEffect } from 'react'
import { Card, Row, Col, Badge, ListGroup } from 'react-bootstrap'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import { getMaterias } from '../../api/materias'

export const PlanEstudiosAlumnoPage = () => {
  const [materias, setMaterias] = useState([])

  useEffect(() => {
    getMaterias().then(setMaterias).catch(() => {})
  }, [])

  // Agrupar materias por año
  const anios = [1, 2, 3]

  // Estado mockeado de las materias para Lucía Benítez (1° Año)
  const getEstadoMateria = (materia) => {
    if (materia.idMateria === 1) return { estado: 'APROBADA', nota: 8 }
    if (materia.idMateria === 2) return { estado: 'APROBADA', nota: 9 }
    if (materia.idMateria === 3 || materia.idMateria === 4) return { estado: 'REGULAR', nota: null }
    return { estado: 'PENDIENTE', nota: null }
  }

  return (
    <div>
      <PageHeader
        title="Plan de Estudios y Correlatividades"
        subtitle="Tecnicatura Superior en Desarrollo de Software | Materias por año y régimen de correlatividades (RF48)"
        icon="bi-diagram-3"
      />

      <Row className="g-4">
        {anios.map((anio) => {
          const materiasAnio = materias.filter((m) => m.anio === anio)
          return (
            <Col key={anio} lg={4}>
              <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: 'var(--m-surface)' }}>
                <Card.Header
                  className="p-3 border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center"
                  style={{ backgroundColor: 'var(--m-surfaceVariant)' }}
                >
                  <strong className="fs-6" style={{ color: 'var(--m-primary)' }}>
                    {anio}° Año
                  </strong>
                  <Badge bg="secondary">{materiasAnio.length} materias</Badge>
                </Card.Header>
                <Card.Body className="p-2">
                  <ListGroup variant="flush">
                    {materiasAnio.map((m) => {
                      const est = getEstadoMateria(m)
                      return (
                        <ListGroup.Item
                          key={m.idMateria}
                          className="p-3 border-bottom border-secondary border-opacity-25"
                          style={{ backgroundColor: 'transparent' }}
                        >
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <div>
                              <strong style={{ color: 'var(--m-onSurface)' }}>{m.nombre}</strong>
                              <div className="text-muted small">
                                {m.codigo} • {m.regimen} • {m.horasSemanales} hs/sem
                              </div>
                            </div>
                            <StatusBadge status={est.estado} />
                          </div>

                          {/* Correlativas */}
                          <div className="mt-2 pt-2 border-top border-secondary border-opacity-10 small">
                            <span className="text-muted">Correlativas requeridas: </span>
                            {m.correlativas.length > 0 ? (
                              m.correlativas.map((c, idx) => (
                                <Badge key={idx} bg="dark" className="me-1 border border-secondary">
                                  {c}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-success fst-italic">Ninguna (Inicial)</span>
                            )}
                          </div>

                          {est.nota && (
                            <div className="small mt-1 text-success">
                              <i className="bi bi-check2-circle me-1" />
                              Nota final: <strong>{est.nota}</strong>
                            </div>
                          )}
                        </ListGroup.Item>
                      )
                    })}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

export default PlanEstudiosAlumnoPage
