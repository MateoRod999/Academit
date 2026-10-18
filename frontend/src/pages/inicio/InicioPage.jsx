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
    getCuotas(1).then((data) => setAlumnoCuotas(data)).catch(() => {})
    getMesasExamen().then((data) => setAlumnoMesas(data.filter((m) => m.alumnosInscriptosIds.includes(1)))).catch(() => {})
    getCalificaciones({ idAlumno: 1 }).then((data) => setAlumnoCalificaciones(data)).catch(() => {})
    getSolicitudes().then((data) => setSolicitudesCount(data.filter((s) => s.estado === 'PENDIENTE').length)).catch(() => {})
    getAlumnos().then((data) => setAlumnosCount(data.length)).catch(() => {})
  }, [rol])

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
      />

      {/* 1. SECCIÓN ESPECÍFICA PARA ALUMNO */}
      {rol === 'ALUMNO' && (
        <>
          <h2 className="h4 mb-3 academic-serif" style={{ color: 'var(--texto)' }}>
            Resumen Académico y Arancelario
          </h2>

          <Row className="g-3 mb-4">
            <Col md={6} xl={3}>
              <Card className="h-100 p-3" style={{ backgroundColor: 'var(--superficie)', border: '1px solid var(--borde)' }}>
                <div className="stat-card-title">Próximo Vencimiento</div>
                <div className="stat-card-number">
                  {proximaCuota ? `$${proximaCuota.importe.toLocaleString('es-AR')}` : 'Al día'}
                </div>
                <div className="small mb-3 text-muted">
                  {proximaCuota ? `${proximaCuota.concepto} (${proximaCuota.fechaVencimiento})` : 'Sin cuotas pendientes'}
                </div>
                <Button as={Link} to="/academico/situacion" variant="outline-primary" size="sm" className="w-100 mt-auto">
                  Ver Estado de Deuda
                </Button>
              </Card>
            </Col>

            <Col md={6} xl={3}>
              <Card className="h-100 p-3" style={{ backgroundColor: 'var(--superficie)', border: '1px solid var(--borde)' }}>
                <div className="stat-card-title">Próxima Mesa Final</div>
                <div className="stat-card-number" style={{ fontSize: '1.25rem', minHeight: '2.5rem', display: 'flex', alignItems: 'center' }}>
                  {proximaMesa ? proximaMesa.materiaNombre : 'Sin inscripción'}
                </div>
                <div className="small mb-3 text-muted">
                  {proximaMesa ? `${proximaMesa.fecha} — ${proximaMesa.hora}` : 'Inscripciones habilitadas'}
                </div>
                <Button as={Link} to="/academico/mesas-examen" variant="outline-primary" size="sm" className="w-100 mt-auto">
                  Gestionar Mesas
                </Button>
              </Card>
            </Col>

            <Col md={6} xl={3}>
              <Card className="h-100 p-3" style={{ backgroundColor: 'var(--superficie)', border: '1px solid var(--borde)' }}>
                <div className="stat-card-title">Promedio General</div>
                <div className="stat-card-number">
                  {promedioNotas} <small style={{ fontSize: '1rem', color: 'var(--texto-secundario)' }}>/ 10</small>
                </div>
                <div className="small mb-3 text-muted">
                  {alumnoCalificaciones.length} evaluaciones registradas
                </div>
                <Button as={Link} to="/academico/parciales" variant="outline-primary" size="sm" className="w-100 mt-auto">
                  Ver Calificaciones
                </Button>
              </Card>
            </Col>

            <Col md={6} xl={3}>
              <Card className="h-100 p-3" style={{ backgroundColor: 'var(--superficie)', border: '1px solid var(--borde)' }}>
                <div className="stat-card-title">Mi Carrera</div>
                <div className="stat-card-number" style={{ fontSize: '1.1rem', minHeight: '2.5rem', display: 'flex', alignItems: 'center' }}>
                  Tecnicatura Superior en Software
                </div>
                <div className="small mb-3 text-muted">
                  Plan 2024 • Matrícula <StatusBadge status="ACTIVA" />
                </div>
                <Button as={Link} to="/academico/plan-estudios" variant="outline-primary" size="sm" className="w-100 mt-auto">
                  Ver Plan de Estudios
                </Button>
              </Card>
            </Col>
          </Row>

          <h3 className="h5 mb-3 academic-serif" style={{ color: 'var(--texto)' }}>
            Accesos Frecuentes
          </h3>
          <Row className="g-3">
            <Col sm={6} md={3}>
              <Card as={Link} to="/academico/situacion" className="p-3 text-decoration-none h-100" style={{ backgroundColor: 'var(--superficie)', border: '1px solid var(--borde)' }}>
                <div className="fw-semibold" style={{ color: 'var(--texto)' }}>Situación Arancelaria</div>
                <small className="text-muted">Consulta de cuotas y pagos</small>
              </Card>
            </Col>
            <Col sm={6} md={3}>
              <Card as={Link} to="/solicitudes/constancias" className="p-3 text-decoration-none h-100" style={{ backgroundColor: 'var(--superficie)', border: '1px solid var(--borde)' }}>
                <div className="fw-semibold" style={{ color: 'var(--texto)' }}>Constancias</div>
                <small className="text-muted">Alumno regular y examen</small>
              </Card>
            </Col>
            <Col sm={6} md={3}>
              <Card as={Link} to="/academico/plan-estudios" className="p-3 text-decoration-none h-100" style={{ backgroundColor: 'var(--superficie)', border: '1px solid var(--borde)' }}>
                <div className="fw-semibold" style={{ color: 'var(--texto)' }}>Plan de Estudios</div>
                <small className="text-muted">Materias y correlatividades</small>
              </Card>
            </Col>
            <Col sm={6} md={3}>
              <Card as={Link} to="/academico/asistencias" className="p-3 text-decoration-none h-100" style={{ backgroundColor: 'var(--superficie)', border: '1px solid var(--borde)' }}>
                <div className="fw-semibold" style={{ color: 'var(--texto)' }}>Mis Asistencias</div>
                <small className="text-muted">Porcentaje y detalle por materia</small>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* 2. SECCIÓN PARA DOCENTE */}
      {rol === 'DOCENTE' && (
        <>
          <h2 className="h4 mb-3 academic-serif" style={{ color: 'var(--texto)' }}>
            Gestión de Cursos a Cargo
          </h2>

          <Row className="g-3 mb-4">
            <Col md={4}>
              <Card className="p-3" style={{ backgroundColor: 'var(--superficie)', border: '1px solid var(--borde)' }}>
                <div className="stat-card-title">Cursos Asignados</div>
                <div className="stat-card-number">2</div>
                <Button as={Link} to="/docencia/mis-cursos" variant="outline-primary" size="sm" className="w-100 mt-3">
                  Ver Mis Cursos
                </Button>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="p-3" style={{ backgroundColor: 'var(--superficie)', border: '1px solid var(--borde)' }}>
                <div className="stat-card-title">Evaluaciones Creadas</div>
                <div className="stat-card-number">4</div>
                <Button as={Link} to="/docencia/evaluaciones" variant="outline-secondary" size="sm" className="w-100 mt-3">
                  Nueva Evaluación
                </Button>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="p-3" style={{ backgroundColor: 'var(--superficie)', border: '1px solid var(--borde)' }}>
                <div className="stat-card-title">Asistencias</div>
                <div className="stat-card-number" style={{ fontSize: '1.4rem', minHeight: '2.4rem', display: 'flex', alignItems: 'center' }}>
                  Al día
                </div>
                <Button as={Link} to="/docencia/asistencias" variant="outline-secondary" size="sm" className="w-100 mt-3">
                  Tomar Lista
                </Button>
              </Card>
            </Col>
          </Row>

          <Row className="g-3">
            <Col md={6}>
              <Card style={{ backgroundColor: 'var(--superficie)', border: '1px solid var(--borde)' }}>
                <Card.Header className="p-3 border-bottom" style={{ backgroundColor: 'var(--superficie-alt)' }}>
                  <strong>Materia: Programación I (1° Año - TM)</strong>
                </Card.Header>
                <Card.Body className="p-3">
                  <p className="small text-muted mb-2">Comisión 1A-INF-TM | 29 alumnos inscriptos</p>
                  <div className="d-flex gap-2">
                    <Button as={Link} to="/docencia/calificaciones" variant="primary" size="sm">
                      Calificar Alumnos
                    </Button>
                    <Button as={Link} to="/docencia/asistencias" variant="outline-secondary" size="sm">
                      Pasar Asistencia
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card style={{ backgroundColor: 'var(--superficie)', border: '1px solid var(--borde)' }}>
                <Card.Header className="p-3 border-bottom" style={{ backgroundColor: 'var(--superficie-alt)' }}>
                  <strong>Materia: Programación II (2° Año - TT)</strong>
                </Card.Header>
                <Card.Body className="p-3">
                  <p className="small text-muted mb-2">Comisión 2A-INF-TT | 28 alumnos inscriptos</p>
                  <div className="d-flex gap-2">
                    <Button as={Link} to="/docencia/calificaciones" variant="primary" size="sm">
                      Calificar Alumnos
                    </Button>
                    <Button as={Link} to="/docencia/asistencias" variant="outline-secondary" size="sm">
                      Pasar Asistencia
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
          <h2 className="h4 mb-3 academic-serif" style={{ color: 'var(--texto)' }}>
            Métricas Operativas del Instituto
          </h2>

          <Row className="g-3 mb-4">
            <Col md={6} xl={3}>
              <Card className="p-3" style={{ backgroundColor: 'var(--superficie)', border: '1px solid var(--borde)' }}>
                <div className="stat-card-title">Alumnos Matriculados</div>
                <div className="stat-card-number">{alumnosCount}</div>
                <Button as={Link} to="/gestion/alumnos" variant="outline-primary" size="sm" className="w-100 mt-3">
                  Gestión de Alumnos
                </Button>
              </Card>
            </Col>

            <Col md={6} xl={3}>
              <Card className="p-3" style={{ backgroundColor: 'var(--superficie)', border: '1px solid var(--borde)' }}>
                <div className="stat-card-title">Solicitudes Pendientes</div>
                <div className="stat-card-number">{solicitudesCount}</div>
                <Button as={Link} to="/solicitudes/bandeja" variant="outline-primary" size="sm" className="w-100 mt-3">
                  Bandeja de Solicitudes
                </Button>
              </Card>
            </Col>

            <Col md={6} xl={3}>
              <Card className="p-3" style={{ backgroundColor: 'var(--superficie)', border: '1px solid var(--borde)' }}>
                <div className="stat-card-title">Registro de Cobros</div>
                <div className="stat-card-number">6</div>
                <Button as={Link} to="/administrativo/pagos" variant="outline-primary" size="sm" className="w-100 mt-3">
                  Registrar Cobro
                </Button>
              </Card>
            </Col>

            <Col md={6} xl={3}>
              <Card className="p-3" style={{ backgroundColor: 'var(--superficie)', border: '1px solid var(--borde)' }}>
                <div className="stat-card-title">Cursos del Ciclo</div>
                <div className="stat-card-number">3</div>
                <Button as={Link} to="/gestion/cursos" variant="outline-primary" size="sm" className="w-100 mt-3">
                  Ocupación de Cursos
                </Button>
              </Card>
            </Col>
          </Row>

          <Card style={{ backgroundColor: 'var(--superficie)', border: '1px solid var(--borde)' }}>
            <Card.Header className="p-3 border-bottom" style={{ backgroundColor: 'var(--superficie-alt)' }}>
              <strong>Ocupación de Comisiones — Ciclo Lectivo 2026</strong>
            </Card.Header>
            <Card.Body className="p-3">
              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>1° Año - Turno Mañana (Aula 101)</span>
                  <span className="fw-semibold">29 / 35 cupos (83%)</span>
                </div>
                <ProgressBar variant="secondary" now={83} />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>2° Año - Turno Tarde (Lab Sistemas 2)</span>
                  <span className="fw-semibold">28 / 30 cupos (93%)</span>
                </div>
                <ProgressBar variant="secondary" now={93} />
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
