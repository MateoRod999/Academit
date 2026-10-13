import { useState, useEffect } from 'react'
import { Row, Col, Card, Button, ProgressBar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import { getCuotas } from '../../api/cuotas'
import { getMesasExamen } from '../../api/mesasExamen'
import { getCalificaciones } from '../../api/calificaciones'
import { getSolicitudes } from '../../api/solicitudes'
import { getAlumnos } from '../../api/alumnos'

export const InicioPage = () => {
  const { rol, nombre, usuario } = useAuth()
  const [alumnoCuotas, setAlumnoCuotas] = useState([])
  const [alumnoMesas, setAlumnoMesas] = useState([])
  const [alumnoCalificaciones, setAlumnoCalificaciones] = useState([])
  const [solicitudesCount, setSolicitudesCount] = useState(0)
  const [alumnosCount, setAlumnosCount] = useState(0)

  useEffect(() => {
    // Carga de datos contextuales según rol
    getCuotas(1).then((data) => setAlumnoCuotas(data)).catch(() => {})
    getMesasExamen().then((data) => setAlumnoMesas(data.filter((m) => m.alumnosInscriptosIds.includes(1)))).catch(() => {})
    getCalificaciones({ idAlumno: 1 }).then((data) => setAlumnoCalificaciones(data)).catch(() => {})
    getSolicitudes().then((data) => setSolicitudesCount(data.filter((s) => s.estado === 'PENDIENTE').length)).catch(() => {})
    getAlumnos().then((data) => setAlumnosCount(data.length)).catch(() => {})
  }, [rol])

  // Cálculos para alumno
  const proximaCuota = alumnoCuotas.find((c) => c.estado === 'PENDIENTE' || c.estado === 'VENCIDA')
  const proximaMesa = alumnoMesas[0]
  const promedioNotas = alumnoCalificaciones.length > 0
    ? (alumnoCalificaciones.reduce((acc, c) => acc + c.nota, 0) / alumnoCalificaciones.length).toFixed(1)
    : '8.5'

  return (
    <div>
      <PageHeader
        title={`Bienvenido/a, ${nombre || usuario}`}
        subtitle={`Panel institucional de autogestión | Perfil activo: ${rol}`}
        icon="bi-speedometer2"
      />

      {/* 1. SECCIÓN ESPECÍFICA PARA ALUMNO */}
      {rol === 'ALUMNO' && (
        <>
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--m-primary)' }}>
            <i className="bi bi-mortarboard" /> Resumen Académico y Arancelario
          </h5>

          <Row className="g-3 mb-4">
            <Col md={6} xl={3}>
              <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: 'var(--m-surface)' }}>
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="text-muted small text-uppercase fw-semibold">Próximo Vencimiento</span>
                    <span className="p-2 rounded-2" style={{ backgroundColor: 'var(--m-surfaceVariant)', color: 'var(--m-primary)' }}>
                      <i className="bi bi-calendar-event fs-5" />
                    </span>
                  </div>
                  <h4 className="fw-bold mb-1" style={{ color: 'var(--m-onSurface)' }}>
                    {proximaCuota ? `$${proximaCuota.monto.toLocaleString('es-AR')}` : 'Al día'}
                  </h4>
                  <div className="small mb-2">
                    {proximaCuota ? (
                      <span className="text-warning">
                        {proximaCuota.concepto} ({proximaCuota.fechaVencimiento})
                      </span>
                    ) : (
                      <span className="text-success">No tenés cuotas pendientes</span>
                    )}
                  </div>
                  <Button as={Link} to="/academico/situacion" variant="outline-primary" size="sm" className="w-100 mt-2">
                    Ver Estado de Deuda
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} xl={3}>
              <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: 'var(--m-surface)' }}>
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="text-muted small text-uppercase fw-semibold">Próxima Mesa Final</span>
                    <span className="p-2 rounded-2" style={{ backgroundColor: 'var(--m-surfaceVariant)', color: 'var(--m-primary)' }}>
                      <i className="bi bi-journal-check fs-5" />
                    </span>
                  </div>
                  <h5 className="fw-bold mb-1 text-truncate" style={{ color: 'var(--m-onSurface)' }}>
                    {proximaMesa ? proximaMesa.materiaNombre : 'Sin inscripción'}
                  </h5>
                  <div className="small mb-2 text-muted">
                    {proximaMesa ? `${proximaMesa.fecha} - ${proximaMesa.hora}` : 'Inscripciones abiertas'}
                  </div>
                  <Button as={Link} to="/academico/mesas-examen" variant="outline-primary" size="sm" className="w-100 mt-2">
                    Gestionar Mesas
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} xl={3}>
              <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: 'var(--m-surface)' }}>
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="text-muted small text-uppercase fw-semibold">Promedio General</span>
                    <span className="p-2 rounded-2" style={{ backgroundColor: 'var(--m-surfaceVariant)', color: 'var(--m-primary)' }}>
                      <i className="bi bi-star-fill text-warning fs-5" />
                    </span>
                  </div>
                  <h4 className="fw-bold mb-1" style={{ color: 'var(--m-onSurface)' }}>
                    {promedioNotas} <small className="fs-6 text-muted">/ 10</small>
                  </h4>
                  <div className="small text-muted mb-2">
                    {alumnoCalificaciones.length} evaluaciones calificadas
                  </div>
                  <Button as={Link} to="/academico/parciales" variant="outline-primary" size="sm" className="w-100 mt-2">
                    Ver Calificaciones
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} xl={3}>
              <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: 'var(--m-surface)' }}>
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="text-muted small text-uppercase fw-semibold">Estado de Matrícula</span>
                    <span className="p-2 rounded-2" style={{ backgroundColor: 'var(--m-surfaceVariant)', color: 'var(--m-primary)' }}>
                      <i className="bi bi-card-checklist fs-5" />
                    </span>
                  </div>
                  <div className="mb-2">
                    <StatusBadge status="ACTIVA" />
                  </div>
                  <div className="small text-muted mb-2">
                    Ciclo Lectivo 2026 - Turno Mañana
                  </div>
                  <Button as={Link} to="/otros/mis-datos" variant="outline-secondary" size="sm" className="w-100 mt-2">
                    Mis Datos Personales
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <h5 className="fw-bold mb-3" style={{ color: 'var(--m-primary)' }}>
            Accesos Rápidos Frecuentes
          </h5>
          <Row className="g-3">
            <Col sm={6} md={4} lg={3}>
              <Link to="/academico/situacion" className="text-decoration-none">
                <Card className="h-100 border-0 shadow-sm text-center p-3 hover-card" style={{ backgroundColor: 'var(--m-surface)' }}>
                  <i className="bi bi-cash-stack fs-1 mb-2" style={{ color: 'var(--m-primary)' }} />
                  <span className="fw-semibold" style={{ color: 'var(--m-onSurface)' }}>Situación Arancelaria</span>
                  <small className="text-muted">Cuotas y pagos</small>
                </Card>
              </Link>
            </Col>
            <Col sm={6} md={4} lg={3}>
              <Link to="/solicitudes/constancias" className="text-decoration-none">
                <Card className="h-100 border-0 shadow-sm text-center p-3 hover-card" style={{ backgroundColor: 'var(--m-surface)' }}>
                  <i className="bi bi-file-earmark-text fs-1 mb-2" style={{ color: 'var(--m-primary)' }} />
                  <span className="fw-semibold" style={{ color: 'var(--m-onSurface)' }}>Constancias</span>
                  <small className="text-muted">Alumno regular y examen</small>
                </Card>
              </Link>
            </Col>
            <Col sm={6} md={4} lg={3}>
              <Link to="/academico/plan-estudios" className="text-decoration-none">
                <Card className="h-100 border-0 shadow-sm text-center p-3 hover-card" style={{ backgroundColor: 'var(--m-surface)' }}>
                  <i className="bi bi-diagram-3 fs-1 mb-2" style={{ color: 'var(--m-primary)' }} />
                  <span className="fw-semibold" style={{ color: 'var(--m-onSurface)' }}>Plan de Estudios</span>
                  <small className="text-muted">Materias y correlatividades</small>
                </Card>
              </Link>
            </Col>
            <Col sm={6} md={4} lg={3}>
              <Link to="/academico/asistencias" className="text-decoration-none">
                <Card className="h-100 border-0 shadow-sm text-center p-3 hover-card" style={{ backgroundColor: 'var(--m-surface)' }}>
                  <i className="bi bi-clock-history fs-1 mb-2" style={{ color: 'var(--m-primary)' }} />
                  <span className="fw-semibold" style={{ color: 'var(--m-onSurface)' }}>Mis Asistencias</span>
                  <small className="text-muted">Porcentaje y detalle</small>
                </Card>
              </Link>
            </Col>
          </Row>
        </>
      )}

      {/* 2. SECCIÓN PARA DOCENTE */}
      {rol === 'DOCENTE' && (
        <>
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--m-primary)' }}>
            <i className="bi bi-person-video3" /> Gestión de Cursos a Cargo
          </h5>

          <Row className="g-3 mb-4">
            <Col md={4}>
              <Card className="border-0 shadow-sm" style={{ backgroundColor: 'var(--m-surface)' }}>
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">Cursos Asignados</small>
                      <h3 className="fw-bold mb-0 mt-1" style={{ color: 'var(--m-onSurface)' }}>2</h3>
                    </div>
                    <i className="bi bi-collection fs-1" style={{ color: 'var(--m-primary)' }} />
                  </div>
                  <Button as={Link} to="/docencia/mis-cursos" variant="outline-primary" size="sm" className="w-100 mt-3">
                    Ver Mis Cursos
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm" style={{ backgroundColor: 'var(--m-surface)' }}>
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">Evaluaciones Creadas</small>
                      <h3 className="fw-bold mb-0 mt-1" style={{ color: 'var(--m-onSurface)' }}>4</h3>
                    </div>
                    <i className="bi bi-clipboard2-check fs-1 text-info" />
                  </div>
                  <Button as={Link} to="/docencia/evaluaciones" variant="outline-info" size="sm" className="w-100 mt-3">
                    Nueva Evaluación
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm" style={{ backgroundColor: 'var(--m-surface)' }}>
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">Asistencias Pendientes</small>
                      <h3 className="fw-bold mb-0 mt-1 text-success">Al día</h3>
                    </div>
                    <i className="bi bi-calendar-check fs-1 text-success" />
                  </div>
                  <Button as={Link} to="/docencia/asistencias" variant="outline-success" size="sm" className="w-100 mt-3">
                    Tomar Lista
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-3">
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: 'var(--m-surface)' }}>
                <Card.Header className="p-3 border-bottom border-secondary border-opacity-25" style={{ backgroundColor: 'var(--m-surfaceVariant)' }}>
                  <strong style={{ color: 'var(--m-onSurface)' }}>Materia: Programación I (1° Año - TM)</strong>
                </Card.Header>
                <Card.Body className="p-3">
                  <p className="small text-muted mb-2">Comisión 1A-INF-TM | 29 alumnos inscriptos</p>
                  <div className="d-flex gap-2">
                    <Button as={Link} to="/docencia/calificaciones" variant="primary" size="sm">
                      <i className="bi bi-award me-1" /> Calificar Alumnos
                    </Button>
                    <Button as={Link} to="/docencia/asistencias" variant="secondary" size="sm">
                      <i className="bi bi-check2-square me-1" /> Pasar Asistencia
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: 'var(--m-surface)' }}>
                <Card.Header className="p-3 border-bottom border-secondary border-opacity-25" style={{ backgroundColor: 'var(--m-surfaceVariant)' }}>
                  <strong style={{ color: 'var(--m-onSurface)' }}>Materia: Programación II (2° Año - TT)</strong>
                </Card.Header>
                <Card.Body className="p-3">
                  <p className="small text-muted mb-2">Comisión 2A-INF-TT | 28 alumnos inscriptos</p>
                  <div className="d-flex gap-2">
                    <Button as={Link} to="/docencia/calificaciones" variant="primary" size="sm">
                      <i className="bi bi-award me-1" /> Calificar Alumnos
                    </Button>
                    <Button as={Link} to="/docencia/asistencias" variant="secondary" size="sm">
                      <i className="bi bi-check2-square me-1" /> Pasar Asistencia
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* 3. SECCIÓN PARA ADMINISTRATIVO Y ADMINISTRADOR */}
      {(rol === 'ADMINISTRATIVO' || rol === 'ADMINISTRADOR') && (
        <>
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--m-primary)' }}>
            <i className="bi bi-graph-up" /> Métricas Operativas del Instituto
          </h5>

          <Row className="g-3 mb-4">
            <Col md={6} xl={3}>
              <Card className="border-0 shadow-sm" style={{ backgroundColor: 'var(--m-surface)' }}>
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">Alumnos Matriculados</small>
                      <h3 className="fw-bold mb-0 mt-1" style={{ color: 'var(--m-onSurface)' }}>{alumnosCount}</h3>
                    </div>
                    <i className="bi bi-people fs-1" style={{ color: 'var(--m-primary)' }} />
                  </div>
                  <Button as={Link} to="/gestion/alumnos" variant="outline-primary" size="sm" className="w-100 mt-3">
                    Gestión de Alumnos
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} xl={3}>
              <Card className="border-0 shadow-sm" style={{ backgroundColor: 'var(--m-surface)' }}>
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">Solicitudes Pendientes</small>
                      <h3 className="fw-bold mb-0 mt-1 text-warning">{solicitudesCount}</h3>
                    </div>
                    <i className="bi bi-inbox fs-1 text-warning" />
                  </div>
                  <Button as={Link} to="/solicitudes/bandeja" variant="outline-warning" size="sm" className="w-100 mt-3">
                    Bandeja de Solicitudes
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} xl={3}>
              <Card className="border-0 shadow-sm" style={{ backgroundColor: 'var(--m-surface)' }}>
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">Registro de Cobros</small>
                      <h3 className="fw-bold mb-0 mt-1 text-success">6</h3>
                    </div>
                    <i className="bi bi-cash-coin fs-1 text-success" />
                  </div>
                  <Button as={Link} to="/administrativo/pagos" variant="outline-success" size="sm" className="w-100 mt-3">
                    Registrar Cobro
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} xl={3}>
              <Card className="border-0 shadow-sm" style={{ backgroundColor: 'var(--m-surface)' }}>
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">Cursos del Ciclo</small>
                      <h3 className="fw-bold mb-0 mt-1" style={{ color: 'var(--m-onSurface)' }}>3</h3>
                    </div>
                    <i className="bi bi-building fs-1 text-info" />
                  </div>
                  <Button as={Link} to="/gestion/cursos" variant="outline-info" size="sm" className="w-100 mt-3">
                    Ocupación de Cursos
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="border-0 shadow-sm" style={{ backgroundColor: 'var(--m-surface)' }}>
            <Card.Header className="p-3 border-bottom border-secondary border-opacity-25" style={{ backgroundColor: 'var(--m-surfaceVariant)' }}>
              <strong style={{ color: 'var(--m-onSurface)' }}>Ocupación de Comisiones - Ciclo Lectivo 2026</strong>
            </Card.Header>
            <Card.Body className="p-3">
              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>1° Año - Turno Mañana (Aula 101)</span>
                  <span className="fw-semibold">29 / 35 cupos (83%)</span>
                </div>
                <ProgressBar variant="warning" now={83} />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>2° Año - Turno Tarde (Lab Sistemas 2)</span>
                  <span className="fw-semibold">28 / 30 cupos (93%)</span>
                </div>
                <ProgressBar variant="danger" now={93} />
              </div>
              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span>1° Año - Turno Noche (Aula Magna 3)</span>
                  <span className="fw-semibold">40 / 40 cupos (100% - Cupo lleno)</span>
                </div>
                <ProgressBar variant="danger" now={100} />
              </div>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  )
}

export default InicioPage
