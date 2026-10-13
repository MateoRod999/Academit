import { useState, useEffect } from 'react'
import { Alert } from 'react-bootstrap'
import PageHeader from '../../components/PageHeader'
import SolicitudForm from '../../components/SolicitudForm'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import { useToast } from '../../context/ToastContext'
import { getSolicitudes, createSolicitud } from '../../api/solicitudes'

export const DeclaracionJuradaPage = () => {
  const { showToast } = useToast()
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(false)
  const alumnoId = 1

  const cargar = async () => {
    try {
      const data = await getSolicitudes({ idAlumno: alumnoId, tipo: 'Declaración jurada' })
      setSolicitudes(data)
    } catch {
      showToast('Error al cargar declaraciones juradas', 'danger')
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      await createSolicitud({
        idAlumno: alumnoId,
        tipo: 'Declaración jurada de materias a cursar',
        motivo: formData.motivo,
        observaciones: formData.observaciones,
      })
      showToast('Declaración jurada presentada formalmente (RF51)', 'success')
      cargar()
    } catch (err) {
      showToast(err.message || 'Error al enviar declaración jurada', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'tipo', label: 'Trámite' },
    { key: 'fechaSolicitud', label: 'Fecha de Presentación' },
    { key: 'motivo', label: 'Materias Declaradas / Justificación' },
    {
      key: 'estado',
      label: 'Estado de Validación',
      render: (row) => <StatusBadge status={row.estado} />,
    },
    {
      key: 'respuesta',
      label: 'Resolución de Secretaría Académica',
      render: (row) => <span className="small text-muted">{row.respuesta || 'En revisión'}</span>,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Declaración Jurada de Materias a Cursar"
        subtitle="Presentación formal de compromiso académico y correlatividades para cursada (RF51)"
        icon="bi-pencil-square"
      />

      <Alert variant="warning" className="small mb-4 d-flex align-items-center gap-2">
        <i className="bi bi-shield-exclamation fs-5" />
        <div>
          <strong>Requisito RF51:</strong> Mediante esta declaración jurada, el estudiante declara bajo juramento cumplir con las correlatividades exigidas para cursar las materias seleccionadas en el ciclo lectivo 2026.
        </div>
      </Alert>

      <SolicitudForm
        tipoPredefinido="Declaración jurada de materias a cursar (Ciclo Lectivo 2026)"
        onSubmit={handleSubmit}
        loading={loading}
      />

      <h5 className="fw-bold mb-3" style={{ color: 'var(--m-primary)' }}>
        Mis Declaraciones Juradas Presentadas
      </h5>

      <DataTable
        columns={columns}
        data={solicitudes}
        keyField="idSolicitud"
        searchPlaceholder="Buscar en mis declaraciones..."
        searchKeys={['tipo', 'motivo', 'estado']}
      />
    </div>
  )
}

export default DeclaracionJuradaPage
