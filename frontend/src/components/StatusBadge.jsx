import { Badge } from 'react-bootstrap'

export const StatusBadge = ({ status, className = '' }) => {
  if (!status) return null

  const s = String(status).toUpperCase()

  let bg
  let icon = null
  let label

  switch (s) {
    // Activos / Éxitos
    case 'ACTIVO':
    case 'ACTIVA':
    case 'REGULAR':
    case 'CONFIRMADA':
      bg = 'success'
      icon = 'bi-check-circle'
      label = status
      break
    case 'AL_DIA':
      bg = 'success'
      icon = 'bi-check-circle'
      label = 'Al día'
      break
    case 'APROBADA':
    case 'APROBADO':
    case 'PAGADA':
    case 'PAGADO':
    case 'ACREDITADO':
    case 'ENTREGADO':
      bg = 'success'
      icon = 'bi-check2'
      label = status
      break
    case 'PRESENTE':
      bg = 'success'
      icon = 'bi-check-lg'
      label = 'Presente'
      break

    // En proceso / Pendientes / Avisos
    case 'PENDIENTE':
      bg = 'warning'
      icon = 'bi-clock-history'
      label = 'Pendiente'
      break
    case 'EN_MORA':
      bg = 'danger'
      icon = 'bi-exclamation-octagon'
      label = 'En mora'
      break
    case 'EN_PROCESO':
      bg = 'info'
      icon = 'bi-arrow-repeat'
      label = 'En proceso'
      break
    case 'TARDANZA':
      bg = 'warning'
      icon = 'bi-hourglass-split'
      label = 'Tardanza'
      break
    case 'JUSTIFICADO':
      bg = 'info'
      icon = 'bi-file-earmark-medical'
      label = 'Justificado'
      break
    case 'ABIERTA':
      bg = 'primary'
      icon = 'bi-door-open'
      label = 'Abierta'
      break

    // Errores / Bajas / Rechazos / Deudas
    case 'RECHAZADA':
    case 'RECHAZADO':
      bg = 'danger'
      icon = 'bi-x-circle'
      label = 'Rechazada'
      break
    case 'CANCELADA':
    case 'CANCELADO':
    case 'INACTIVO':
    case 'INACTIVA':
    case 'ANULADA':
      bg = 'secondary'
      icon = 'bi-slash-circle'
      label = status
      break
    case 'VENCIDA':
    case 'VENCIDO':
      bg = 'danger'
      icon = 'bi-exclamation-octagon'
      label = 'Vencida'
      break
    case 'AUSENTE':
      bg = 'danger'
      icon = 'bi-x-lg'
      label = 'Ausente'
      break
    case 'CERRADO':
    case 'CERRADA':
      bg = 'secondary'
      icon = 'bi-lock'
      label = status
      break

    default:
      bg = 'secondary'
      label = status
  }

  return (
    <Badge
      bg={bg}
      className={`d-inline-flex align-items-center gap-1 px-2 py-1 fw-medium ${className}`}
      style={{ fontSize: '0.78rem' }}
    >
      {icon && <i className={`bi ${icon}`} />}
      <span>{label}</span>
    </Badge>
  )
}

export default StatusBadge
