import { useState, useEffect } from 'react'
import PageHeader from '../../components/PageHeader'
import SolicitudForm from '../../components/SolicitudForm'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import { useToast } from '../../context/ToastContext'
import { getSolicitudes, createSolicitud } from '../../api/solicitudes'

export const ConstanciasPage = () => {
  const { showToast } = useToast()
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(false)
  const alumnoId = 1

  const cargar = async () => {
    try {
      const data = await getSolicitudes({ idAlumno: alumnoId, tipo: 'Constancia' })
      setSolicitudes(data)
    } catch {
      showToast('Error al cargar solicitudes', 'danger')
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
      showToast('Solicitud de constancia enviada exitosamente', 'success')
      cargar()
    } catch (err) {
      showToast(err.message || 'Error al enviar la solicitud', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'tipo', label: 'Tipo de Constancia' },
    { key: 'fechaSolicitud', label: 'Fecha Solicitud' },
    { key: 'motivo', label: 'Motivo' },
    {
      key: 'estado',
      label: 'Estado',
      render: (row) => <StatusBadge status={row.estado} />,
    },
    {
      key: 'respuesta',
      label: 'Respuesta / Descarga',
      render: (row) =>
        row.estado === 'APROBADA' ? (
          <span className="text-success small">
            <i className="bi bi-file-earmark-pdf me-1" /> Lista para descargar
          </span>
        ) : (
          <span className="text-muted small">{row.respuesta || 'En trámite'}</span>
        ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Solicitud de Constancias"
        subtitle="Constancia de alumno regular, constancia de examen y promedio académico"
        icon="bi-file-earmark-text"
      />

      <SolicitudForm
        tiposDisponibles={[
          'Constancia de Alumno Regular',
          'Constancia de Examen Final Rendido',
          'Constancia de Porcentaje de Materias Aprobadas',
          'Constancia de Promedio General',
        ]}
        onSubmit={handleSubmit}
        loading={loading}
      />

      <h5 className="fw-bold mb-3" style={{ color: 'var(--m-primary)' }}>
        Mis Solicitudes de Constancias
      </h5>

      <DataTable
        columns={columns}
        data={solicitudes}
        keyField="idSolicitud"
        searchPlaceholder="Buscar en mis constancias..."
        searchKeys={['tipo', 'motivo', 'estado']}
      />
    </div>
  )
}

export default ConstanciasPage
