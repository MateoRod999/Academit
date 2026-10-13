import { useState, useEffect } from 'react'
import PageHeader from '../../components/PageHeader'
import SolicitudForm from '../../components/SolicitudForm'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import { useToast } from '../../context/ToastContext'
import { getSolicitudes, createSolicitud } from '../../api/solicitudes'

export const PasantiasPage = () => {
  const { showToast } = useToast()
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(false)
  const alumnoId = 1

  const cargar = async () => {
    try {
      const data = await getSolicitudes({ idAlumno: alumnoId, tipo: 'pasantías' })
      setSolicitudes(data)
    } catch {
      showToast('Error al cargar solicitudes de pasantías', 'danger')
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
        tipo: 'Inscripción a pasantías formativas',
        motivo: formData.motivo,
        observaciones: formData.observaciones,
      })
      showToast('Postulación a pasantías registrada con éxito', 'success')
      cargar()
    } catch (err) {
      showToast(err.message || 'Error al postularse', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'tipo', label: 'Convocatoria' },
    { key: 'fechaSolicitud', label: 'Fecha Postulación' },
    { key: 'motivo', label: 'Perfil / Empresa / Motivación' },
    {
      key: 'estado',
      label: 'Estado Postulación',
      render: (row) => <StatusBadge status={row.estado} />,
    },
    {
      key: 'respuesta',
      label: 'Dictamen de Coordinación',
      render: (row) => <span className="small text-muted">{row.respuesta || 'En evaluación por comisión'}</span>,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Inscripción a Pasantías"
        subtitle="Postulación a convenios de pasantías laborales y prácticas pre-profesionales rentadas"
        icon="bi-briefcase"
      />

      <SolicitudForm
        tipoPredefinido="Inscripción a pasantías formativas"
        onSubmit={handleSubmit}
        loading={loading}
      />

      <h5 className="fw-bold mb-3" style={{ color: 'var(--m-primary)' }}>
        Mis Postulaciones a Pasantías
      </h5>

      <DataTable
        columns={columns}
        data={solicitudes}
        keyField="idSolicitud"
        searchPlaceholder="Buscar en mis postulaciones..."
        searchKeys={['tipo', 'motivo', 'estado']}
      />
    </div>
  )
}

export default PasantiasPage
