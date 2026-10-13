import { useState, useEffect } from 'react'
import { Button, Form, Row, Col, Badge } from 'react-bootstrap'
import PageHeader from '../../components/PageHeader'
import DataTable from '../../components/DataTable'
import FormModal from '../../components/FormModal'
import { useToast } from '../../context/ToastContext'
import { getEvaluaciones, createEvaluacion } from '../../api/evaluaciones'
import { getMaterias } from '../../api/materias'
import { getCursos } from '../../api/cursos'

export const EvaluacionesDocentePage = () => {
  const { showToast } = useToast()
  const [evaluaciones, setEvaluaciones] = useState([])
  const [materias, setMaterias] = useState([])
  const [cursos, setCursos] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    idMateria: 1,
    idCurso: 1,
    fecha: new Date().toISOString().split('T')[0],
    tipo: 'PARCIAL',
    descripcion: '',
    ponderacion: '30%',
  })
  const [errors, setErrors] = useState({})

  const cargar = async () => {
    try {
      const evs = await getEvaluaciones()
      setEvaluaciones(evs)
    } catch {
      showToast('Error al cargar evaluaciones', 'danger')
    }
  }

  useEffect(() => {
    cargar()
    getMaterias().then(setMaterias).catch(() => {})
    getCursos().then(setCursos).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!form.descripcion.trim()) newErrors.descripcion = 'La descripción o tema es obligatoria'
    if (!form.fecha) newErrors.fecha = 'La fecha de la evaluación es obligatoria'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      await createEvaluacion(form)
      showToast('Evaluación creada con éxito', 'success')
      setShowModal(false)
      setForm({
        idMateria: 1,
        idCurso: 1,
        fecha: new Date().toISOString().split('T')[0],
        tipo: 'PARCIAL',
        descripcion: '',
        ponderacion: '30%',
      })
      cargar()
    } catch (err) {
      showToast(err.message || 'Error al crear la evaluación', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'materiaNombre', label: 'Materia' },
    { key: 'cursoNombre', label: 'Curso' },
    { key: 'fecha', label: 'Fecha Programada' },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (row) => (
        <Badge bg={row.tipo === 'PARCIAL' ? 'primary' : 'info'}>
          {row.tipo === 'PARCIAL' ? 'Examen Parcial' : 'Trabajo Práctico'}
        </Badge>
      ),
    },
    { key: 'descripcion', label: 'Descripción / Temario' },
    { key: 'ponderacion', label: 'Ponderación' },
  ]

  return (
    <div>
      <PageHeader
        title="Gestión de Evaluaciones"
        subtitle="Alta y administración de instancias evaluativas (parciales, trabajos prácticos y recuperatorios)"
        icon="bi-clipboard2-check"
        actions={
          <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-lg me-1" /> Nueva Evaluación
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={evaluaciones}
        keyField="idEvaluacion"
        searchPlaceholder="Buscar por materia, curso o tema..."
        searchKeys={['materiaNombre', 'cursoNombre', 'descripcion', 'tipo']}
      />

      <FormModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        title="Crear Nueva Instancia Evaluativa"
        submitText="Guardar Evaluación"
        loading={loading}
      >
        <Row className="g-3">
          <Col md={6}>
            <Form.Group controlId="evalMateria">
              <Form.Label className="small fw-semibold">Materia</Form.Label>
              <Form.Select
                value={form.idMateria}
                onChange={(e) => setForm({ ...form, idMateria: Number(e.target.value) })}
                style={{
                  backgroundColor: 'var(--m-surfaceVariant)',
                  color: 'var(--m-onSurface)',
                  borderColor: 'var(--m-outline)',
                }}
              >
                {materias.map((m) => (
                  <option key={m.idMateria} value={m.idMateria}>
                    {m.nombre} ({m.codigo})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="evalCurso">
              <Form.Label className="small fw-semibold">Curso / Comisión</Form.Label>
              <Form.Select
                value={form.idCurso}
                onChange={(e) => setForm({ ...form, idCurso: Number(e.target.value) })}
                style={{
                  backgroundColor: 'var(--m-surfaceVariant)',
                  color: 'var(--m-onSurface)',
                  borderColor: 'var(--m-outline)',
                }}
              >
                {cursos.map((c) => (
                  <option key={c.idCurso} value={c.idCurso}>
                    {c.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="evalTipo">
              <Form.Label className="small fw-semibold">Tipo de Evaluación</Form.Label>
              <Form.Select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                style={{
                  backgroundColor: 'var(--m-surfaceVariant)',
                  color: 'var(--m-onSurface)',
                  borderColor: 'var(--m-outline)',
                }}
              >
                <option value="PARCIAL">Examen Parcial</option>
                <option value="TRABAJO_PRACTICO">Trabajo Práctico</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="evalFecha">
              <Form.Label className="small fw-semibold">Fecha Programada</Form.Label>
              <Form.Control
                type="date"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                isInvalid={Boolean(errors.fecha)}
                style={{
                  backgroundColor: 'var(--m-surfaceVariant)',
                  color: 'var(--m-onSurface)',
                  borderColor: 'var(--m-outline)',
                }}
              />
              <Form.Control.Feedback type="invalid">{errors.fecha}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="evalPonderacion">
              <Form.Label className="small fw-semibold">Ponderación en Cursada</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej. 30%"
                value={form.ponderacion}
                onChange={(e) => setForm({ ...form, ponderacion: e.target.value })}
                style={{
                  backgroundColor: 'var(--m-surfaceVariant)',
                  color: 'var(--m-onSurface)',
                  borderColor: 'var(--m-outline)',
                }}
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group controlId="evalDescripcion">
              <Form.Label className="small fw-semibold">Descripción / Contenidos a Evaluar</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Indique los temas teóricos o consigna del trabajo práctico..."
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                isInvalid={Boolean(errors.descripcion)}
                style={{
                  backgroundColor: 'var(--m-surfaceVariant)',
                  color: 'var(--m-onSurface)',
                  borderColor: 'var(--m-outline)',
                }}
              />
              <Form.Control.Feedback type="invalid">{errors.descripcion}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </FormModal>
    </div>
  )
}

export default EvaluacionesDocentePage
