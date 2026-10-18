import { useState, useEffect } from 'react'
import { Card, Table, Form, Button, Row, Col, ButtonGroup } from 'react-bootstrap'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import { useToast } from '../../context/ToastContext'
import { getAlumnos } from '../../api/alumnos'
import { getCursos } from '../../api/cursos'
import { getMaterias } from '../../api/materias'
import { getAsistencias, registrarAsistencias } from '../../api/asistencias'

export const AsistenciasDocentePage = () => {
  const { showToast } = useToast()
  const [alumnos, setAlumnos] = useState([])
  const [cursos, setCursos] = useState([])
  const [materias, setMaterias] = useState([])
  const [selectedCurso, setSelectedCurso] = useState(1)
  const [selectedMateria, setSelectedMateria] = useState(1)
  const [selectedFecha, setSelectedFecha] = useState(new Date().toISOString().split('T')[0])

  const [estados, setEstados] = useState({}) // { [idAlumno]: 'PRESENTE' | 'AUSENTE' | 'TARDANZA' | 'JUSTIFICADO' }
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getCursos().then(setCursos).catch(() => {})
    getMaterias().then(setMaterias).catch(() => {})
    getAlumnos().then(setAlumnos).catch(() => {})
  }, [])

  useEffect(() => {
    // Cargar asistencias existentes para esa fecha y curso
    getAsistencias({ idCurso: selectedCurso, fecha: selectedFecha }).then((asists) => {
      const mapa = {}
      asists.forEach((a) => {
        mapa[a.idAlumno] = a.estado
      })
      setEstados(mapa)
    })
  }, [selectedCurso, selectedFecha])

  const handleSetEstado = (idAlumno, estado) => {
    setEstados((prev) => ({
      ...prev,
      [idAlumno]: estado,
    }))
  }

  const handleMarcarTodos = (estado) => {
    const mapa = { ...estados }
    alumnosDelCurso.forEach((a) => {
      mapa[a.idAlumno] = estado
    })
    setEstados(mapa)
  }

  const handleGuardar = async () => {
    setSaving(true)
    try {
      const lista = alumnosDelCurso.map((a) => ({
        idAlumno: a.idAlumno,
        alumnoNombre: `${a.nombre} ${a.apellido}`,
        idCurso: selectedCurso,
        idMateria: selectedMateria,
        fecha: selectedFecha,
        estado: estados[a.idAlumno] || 'PRESENTE',
      }))

      await registrarAsistencias(lista)
      showToast(`Asistencia de ${lista.length} estudiantes guardada exitosamente`, 'success')
    } catch (err) {
      showToast(err.message || 'Error al guardar asistencias', 'danger')
    } finally {
      setSaving(false)
    }
  }

  const alumnosDelCurso = alumnos.filter((a) => a.idCurso === Number(selectedCurso))

  return (
    <div>
      <PageHeader
        title="Tomar Asistencia"
        subtitle="Control diario de presentismo por curso y fecha (PRESENTE, AUSENTE, TARDANZA, JUSTIFICADO)"
        icon="bi-calendar-check"
        actions={
          <Button
            variant="primary"
            size="sm"
            disabled={saving || alumnosDelCurso.length === 0}
            onClick={handleGuardar}
          >
            {saving ? 'Guardando…' : 'Guardar Presentismo'}
          </Button>
        }
      />

      {/* Selectores de curso, materia y fecha */}
      <Card className="border-0 shadow-sm mb-4" style={{ backgroundColor: 'var(--m-surface)' }}>
        <Card.Body className="p-3">
          <Row className="g-3 align-items-end">
            <Col sm={6} md={4}>
              <Form.Group controlId="asistCurso">
                <Form.Label className="small fw-semibold">Curso / Comisión</Form.Label>
                <Form.Select
                  size="sm"
                  value={selectedCurso}
                  onChange={(e) => setSelectedCurso(Number(e.target.value))}
                  style={{ backgroundColor: 'var(--m-surfaceVariant)', color: 'var(--m-onSurface)' }}
                >
                  {cursos.map((c) => (
                    <option key={c.idCurso} value={c.idCurso}>
                      {c.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col sm={6} md={4}>
              <Form.Group controlId="asistMateria">
                <Form.Label className="small fw-semibold">Materia</Form.Label>
                <Form.Select
                  size="sm"
                  value={selectedMateria}
                  onChange={(e) => setSelectedMateria(Number(e.target.value))}
                  style={{ backgroundColor: 'var(--m-surfaceVariant)', color: 'var(--m-onSurface)' }}
                >
                  {materias.map((m) => (
                    <option key={m.idMateria} value={m.idMateria}>
                      {m.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col sm={6} md={4}>
              <Form.Group controlId="asistFecha">
                <Form.Label className="small fw-semibold">Fecha de Clase</Form.Label>
                <Form.Control
                  type="date"
                  size="sm"
                  value={selectedFecha}
                  onChange={(e) => setSelectedFecha(e.target.value)}
                  style={{ backgroundColor: 'var(--m-surfaceVariant)', color: 'var(--m-onSurface)' }}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-3 pt-3 border-top border-secondary border-opacity-25 d-flex flex-wrap align-items-center gap-2">
            <span className="small text-muted me-2">Acciones rápidas para todos:</span>
            <Button variant="outline-success" size="sm" onClick={() => handleMarcarTodos('PRESENTE')}>
              <i className="bi bi-check-all me-1" /> Todos Presentes
            </Button>
            <Button variant="outline-danger" size="sm" onClick={() => handleMarcarTodos('AUSENTE')}>
              <i className="bi bi-x me-1" /> Todos Ausentes
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Lista de estudiantes y botones de estado */}
      <Card className="border-0 shadow-sm" style={{ backgroundColor: 'var(--m-surface)' }}>
        <div className="table-responsive">
          <Table hover align="middle" className="mb-0">
            <thead style={{ backgroundColor: 'var(--m-surfaceVariant)' }}>
              <tr>
                <th style={{ color: 'var(--m-primary)' }}>Legajo</th>
                <th style={{ color: 'var(--m-primary)' }}>Estudiante</th>
                <th style={{ color: 'var(--m-primary)' }}>DNI</th>
                <th style={{ color: 'var(--m-primary)' }}>Estado Seleccionado</th>
                <th style={{ color: 'var(--m-primary)', textAlign: 'right' }}>Registrar Condición</th>
              </tr>
            </thead>
            <tbody>
              {alumnosDelCurso.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted">
                    No hay estudiantes registrados en este curso.
                  </td>
                </tr>
              ) : (
                alumnosDelCurso.map((alu) => {
                  const est = estados[alu.idAlumno] || 'PRESENTE'
                  return (
                    <tr key={alu.idAlumno} style={{ borderBottom: '1px solid var(--m-outline)' }}>
                      <td className="font-monospace small">{alu.legajo}</td>
                      <td>
                        <strong style={{ color: 'var(--m-onSurface)' }}>
                          {alu.apellido}, {alu.nombre}
                        </strong>
                      </td>
                      <td className="small text-muted">{alu.dni}</td>
                      <td>
                        <StatusBadge status={est} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <ButtonGroup size="sm">
                          <Button
                            variant={est === 'PRESENTE' ? 'success' : 'outline-secondary'}
                            onClick={() => handleSetEstado(alu.idAlumno, 'PRESENTE')}
                          >
                            P
                          </Button>
                          <Button
                            variant={est === 'TARDANZA' ? 'warning' : 'outline-secondary'}
                            onClick={() => handleSetEstado(alu.idAlumno, 'TARDANZA')}
                          >
                            T
                          </Button>
                          <Button
                            variant={est === 'JUSTIFICADO' ? 'info' : 'outline-secondary'}
                            onClick={() => handleSetEstado(alu.idAlumno, 'JUSTIFICADO')}
                          >
                            J
                          </Button>
                          <Button
                            variant={est === 'AUSENTE' ? 'danger' : 'outline-secondary'}
                            onClick={() => handleSetEstado(alu.idAlumno, 'AUSENTE')}
                          >
                            A
                          </Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  )
}

export default AsistenciasDocentePage
