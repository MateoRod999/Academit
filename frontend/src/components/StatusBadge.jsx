export const StatusBadge = ({ status, className = '' }) => {
  if (!status) return null

  const s = String(status).toUpperCase()

  let badgeClass
  let label

  switch (s) {
    // Aprobados / Éxitos / Pagados (#4F5E49)
    case 'ACTIVO':
    case 'ACTIVA':
    case 'REGULAR':
    case 'CONFIRMADA':
    case 'APROBADA':
    case 'APROBADO':
    case 'PAGADA':
    case 'PAGADO':
    case 'ACREDITADO':
    case 'ENTREGADO':
    case 'PRESENTE':
      badgeClass = 'badge-estado-aprobado'
      label = s === 'PRESENTE' ? 'Presente' : status
      break

    // Pendientes (#864A2D)
    case 'PENDIENTE':
    case 'EN_PROCESO':
    case 'TARDANZA':
      badgeClass = 'badge-estado-pendiente'
      label = s === 'EN_PROCESO' ? 'En proceso' : (s === 'TARDANZA' ? 'Tardanza' : 'Pendiente')
      break

    // Vencida / Anulada / Error (#9C4940)
    case 'RECHAZADA':
    case 'RECHAZADO':
    case 'CANCELADA':
    case 'CANCELADO':
    case 'INACTIVO':
    case 'INACTIVA':
    case 'ANULADA':
    case 'VENCIDA':
    case 'VENCIDO':
    case 'AUSENTE':
      badgeClass = 'badge-estado-vencida'
      label = s === 'RECHAZADA' || s === 'RECHAZADO' ? 'Rechazada' : (s === 'VENCIDA' || s === 'VENCIDO' ? 'Vencida' : (s === 'AUSENTE' ? 'Ausente' : status))
      break

    // Informativo / Neutro (#455860)
    case 'ABIERTA':
    case 'CERRADA':
    case 'CERRADO':
    case 'JUSTIFICADO':
    default:
      badgeClass = 'badge-estado-informativo'
      label = s === 'JUSTIFICADO' ? 'Justificado' : (s === 'ABIERTA' ? 'Abierta' : (s === 'CERRADA' || s === 'CERRADO' ? 'Cerrada' : status))
      break
  }

  return (
    <span
      className={`badge ${badgeClass} ${className}`}
      style={{
        display: 'inline-block',
        fontSize: '0.75rem',
        padding: '2px 8px',
        fontWeight: 500,
        borderRadius: '2px',
        borderWidth: '1px',
        borderStyle: 'solid',
        backgroundColor: 'var(--superficie)',
      }}
    >
      {label}
    </span>
  )
}

export default StatusBadge
