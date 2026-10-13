import { useState, useEffect } from 'react'
import { Button, Form, Row, Col, Alert } from 'react-bootstrap'
import PageHeader from '../../components/PageHeader'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import FormModal from '../../components/FormModal'
import ConfirmModal from '../../components/ConfirmModal'
import { useToast } from '../../context/ToastContext'
import { getInscripciones, createInscripcion, cancelarInscripcion } from '../../api/inscripciones'
import { getAlumnos } from '../../api/alumnos'
import { getCursos } from '../../api/cursos'
import { getCiclosLectivos } from '../../api/ciclosLectivos'

export const GestionInscripcionesPage = () => {
  const { showToast } = useToast()
  const [inscripciones, setInscripciones] = useState([])
  const [alumnos, setAlumnos] = useState([])
  const [cursos, setCursos] = useState([])
  const [ciclos, setCiclos] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [inscToDelete, setInscToDelete] = useState(null)

  const [form, setForm] = useState({
    idAlumno: 1,
    idCurso: 1,
    cicloLectivo: 2026,
  })

  const cargar = async () => {
    try {
      const data = await getInscripciones()
      setInscripciones(data)
    } catch {
      showToast('Error al cargar inscripciones', 'danger')
    }
  }

  useEffect(() => {
    cargar()
    getAlumnos().then(setAlumnos).catch(() => {})
    getCursos().then(setCursos).catch(() => {})
    getCiclosLectivos().then(setCiclos).catch(() => {})
  }, [])

  const selectedCursoInfo = cursos.find((c) => c.idCurso === Number(form.idCurso))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selectedCursoInfo && selectedCursoInfo.cuposDisponibles <= 0) {
      showToast('No es posible inscribir: el curso no posee cupos disponibles', 'danger')
      return
    }

    setLoading(true)
    try {
      await createInscripcion(form)
      showToast('Inscripción al curso confirmada con éxito', 'success')
      setShowModal(false)
      cargar()
      // Recargar cursos para actualizar cupos
      getCursos().then(setCursos)
    } catch (err) {
      showToast(err.message || 'Error al inscribir alumno', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmBaja = async () => {
    if (!inscToDelete) return
    setLoading(true)
    try {
      await cancelarInscripcion(inscToDelete.idInscripcion)
      showToast('Inscripción dada de baja y cupo liberado', 'warning')
      setInscToDelete(null)
      cargar()
      getCursos().then(setCursos)
    } catch (err) {
      showToast(err.message || 'Error al cancelar inscripción', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'idInscripcion', label: '# ID', width: '80px' },
    {
      key: 'alumnoNombre',
      label: 'Estudiante',
      render: (row) => <strong style={{ color: 'var(--m-onSurface)' }}>{row.alumnoNombre}</strong>,
    },
    { key: 'cursoNombre', label: 'Curso / Comisión' },
    { key: 'cicloLectivo', label: 'Ciclo Lectivo' },
    { key: 'fechaInscripcion', label: 'Fecha' },
    {
      key: 'estado',
      label: 'Estado',
      render: (row) => <StatusBadge status={row.estado} />,
    },
    {
      key: 'acciones',
      label: 'Acciones',
      align: 'right',
      render: (row) => (
        row.estado !== 'CANCELADA' && (
          <Button variant="outline-danger" size="sm" onClick={() => setInscToDelete(row)}>
            <i className="bi bi-x-circle" /> Cancelar
          </Button>
        )
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Inscripciones a Cursos"
        subtitle="Matriculación de alumnos a comisiones con control y aviso de cupo disponible"
        icon="bi-journal-plus"
        actions={
          <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-lg me-1" /> Nueva Inscripción
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={inscripciones}
        keyField="idInscripcion"
        searchPlaceholder="Buscar por alumno o curso..."
        searchKeys={['alumnoNombre', 'cursoNombre', 'estado']}
      />

      <FormModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        title="Inscribir Alumno a Curso / Comisión"
        submitText="Confirmar Inscripción"
        loading={loading}
      >
        <Row className="g-3">
          <Col md={12}>
            <Form.Group controlId="inscAlumno">
              <Form.Label className="small fw-semibold">Alumno</Form.Label>
              <Form.Select
                value={form.idAlumno}
                onChange={(e) => setForm({ ...form, idAlumno: Number(e.target.value) })}
                style={{ backgroundColor: 'var(--m-surfaceVariant)', color: 'var(--m-onSurface)' }}
              >
                {alumnos.map((a) => (
                  <option key={a.idAlumno} value={a.idAlumno}>
                    {a.apellido}, {a.nombre} (Legajo: {a.legajo} - DNI: {a.dni})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="inscCiclo">
              <Form.Label className="small fw-semibold">Ciclo Lectivo</Form.Label>
              <Form.Select
                value={form.cicloLectivo}
                onChange={(e) => setForm({ ...form, cicloLectivo: Number(e.target.value) })}
                style={{ backgroundColor: 'var(--m-surfaceVariant)', color: 'var(--m-onSurface)' }}
              >
                {ciclos.map((c) => (
                  <option key={c.idCiclo} value={c.anio}>
                    {c.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="inscCurso">
              <Form.Label className="small fw-semibold">Curso / Comisión</Form.Label>
              <Form.Select
                value={form.idCurso}
                onChange={(e) => setForm({ ...form, idCurso: Number(e.target.value) })}
                style={{ backgroundColor: 'var(--m-surfaceVariant)', color: 'var(--m-onSurface)' }}
              >
                {cursos.map((c) => (
                  <option key={c.idCurso} value={c.idCurso}>
                    {c.nombre} ({c.turno}) - {c.cuposDisponibles} cupos libres
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Aviso visual de cupo */}
          <Col md={12}>
            {selectedCursoInfo && (
              <Alert
                variant={selectedCursoInfo.cuposDisponibles > 5 ? 'info' : selectedCursoInfo.cuposDisponibles > 0 ? 'warning' : 'danger'}
                className="mb-0 small d-flex align-items-center gap-2"
              >
                <i className={`bi ${selectedCursoInfo.cuposDisponibles === 0 ? 'bi-x-circle-fill' : 'bi-info-circle-fill'} fs-5`} />
                <div>
                  <strong>Aviso de Cupo ({selectedCursoInfo.nombre}):</strong>{' '}
                  Capacidad máxima: {selectedCursoInfo.capacidadMaxima} | Inscriptos actuales: {selectedCursoInfo.inscriptos} |{' '}
                  <span className="fw-bold">
                    {selectedCursoInfo.cuposDisponibles > 0
                      ? `${selectedCursoInfo.cuposDisponibles} vacante(s) disponible(s)`
                      : '¡CUPO COMPLETO! No quedan vacantes en esta comisión.'}
                  </span>
                </div>
              </Alert>
            )}
          </Col>
        </Row>
      </FormModal>

      <ConfirmModal
        show={Boolean(inscToDelete)}
        onHide={() => setInscToDelete(null)}
        onConfirm={handleConfirmBaja}
        title="Cancelar Inscripción a Curso"
        message={`¿Está seguro de cancelar la inscripción del estudiante ${inscToDelete?.alumnoNombre} en el curso ${inscToDelete?.cursoNombre}? El cupo será liberado de forma inmediata.`}
        confirmText="Confirmar Cancelación"
        variant="danger"
        loading={loading}
      />
    </div>
  )
}

export default GestionInscripcionesPage
