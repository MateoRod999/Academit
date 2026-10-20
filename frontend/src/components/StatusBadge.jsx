export const StatusBadge = ({ status, className = '' }) => {
  if (!status) return null

  const s = String(status).toUpperCase()

  let variantClass = 'e-neu'
  let label = status

  switch (s) {
    // OK / Aprobados / Éxitos / Pagados
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
      variantClass = 'e-ok'
      label = s === 'PRESENTE' ? 'Presente' : status
      break

    // Pendientes
    case 'PENDIENTE':
    case 'EN_PROCESO':
    case 'TARDANZA':
      variantClass = 'e-pend'
      label = s === 'EN_PROCESO' ? 'En proceso' : (s === 'TARDANZA' ? 'Tardanza' : 'Pendiente')
      break

    // Vencida / Anulada / Error
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
      variantClass = 'e-mal'
      label = s === 'RECHAZADA' || s === 'RECHAZADO' ? 'Rechazada' : (s === 'VENCIDA' || s === 'VENCIDO' ? 'Vencida' : (s === 'AUSENTE' ? 'Ausente' : (s === 'ANULADA' ? 'Anulada' : status)))
      break

    // Informativo / Neutro
    case 'ABIERTA':
    case 'CERRADA':
    case 'CERRADO':
    case 'JUSTIFICADO':
    default:
      variantClass = 'e-neu'
      label = s === 'JUSTIFICADO' ? 'Justificado' : (s === 'ABIERTA' ? 'Abierta' : (s === 'CERRADA' || s === 'CERRADO' ? 'Cerrada' : status))
      break
  }

  return (
    <span className={`estado ${variantClass} ${className}`.trim()}>
      {label}
    </span>
  )
}

export default StatusBadge
