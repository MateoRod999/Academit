import { useState, useEffect } from 'react'
import { Card, Table, Form, Button, Row, Col, Badge, Spinner } from 'react-bootstrap'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import { useToast } from '../../context/ToastContext'
import { getAlumnos } from '../../api/alumnos'
import { getMaterias } from '../../api/materias'
import { getCursos } from '../../api/cursos'
import { getEvaluaciones } from '../../api/evaluaciones'
import { getCalificaciones, guardarCalificaciones } from '../../api/calificaciones'

export const CalificacionesDocentePage = () => {
  const { showToast } = useToast()
  const [alumnos, setAlumnos] = useState([])
  const [materias, setMaterias] = useState([])
  const [cursos, setCursos] = useState([])
  const [evaluaciones, setEvaluaciones] = useState([])
  const [selectedMateria, setSelectedMateria] = useState(1)
  const [selectedCurso, setSelectedCurso] = useState(1)
  const [selectedEvaluacion, setSelectedEvaluacion] = useState(1)
  const [evaluacionNombre, setEvaluacionNombre] = useState('Primer Parcial')
  const [tipo, setTipo] = useState('PARCIAL')

  const [notas, setNotas] = useState({}) // { [idAlumno]: { nota, observacion } }
  const [erroresPorAlumno, setErroresPorAlumno] = useState({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getMaterias().then(setMaterias).catch(() => {})
    getCursos().then(setCursos).catch(() => {})
    getAlumnos().then(setAlumnos).catch(() => {})
    getEvaluaciones().then(setEvaluaciones).catch(() => {})
  }, [])

  // Al cambiar materia o curso, sincronizar evaluación activa
  useEffect(() => {
    const disponibles = evaluaciones.filter(
      (e) => e.idMateria === Number(selectedMateria) && e.idCurso === Number(selectedCurso)
    )
    if (disponibles.length > 0) {
      setSelectedEvaluacion(disponibles[0].idEvaluacion)
      setEvaluacionNombre(disponibles[0].descripcion)
      setTipo(disponibles[0].tipo)
    }
  }, [selectedMateria, selectedCurso, evaluaciones])

  useEffect(() => {
    // Cargar notas preexistentes para la materia e instancia elegida
    setLoading(true)
    getCalificaciones({ idMateria: selectedMateria, tipo, idEvaluacion: selectedEvaluacion })
      .then((cals) => {
        const mapa = {}
        cals.forEach((c) => {
          if (c.evaluacionNombre === evaluacionNombre || c.idEvaluacion === Number(selectedEvaluacion)) {
            mapa[c.idAlumno] = {
              nota: c.nota,
              observacion: c.observacion || '',
            }
          }
        })
        setNotas(mapa)
      })
      .finally(() => setLoading(false))
  }, [selectedMateria, selectedCurso, selectedEvaluacion, evaluacionNombre, tipo])

  const handleNotaChange = (idAlumno, valor) => {
    const num = valor === '' ? '' : valor
    setNotas((prev) => ({
      ...prev,
      [idAlumno]: {
        ...prev[idAlumno],
        nota: num,
      },
    }))
    if (erroresPorAlumno[idAlumno]) {
      setErroresPorAlumno((prev) => {
        const copia = { ...prev }
        delete copia[idAlumno]
        return copia
      })
    }
  }

  const handleObsChange = (idAlumno, valor) => {
    setNotas((prev) => ({
      ...prev,
      [idAlumno]: {
        ...prev[idAlumno],
        observacion: valor,
      },
    }))
  }

  const handleGuardarTodas = async () => {
    setSaving(true)
    setErroresPorAlumno({})
    try {
      const lista = Object.entries(notas)
        .filter(([, item]) => item.nota !== '' && item.nota !== undefined && item.nota !== null)
        .map(([idAlu, item]) => ({
          idAlumno: Number(idAlu),
          nota: item.nota === '' ? '' : Number(item.nota),
          observacion: item.observacion || '',
        }))

      if (lista.length === 0) {
        showToast('No hay calificaciones ingresadas para guardar', 'warning')
        setSaving(false)
        return
      }

      await guardarCalificaciones(selectedEvaluacion, lista)
      showToast('Calificaciones guardadas y consolidadas exitosamente', 'success')
      setErroresPorAlumno({})
    } catch (err) {
      if (err.errores) {
        setErroresPorAlumno(err.errores)
      }
      showToast(err.message || 'Error al guardar calificaciones', 'danger')
    } finally {
      setSaving(false)
    }
  }

  // Filtrar alumnos asignados al curso seleccionado
  const alumnosDelCurso = alumnos.filter((a) => a.idCurso === Number(selectedCurso))


  return (
    <div>
      <PageHeader
        title="Carga de Calificaciones"
        subtitle="Grilla de alumnos con validación de notas (escala numérica oficial de 1 a 10)"
        icon="bi-award-fill"
        actions={
          <Button
            variant="primary"
            size="sm"
            disabled={saving || loading}
            onClick={handleGuardarTodas}
            className="d-flex align-items-center gap-1"
          >
            {saving ? <Spinner size="sm" animation="border" /> : <i className="bi bi-save" />}
            <span>Guardar Calificaciones</span>
          </Button>
        }
      />

      {/* Selectores de contexto */}
      <Card className="border-0 shadow-sm mb-4" style={{ backgroundColor: 'var(--m-surface)' }}>
        <Card.Body className="p-3">
          <Row className="g-3">
            <Col sm={6} md={3}>
              <Form.Group controlId="selMateria">
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

            <Col sm={6} md={3}>
              <Form.Group controlId="selCurso">
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

            <Col sm={6} md={3}>
              <Form.Group controlId="selEvaluacion">
                <Form.Label className="small fw-semibold">Evaluación Planificada</Form.Label>
                <Form.Select
                  size="sm"
                  value={selectedEvaluacion}
                  onChange={(e) => {
                    const id = Number(e.target.value)
                    setSelectedEvaluacion(id)
                    const ev = evaluaciones.find((item) => item.idEvaluacion === id)
                    if (ev) {
                      setEvaluacionNombre(ev.descripcion)
                      setTipo(ev.tipo)
                    }
                  }}
                  style={{ backgroundColor: 'var(--m-surfaceVariant)', color: 'var(--m-onSurface)' }}
                >
                  {evaluaciones.map((ev) => (
                    <option key={ev.idEvaluacion} value={ev.idEvaluacion}>
                      #{ev.idEvaluacion} - {ev.tipo}: {ev.descripcion}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col sm={6} md={3}>
              <Form.Group controlId="selInstancia">
                <Form.Label className="small fw-semibold">Instancia / Detalle</Form.Label>
                <Form.Control
                  size="sm"
                  value={evaluacionNombre}
                  onChange={(e) => setEvaluacionNombre(e.target.value)}
                  placeholder="Ej. Primer Parcial"
                  style={{ backgroundColor: 'var(--m-surfaceVariant)', color: 'var(--m-onSurface)' }}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Grilla de carga de notas */}
      <Card className="border-0 shadow-sm" style={{ backgroundColor: 'var(--m-surface)' }}>
        <div className="table-responsive">
          <Table hover align="middle" className="mb-0">
            <thead style={{ backgroundColor: 'var(--m-surfaceVariant)' }}>
              <tr>
                <th style={{ color: 'var(--m-primary)' }}>Legajo</th>
                <th style={{ color: 'var(--m-primary)' }}>Estudiante</th>
                <th style={{ color: 'var(--m-primary)' }}>DNI</th>
                <th style={{ color: 'var(--m-primary)', width: '150px' }}>Nota (1-10)</th>
                <th style={{ color: 'var(--m-primary)', width: '140px' }}>Condición</th>
                <th style={{ color: 'var(--m-primary)' }}>Devolución u Observación</th>
              </tr>
            </thead>
            <tbody>
              {alumnosDelCurso.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    No hay estudiantes registrados en este curso.
                  </td>
                </tr>
              ) : (
                alumnosDelCurso.map((alu) => {
                  const valorNota = notas[alu.idAlumno]?.nota ?? ''
                  const valorObs = notas[alu.idAlumno]?.observacion ?? ''
                  const tieneError = Boolean(erroresPorAlumno[alu.idAlumno])
                  const condicion = valorNota === '' ? null : Number(valorNota) >= 4 ? 'APROBADO' : 'DESAPROBADO'

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
                        <Form.Control
                          type="number"
                          min="1"
                          max="10"
                          step="1"
                          size="sm"
                          value={valorNota}
                          isInvalid={tieneError}
                          onChange={(e) => handleNotaChange(alu.idAlumno, e.target.value)}
                          className="fw-bold text-center"
                          style={{
                            backgroundColor: 'var(--m-surfaceVariant)',
                            color: 'var(--m-onSurface)',
                            maxWidth: '90px',
                          }}
                        />
                        {tieneError && (
                          <div className="text-danger small mt-1" style={{ fontSize: '0.75rem', maxWidth: '180px' }}>
                            <i className="bi bi-exclamation-circle me-1" />
                            {erroresPorAlumno[alu.idAlumno]}
                          </div>
                        )}
                      </td>
                      <td>
                        {condicion ? (
                          <StatusBadge status={condicion} />
                        ) : (
                          <Badge bg="secondary">Sin calificar</Badge>
                        )}
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          size="sm"
                          placeholder="Observación opcional..."
                          value={valorObs}
                          onChange={(e) => handleObsChange(alu.idAlumno, e.target.value)}
                          style={{
                            backgroundColor: 'var(--m-surfaceVariant)',
                            color: 'var(--m-onSurface)',
                          }}
                        />
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

export default CalificacionesDocentePage
