import { Button } from 'react-bootstrap'

export const EmptyState = ({
  title = 'No hay datos para mostrar',
  description = 'No se encontraron registros disponibles.',
  actionLabel,
  onAction,
}) => {
  return (
    <div
      className="p-3 text-center my-2"
      style={{
        backgroundColor: 'var(--superficie-alt)',
        border: '1px solid var(--borde)',
        borderRadius: '2px',
      }}
    >
      <span className="small text-muted me-2">
        {title}{description ? ` — ${description}` : ''}
      </span>
      {actionLabel && onAction && (
        <Button variant="outline-secondary" size="sm" onClick={onAction} className="ms-2 py-0 px-2 small">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
