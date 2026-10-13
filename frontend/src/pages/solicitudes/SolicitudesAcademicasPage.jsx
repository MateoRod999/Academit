import { useState, useEffect } from 'react'
import PageHeader from '../../components/PageHeader'
import SolicitudForm from '../../components/SolicitudForm'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import { useToast } from '../../context/ToastContext'
import { getSolicitudes, createSolicitud } from '../../api/solicitudes'

export const SolicitudesAcademicasPage = () => {
  const { showToast } = useToast()
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(false)
  const alumnoId = 1

  const cargar = async () => {
    try {
      const data = await getSolicitudes({ idAlumno: alumnoId, tipo: 'académica' })
      setSolicitudes(data)
    } catch {
      showToast('Error al cargar solicitudes académicas', 'danger')
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
        tipo: formData.tipo,
        motivo: formData.motivo,
        observaciones: formData.observaciones,
      })
      showToast('Solicitud académica presentada exitosamente', 'success')
      cargar()
    } catch (err) {
      showToast(err.message || 'Error al enviar solicitud', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'tipo', label: 'Tipo de Pedido' },
    { key: 'fechaSolicitud', label: 'Fecha Presentación' },
    { key: 'motivo', label: 'Motivo / Argumentación' },
    {
      key: 'estado',
      label: 'Estado',
      render: (row) => <StatusBadge status={row.estado} />,
    },
    {
      key: 'respuesta',
      label: 'Resolución de Secretaría',
      render: (row) => <span className="small text-muted">{row.respuesta || 'En evaluación'}</span>,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Solicitudes Académicas Generales"
        subtitle="Pedidos de excepción de correlatividad, revisión de notas, prórroga y justificaciones"
        icon="bi-send"
      />

      <SolicitudForm
        tiposDisponibles={[
          'Excepción de correlatividad para cursar',
          'Revisión o rectificación de nota de examen',
          'Prórroga de regularidad de materia',
          'Justificación extraordinaria de inasistencia',
          'Equivalencias y reconocimiento de materias',
        ]}
        onSubmit={handleSubmit}
        loading={loading}
      />

      <h5 className="fw-bold mb-3" style={{ color: 'var(--m-primary)' }}>
        Mis Solicitudes Académicas
      </h5>

      <DataTable
        columns={columns}
        data={solicitudes}
        keyField="idSolicitud"
        searchPlaceholder="Buscar en solicitudes..."
        searchKeys={['tipo', 'motivo', 'estado']}
      />
    </div>
  )
}

export default SolicitudesAcademicasPage
