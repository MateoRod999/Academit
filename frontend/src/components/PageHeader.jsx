export const PageHeader = ({
  title,
  subtitle,
  actions,
}) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3">
        <div>
          <h1>{title}</h1>
          {subtitle && (
            <p className="resumen" style={{ color: 'var(--suave)', margin: '4px 0 0', fontSize: '15px' }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="d-flex align-items-center gap-2 flex-wrap">{actions}</div>}
      </div>
    </div>
  )
}

export default PageHeader
