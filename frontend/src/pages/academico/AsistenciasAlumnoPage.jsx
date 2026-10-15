import { useState, useEffect } from 'react'
import { Card, Row, Col, ProgressBar } from 'react-bootstrap'
import PageHeader from '../../components/PageHeader'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import { getAsistencias } from '../../api/asistencias'

export const AsistenciasAlumnoPage = () => {
  const [asistencias, setAsistencias] = useState([])
  const alumnoId = 1 // Alumno de referencia: Lucía Benítez

  useEffect(() => {
    getAsistencias({ idAlumno: alumnoId }).then(setAsistencias).catch(() => {})
  }, [])

  const totalClases = asistencias.length
  const presentes = asistencias.filter((a) => a.estado === 'PRESENTE').length
  const tardanzas = asistencias.filter((a) => a.estado === 'TARDANZA').length
  const justificados = asistencias.filter((a) => a.estado === 'JUSTIFICADO').length
  const ausentes = asistencias.filter((a) => a.estado === 'AUSENTE').length

  // Asistencia efectiva = (Presentes + Justificados + Tardanzas * 0.5) / Total
  const porcentaje = totalClases > 0
    ? Math.round(((presentes + justificados + tardanzas * 0.5) / totalClases) * 100)
    : 100

  const columns = [
    { key: 'fecha', label: 'Fecha' },
    { key: 'materiaNombre', label: 'Materia' },
    {
      key: 'estado',
      label: 'Estado de Asistencia',
      render: (row) => <StatusBadge status={row.estado} />,
    },
    {
      key: 'detalle',
      label: 'Observación',
      render: (row) => {
        if (row.estado === 'PRESENTE') return <span className="text-muted small">Puntual</span>
        if (row.estado === 'TARDANZA') return <span className="text-warning small">Ingreso con 15 min de demora</span>
        if (row.estado === 'JUSTIFICADO') return <span className="text-info small">Certificado médico presentado</span>
        return <span className="text-danger small">Falta injustificada</span>
      },
    },
  ]

  return (
    <div>
      <PageHeader
        title="Historial de Asistencias"
        subtitle="Registro de presentismo en clases presenciales y porcentaje acumulado"
        icon="bi-clock-history"
      />

      <Row className="g-3 mb-4">
        <Col md={6} lg={4}>
          <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: 'var(--m-surface)' }}>
            <Card.Body className="p-3">
              <span className="text-muted small text-uppercase fw-semibold">Porcentaje de Asistencia</span>
              <div className="d-flex align-items-baseline gap-2 mt-1 mb-2">
                <h3 className="fw-bold mb-0" style={{ color: porcentaje >= 75 ? 'var(--m-secondary)' : 'var(--m-error)' }}>
                  {porcentaje}%
                </h3>
                <small className="text-muted">(Mínimo requerido: 75%)</small>
              </div>
              <ProgressBar
                now={porcentaje}
                variant={porcentaje >= 75 ? 'success' : 'danger'}
                style={{ height: '8px' }}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={8}>
          <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: 'var(--m-surface)' }}>
            <Card.Body className="p-3">
              <span className="text-muted small text-uppercase fw-semibold">Desglose de Clases ({totalClases} registradas)</span>
              <Row className="mt-2 text-center g-2">
                <Col xs={3}>
                  <div className="p-2 rounded" style={{ backgroundColor: 'var(--m-surfaceVariant)' }}>
                    <div className="fw-bold fs-5 text-success">{presentes}</div>
                    <small className="text-muted">Presentes</small>
                  </div>
                </Col>
                <Col xs={3}>
                  <div className="p-2 rounded" style={{ backgroundColor: 'var(--m-surfaceVariant)' }}>
                    <div className="fw-bold fs-5 text-warning">{tardanzas}</div>
                    <small className="text-muted">Tardanzas</small>
                  </div>
                </Col>
                <Col xs={3}>
                  <div className="p-2 rounded" style={{ backgroundColor: 'var(--m-surfaceVariant)' }}>
                    <div className="fw-bold fs-5 text-info">{justificados}</div>
                    <small className="text-muted">Justificados</small>
                  </div>
                </Col>
                <Col xs={3}>
                  <div className="p-2 rounded" style={{ backgroundColor: 'var(--m-surfaceVariant)' }}>
                    <div className="fw-bold fs-5 text-danger">{ausentes}</div>
                    <small className="text-muted">Ausentes</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <DataTable
        columns={columns}
        data={asistencias}
        keyField="idAsistencia"
        searchPlaceholder="Buscar por fecha o materia..."
        searchKeys={['fecha', 'materiaNombre', 'estado']}
      />
    </div>
  )
}

export default AsistenciasAlumnoPage
