import { Breadcrumb } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
}) => {
  return (
    <div className="page-title-section">
      {breadcrumbs.length > 0 && (
        <Breadcrumb className="mb-2">
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
        <div>
          <h1 className="page-title">
            {title}
          </h1>
          {subtitle && (
            <p className="page-subtitle">
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
