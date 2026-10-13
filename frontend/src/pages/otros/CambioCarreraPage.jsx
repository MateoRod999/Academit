import { useState, useEffect } from 'react'
import { Form, Col } from 'react-bootstrap'
import PageHeader from '../../components/PageHeader'
import SolicitudForm from '../../components/SolicitudForm'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import { useToast } from '../../context/ToastContext'
import { getSolicitudes, createSolicitud } from '../../api/solicitudes'

export const CambioCarreraPage = () => {
  const { showToast } = useToast()
  const [solicitudes, setSolicitudes] = useState([])
  const [carreraDestino, setCarreraDestino] = useState('Tecnicatura Superior en Ciencia de Datos e IA')
  const [loading, setLoading] = useState(false)
  const alumnoId = 1

  const cargar = async () => {
    try {
      const data = await getSolicitudes({ idAlumno: alumnoId, tipo: 'cambio de carrera' })
      setSolicitudes(data)
    } catch {
      showToast('Error al cargar trámites', 'danger')
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
        tipo: `Solicitud de cambio de carrera: hacia ${carreraDestino}`,
        motivo: formData.motivo,
        observaciones: formData.observaciones,
      })
      showToast('Solicitud de cambio de carrera remitida a Rectoría', 'success')
      cargar()
    } catch (err) {
      showToast(err.message || 'Error al solicitar cambio', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'tipo', label: 'Trámite' },
    { key: 'fechaSolicitud', label: 'Fecha Solicitud' },
    { key: 'motivo', label: 'Fundamentación' },
    {
      key: 'estado',
      label: 'Estado',
      render: (row) => <StatusBadge status={row.estado} />,
    },
    {
      key: 'respuesta',
      label: 'Dictamen de Coordinación',
      render: (row) => <span className="small text-muted">{row.respuesta || 'En consideración'}</span>,
    },
  ]

  const extraCarreraField = (
    <Col md={12}>
      <Form.Group controlId="carreraDestino">
        <Form.Label className="small fw-semibold">Carrera de Destino Solicitada</Form.Label>
        <Form.Select
          value={carreraDestino}
          onChange={(e) => setCarreraDestino(e.target.value)}
          style={{
            backgroundColor: 'var(--m-surfaceVariant)',
            color: 'var(--m-onSurface)',
            borderColor: 'var(--m-outline)',
          }}
        >
          <option value="Tecnicatura Superior en Ciencia de Datos e IA">
            Tecnicatura Superior en Ciencia de Datos e IA
          </option>
          <option value="Tecnicatura Superior en Redes e Infraestructura">
            Tecnicatura Superior en Redes e Infraestructura
          </option>
          <option value="Tecnicatura Superior en Seguridad Informática">
            Tecnicatura Superior en Seguridad Informática
          </option>
        </Form.Select>
      </Form.Group>
    </Col>
  )

  return (
    <div>
      <PageHeader
        title="Cambio de Carrera"
        subtitle="Trámite de pase entre planes de estudio o cambio de carrera formativa"
        icon="bi-arrow-left-right"
      />

      <SolicitudForm
        tipoPredefinido="Solicitud de cambio de carrera"
        extraFields={extraCarreraField}
        onSubmit={handleSubmit}
        loading={loading}
      />

      <h5 className="fw-bold mb-3" style={{ color: 'var(--m-primary)' }}>
        Mis Solicitudes de Cambio de Carrera
      </h5>

      <DataTable
        columns={columns}
        data={solicitudes}
        keyField="idSolicitud"
        searchPlaceholder="Buscar en solicitudes de pase..."
        searchKeys={['tipo', 'motivo', 'estado']}
      />
    </div>
  )
}

export default CambioCarreraPage
