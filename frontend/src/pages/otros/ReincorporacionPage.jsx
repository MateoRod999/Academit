import { useState, useEffect } from 'react'
import PageHeader from '../../components/PageHeader'
import SolicitudForm from '../../components/SolicitudForm'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import { useToast } from '../../context/ToastContext'
import { getSolicitudes, createSolicitud } from '../../api/solicitudes'

export const ReincorporacionPage = () => {
  const { showToast } = useToast()
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(false)
  const alumnoId = 1

  const cargar = async () => {
    try {
      const data = await getSolicitudes({ idAlumno: alumnoId, tipo: 'reincorporación' })
      setSolicitudes(data)
    } catch {
      showToast('Error al cargar trámites de reincorporación', 'danger')
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
        tipo: 'Solicitud formal de reincorporación a la cursada',
        motivo: formData.motivo,
        observaciones: formData.observaciones,
      })
      showToast('Solicitud de reincorporación enviada a Secretaría Académica', 'success')
      cargar()
    } catch (err) {
      showToast(err.message || 'Error al solicitar reincorporación', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'tipo', label: 'Trámite' },
    { key: 'fechaSolicitud', label: 'Fecha Solicitud' },
    { key: 'motivo', label: 'Motivo de Pérdida de Condición / Justificación' },
    {
      key: 'estado',
      label: 'Estado',
      render: (row) => <StatusBadge status={row.estado} />,
    },
    {
      key: 'respuesta',
      label: 'Resolución',
      render: (row) => <span className="small text-muted">{row.respuesta || 'En evaluación por el Consejo Directivo'}</span>,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Solicitud de Reincorporación"
        subtitle="Trámite de recuperación de condición regular por excedencia de faltas o suspensión transitoria"
        icon="bi-arrow-repeat"
      />

      <SolicitudForm
        tipoPredefinido="Solicitud formal de reincorporación a la cursada"
        onSubmit={handleSubmit}
        loading={loading}
      />

      <h5 className="fw-bold mb-3" style={{ color: 'var(--m-primary)' }}>
        Mis Solicitudes de Reincorporación
      </h5>

      <DataTable
        columns={columns}
        data={solicitudes}
        keyField="idSolicitud"
        searchPlaceholder="Buscar en trámites..."
        searchKeys={['tipo', 'motivo', 'estado']}
      />
    </div>
  )
}

export default ReincorporacionPage
