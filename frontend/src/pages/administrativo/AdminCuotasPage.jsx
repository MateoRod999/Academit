import { useState, useEffect } from 'react'
import { Badge, ButtonGroup, Button } from 'react-bootstrap'
import PageHeader from '../../components/PageHeader'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import { useToast } from '../../context/ToastContext'
import { getCuotas } from '../../api/cuotas'

export const AdminCuotasPage = () => {
  const { showToast } = useToast()
  const [cuotas, setCuotas] = useState([])
  const [filtroTipo, setFiltroTipo] = useState('TODOS')

  const cargar = async () => {
    try {
      const data = await getCuotas()
      setCuotas(data)
    } catch {
      showToast('Error al cargar cuotas', 'danger')
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const cuotasFiltradas = cuotas.filter((c) => {
    if (filtroTipo === 'TODOS') return true
    return c.tipo === filtroTipo
  })

  const columns = [
    { key: 'idCuota', label: '# ID', width: '70px' },
    {
      key: 'alumnoNombre',
      label: 'Estudiante',
      render: (row) => <strong style={{ color: 'var(--m-onSurface)' }}>{row.alumnoNombre}</strong>,
    },
    { key: 'concepto', label: 'Concepto' },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (row) => (
        <Badge bg={row.tipo === 'SEGURO_CUATRIMESTRAL' ? 'info' : 'secondary'}>
          {row.tipo === 'SEGURO_CUATRIMESTRAL' ? 'Seguro Cuatrimestral' : 'Cuota Mensual'}
        </Badge>
      ),
    },
    { key: 'periodo', label: 'Período' },
    {
      key: 'importe',
      label: 'Importe',
      render: (row) => <span className="fw-semibold">${row.importe.toLocaleString('es-AR')}</span>,
    },
    { key: 'fechaVencimiento', label: 'Vencimiento' },
    {
      key: 'estado',
      label: 'Estado',
      render: (row) => <StatusBadge status={row.estado} />,
    },
    {
      key: 'comprobante',
      label: 'Recibo',
      render: (row) => row.comprobante ? <span className="font-monospace small text-muted">{row.comprobante}</span> : <span className="text-muted small">—</span>,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Gestión de Cuotas y Seguros"
        subtitle="Administración arancelaria integral: 12 cuotas mensuales y 3 seguros cuatrimestrales (PENDIENTE, PAGADA, VENCIDA, ANULADA)"
        icon="bi-receipt"
      />

      <div className="mb-3 d-flex align-items-center gap-2">
        <span className="small text-muted fw-semibold me-2">Filtrar por tipo:</span>
        <ButtonGroup size="sm">
          <Button
            variant={filtroTipo === 'TODOS' ? 'primary' : 'outline-secondary'}
            onClick={() => setFiltroTipo('TODOS')}
          >
            Todos
          </Button>
          <Button
            variant={filtroTipo === 'CUOTA_MENSUAL' ? 'primary' : 'outline-secondary'}
            onClick={() => setFiltroTipo('CUOTA_MENSUAL')}
          >
            Cuotas Mensuales (12)
          </Button>
          <Button
            variant={filtroTipo === 'SEGURO_CUATRIMESTRAL' ? 'primary' : 'outline-secondary'}
            onClick={() => setFiltroTipo('SEGURO_CUATRIMESTRAL')}
          >
            Seguros Cuatrimestrales (3)
          </Button>
        </ButtonGroup>
      </div>

      <DataTable
        columns={columns}
        data={cuotasFiltradas}
        keyField="idCuota"
        pageSize={10}
        searchPlaceholder="Buscar por alumno, concepto o comprobante..."
        searchKeys={['alumnoNombre', 'concepto', 'comprobante', 'periodo', 'estado']}
      />
    </div>
  )
}

export default AdminCuotasPage
