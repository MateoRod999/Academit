import { useState, useEffect } from 'react'
import PageHeader from '../../components/PageHeader'
import SolicitudForm from '../../components/SolicitudForm'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import { useToast } from '../../context/ToastContext'
import { getSolicitudes, createSolicitud } from '../../api/solicitudes'

export const SolicitudTituloPage = () => {
  const { showToast } = useToast()
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(false)
  const alumnoId = 1

  const cargar = async () => {
    try {
      const data = await getSolicitudes({ idAlumno: alumnoId, tipo: 'título' })
      setSolicitudes(data)
    } catch {
      showToast('Error al cargar trámites de título', 'danger')
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
      showToast('Inicio de trámite de título registrado con éxito', 'success')
      cargar()
    } catch (err) {
      showToast(err.message || 'Error al iniciar trámite', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'tipo', label: 'Tipo de Título' },
    { key: 'fechaSolicitud', label: 'Fecha de Inicio' },
    { key: 'motivo', label: 'Detalle del Trámite' },
    {
      key: 'estado',
      label: 'Estado del Trámite',
      render: (row) => <StatusBadge status={row.estado} />,
    },
    {
      key: 'respuesta',
      label: 'Dictamen de Títulos y Egresados',
      render: (row) => <span className="small text-muted">{row.respuesta || 'Verificando analítico y libre deuda'}</span>,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Solicitud de Título"
        subtitle="Inicio de trámite de titulación intermedia o título final oficial"
        icon="bi-award"
      />

      <SolicitudForm
        tiposDisponibles={[
          'Solicitud de título intermedio: Analista Programador',
          'Solicitud de título final: Técnico Superior en Desarrollo de Software',
        ]}
        onSubmit={handleSubmit}
        loading={loading}
      />

      <h5 className="fw-bold mb-3" style={{ color: 'var(--m-primary)' }}>
        Mis Trámites de Titulación
      </h5>

      <DataTable
        columns={columns}
        data={solicitudes}
        keyField="idSolicitud"
        searchPlaceholder="Buscar en trámites de título..."
        searchKeys={['tipo', 'motivo', 'estado']}
      />
    </div>
  )
}

export default SolicitudTituloPage
