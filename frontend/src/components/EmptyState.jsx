import { Card, Button } from 'react-bootstrap'

export const EmptyState = ({
  icon = 'bi-inbox',
  title = 'No hay datos para mostrar',
  description = 'No se encontraron registros que coincidan con la búsqueda o el criterio seleccionado.',
  actionLabel,
  onAction,
}) => {
  return (
    <Card className="border-0 shadow-sm text-center py-5 my-3" style={{ backgroundColor: 'var(--m-surfaceVariant)' }}>
      <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
        <div
          className="d-flex align-items-center justify-content-center rounded-circle mb-3"
          style={{
            width: '64px',
            height: '64px',
            backgroundColor: 'var(--m-surface)',
            color: 'var(--m-primary)',
            fontSize: '1.8rem',
          }}
        >
          <i className={`bi ${icon}`} />
        </div>
        <h5 className="fw-semibold mb-2" style={{ color: 'var(--m-onSurface)' }}>
          {title}
        </h5>
        <p className="text-muted small mb-3" style={{ maxWidth: '420px' }}>
          {description}
        </p>
        {actionLabel && onAction && (
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Card.Body>
    </Card>
  )
}

export default EmptyState
