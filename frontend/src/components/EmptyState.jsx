export const EmptyState = ({
  title = 'No hay registros',
  description = '',
  actionLabel,
  onAction,
}) => {
  return (
    <div
      style={{
        padding: '20px 16px',
        color: 'var(--suave)',
        textAlign: 'center',
        background: 'var(--papel)',
        border: '1px solid var(--linea)',
        borderRadius: '3px',
      }}
    >
      <span>
        {title}{description ? ` — ${description}` : ''}
      </span>
      {actionLabel && onAction && (
        <button
          type="button"
          className="btn lig chico"
          onClick={onAction}
          style={{ marginLeft: '12px' }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default EmptyState
