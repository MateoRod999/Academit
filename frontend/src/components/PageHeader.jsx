import { Breadcrumb } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const PageHeader = ({
  title,
  subtitle,
  icon,
  breadcrumbs = [],
  actions,
}) => {
  return (
    <div className="mb-4 pb-2 border-bottom border-secondary border-opacity-25">
      {breadcrumbs.length > 0 && (
        <Breadcrumb className="small mb-2">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
            Inicio
          </Breadcrumb.Item>
          {breadcrumbs.map((b, idx) =>
            b.path ? (
              <Breadcrumb.Item key={idx} linkAs={Link} linkProps={{ to: b.path }}>
                {b.label}
              </Breadcrumb.Item>
            ) : (
              <Breadcrumb.Item key={idx} active>
                {b.label}
              </Breadcrumb.Item>
            )
          )}
        </Breadcrumb>
      )}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div className="d-flex align-items-center gap-3">
          {icon && (
            <div
              className="d-flex align-items-center justify-content-center rounded-3 p-2"
              style={{
                backgroundColor: 'var(--m-surfaceVariant)',
                color: 'var(--m-primary)',
                minWidth: '44px',
                minHeight: '44px',
                fontSize: '1.4rem',
              }}
            >
              <i className={`bi ${icon}`} />
            </div>
          )}
          <div>
            <h1 className="h3 mb-0 fw-bold" style={{ color: 'var(--m-onSurface)' }}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-muted mb-0 small mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {actions && <div className="d-flex align-items-center gap-2 flex-wrap">{actions}</div>}
      </div>
    </div>
  )
}

export default PageHeader
