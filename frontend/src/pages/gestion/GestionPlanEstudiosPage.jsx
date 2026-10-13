import { useState, useEffect } from 'react'
import { Card, Row, Col, Badge, Button, ListGroup } from 'react-bootstrap'
import PageHeader from '../../components/PageHeader'
import FormModal from '../../components/FormModal'
import { useToast } from '../../context/ToastContext'
import { getMaterias, updateMateria } from '../../api/materias'

export const GestionPlanEstudiosPage = () => {
  const { showToast } = useToast()
  const [materias, setMaterias] = useState([])
  const [editingMateria, setEditingMateria] = useState(null)
  const [correlativasTexto, setCorrelativasTexto] = useState('')
  const [loading, setLoading] = useState(false)

  const cargar = async () => {
    try {
      const data = await getMaterias()
      setMaterias(data)
    } catch {
      showToast('Error al cargar plan de estudios', 'danger')
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const handleOpenEditarCorrelativas = (m) => {
    setEditingMateria(m)
    setCorrelativasTexto(m.correlativas.join(', '))
  }

  const handleGuardarCorrelativas = async (e) => {
    e.preventDefault()
    if (!editingMateria) return
    setLoading(true)
    try {
      const correlativas = correlativasTexto
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      await updateMateria(editingMateria.idMateria, { correlativas })
      showToast(`Correlatividades actualizadas para ${editingMateria.nombre}`, 'success')
      setEditingMateria(null)
      cargar()
    } catch (err) {
      showToast(err.message || 'Error al actualizar', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const anios = [1, 2, 3]

  return (
    <div>
      <PageHeader
        title="Gestión del Plan de Estudios"
        subtitle="Administración del árbol de correlatividades, malla curricular y condiciones de cursada"
        icon="bi-diagram-3-fill"
      />

      <Row className="g-4">
        {anios.map((anio) => {
          const mats = materias.filter((m) => m.anio === anio)
          return (
            <Col key={anio} lg={4}>
              <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: 'var(--m-surface)' }}>
                <Card.Header
                  className="p-3 border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center"
                  style={{ backgroundColor: 'var(--m-surfaceVariant)' }}
                >
                  <strong className="fs-6" style={{ color: 'var(--m-primary)' }}>
                    Malla {anio}° Año
                  </strong>
                  <Badge bg="secondary">{mats.length} asignaturas</Badge>
                </Card.Header>
                <Card.Body className="p-2">
                  <ListGroup variant="flush">
                    {mats.map((m) => (
                      <ListGroup.Item
                        key={m.idMateria}
                        className="p-3 border-bottom border-secondary border-opacity-25"
                        style={{ backgroundColor: 'transparent' }}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <div>
                            <strong style={{ color: 'var(--m-onSurface)' }}>{m.nombre}</strong>
                            <div className="text-muted small">
                              {m.codigo} • {m.horasSemanales} hs/sem
                            </div>
                          </div>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleOpenEditarCorrelativas(m)}
                            title="Editar correlativas"
                          >
                            <i className="bi bi-gear" />
                          </Button>
                        </div>

                        <div className="mt-2 pt-2 border-top border-secondary border-opacity-10 small">
                          <span className="text-muted">Correlativas: </span>
                          {m.correlativas.length > 0 ? (
                            m.correlativas.map((c, idx) => (
                              <Badge key={idx} bg="dark" className="me-1 border border-secondary">
                                {c}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted fst-italic">Sin requisitos previos</span>
                          )}
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>

      <FormModal
        show={Boolean(editingMateria)}
        onHide={() => setEditingMateria(null)}
        onSubmit={handleGuardarCorrelativas}
        title={`Correlatividades para: ${editingMateria?.nombre}`}
        submitText="Guardar Correlatividades"
        loading={loading}
      >
        <p className="small mb-3">
          Ingrese los nombres exactos de las materias correlativas requeridas para cursar esta asignatura, separadas por coma.
        </p>
        <textarea
          rows={3}
          className="form-control"
          placeholder="Ej. Programación I, Bases de Datos I"
          value={correlativasTexto}
          onChange={(e) => setCorrelativasTexto(e.target.value)}
          style={{
            backgroundColor: 'var(--m-surfaceVariant)',
            color: 'var(--m-onSurface)',
            borderColor: 'var(--m-outline)',
          }}
        />
      </FormModal>
    </div>
  )
}

export default GestionPlanEstudiosPage
