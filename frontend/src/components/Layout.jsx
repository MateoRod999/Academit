import { useState } from 'react'
import { Nav, Button, Badge, Offcanvas, Alert } from 'react-bootstrap'
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MENU_GRUPOS } from '../config/menu'

export const Layout = ({ children }) => {
  const { isAuthenticated, rol, nombre, usuario, logout } = useAuth()
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [showMockAlert, setShowMockAlert] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  const isMock = import.meta.env.VITE_USE_MOCK === 'true'

  // Si no está autenticado o está en login, renderizar children directamente
  if (!isAuthenticated || location.pathname === '/login') {
    return <main>{children}</main>
  }

  const handleLogout = async () => {
    setShowMobileSidebar(false)
    await logout()
    navigate('/login')
  }

  // Filtrar grupos y opciones según el rol del usuario activo
  // Regla: "Cada grupo solo aparece si el rol tiene al menos una opción en él."
  const gruposVisibles = MENU_GRUPOS.map((grupo) => {
    const itemsPermitidos = grupo.items.filter((item) =>
      rol ? item.roles.includes(rol) : false
    )
    return {
      ...grupo,
      items: itemsPermitidos,
    }
  }).filter((grupo) => grupo.items.length > 0)

  // Obtener el título activo para la barra superior
  const todosLosItems = MENU_GRUPOS.flatMap((g) => g.items)
  const activeItem = todosLosItems.find((item) => item.path === location.pathname)
  const activeTitle = activeItem ? activeItem.label : 'Inicio'

  // Renderizar enlaces organizados por grupos con encabezado y divisor
  const renderNavGrupos = (onItemClick) => (
    <Nav className="flex-column gap-1">
      {gruposVisibles.map((grupo, gIdx) => (
        <div key={grupo.id} className="mb-2">
          {gIdx > 0 && <hr className="sidebar-divider" />}
          <div className="sidebar-section-title">{grupo.titulo}</div>

          <div className="d-flex flex-column gap-1 mt-1">
            {grupo.items.map((item) => (
              <Nav.Link
                key={item.path}
                as={NavLink}
                to={item.path}
                end={item.path === '/'}
                onClick={onItemClick}
                className="sidebar-link"
              >
                <i className={`bi ${item.icon}`} />
                <span>{item.label}</span>
              </Nav.Link>
            ))}
          </div>
        </div>
      ))}
    </Nav>
  )

  return (
    <div className="app-container">
      {/* 1. BARRA LATERAL FIJA EN ESCRITORIO (>= lg) */}
      <aside className="desktop-sidebar d-none d-lg-flex">
        {/* Identidad de marca Academit */}
        <div className="p-3 border-bottom border-secondary border-opacity-25">
          <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 p-2"
              style={{
                backgroundColor: 'var(--m-surface)',
                color: 'var(--m-primary)',
                minWidth: '38px',
                minHeight: '38px',
              }}
            >
              <i className="bi bi-mortarboard-fill fs-5" />
            </div>
            <div>
              <div className="fw-bold fs-5 lh-1" style={{ color: 'var(--m-primary)' }}>
                Academit
              </div>
              <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                Gestión Institucional
              </small>
            </div>
          </Link>
        </div>

        {/* Tarjeta de usuario en sidebar */}
        <div
          className="px-3 py-2 border-bottom border-secondary border-opacity-25"
          style={{ backgroundColor: 'var(--m-surface)' }}
        >
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span
              className="fw-semibold text-truncate small"
              style={{ color: 'var(--m-on-surface)', maxWidth: '140px' }}
            >
              {nombre || usuario}
            </span>
            <Badge bg="secondary" className="small">
              {rol}
            </Badge>
          </div>
          <div className="text-muted" style={{ fontSize: '0.72rem' }}>
            <i className="bi bi-person me-1" />
            @{usuario}
          </div>
        </div>

        {/* Menú de grupos navegables con scroll */}
        <div className="p-3 flex-grow-1 overflow-auto">
          {renderNavGrupos()}
        </div>
      </aside>

      {/* 2. ÁREA DE CONTENIDO Y BARRA SUPERIOR */}
      <div className="content-wrapper">
        {/* Barra superior con Academit, Usuario, Rol y botón Salir */}
        <header className="top-navbar d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            {/* Botón hamburguesa sólo en pantallas chicas (< lg) */}
            <Button
              variant="outline-light"
              size="sm"
              onClick={() => setShowMobileSidebar(true)}
              className="d-lg-none me-3 p-1 px-2 border-secondary d-flex align-items-center justify-content-center"
              aria-label="Abrir menú lateral"
            >
              <i className="bi bi-list fs-5" />
            </Button>

            {/* Nombre de la institución | Página activa */}
            <span className="fw-bold me-2" style={{ color: 'var(--m-primary)' }}>
              Academit
            </span>
            <span className="text-muted me-2 opacity-50">|</span>
            <span
              className="fw-semibold small text-truncate"
              style={{ color: 'var(--m-on-surface)', maxWidth: '300px' }}
            >
              {activeTitle}
            </span>
          </div>

          {/* Datos del usuario y botón Salir en la barra superior */}
          <div className="d-flex align-items-center gap-3">
            <div className="d-none d-sm-flex align-items-center gap-2">
              <span className="small text-muted">{nombre || usuario}</span>
              <Badge bg="secondary" className="text-uppercase small">
                {rol}
              </Badge>
            </div>

            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleLogout}
              className="d-flex align-items-center gap-1 py-1 px-2 fw-semibold"
            >
              <i className="bi bi-box-arrow-right" />
              <span>Salir</span>
            </Button>
          </div>
        </header>

        {/* Alerta descartable superior: 'Vista de maqueta con datos de ejemplo' si VITE_USE_MOCK=true */}
        {isMock && showMockAlert && (
          <Alert
            variant="warning"
            dismissible
            onClose={() => setShowMockAlert(false)}
            className="m-3 mb-0 py-2 px-3 small shadow-sm d-flex align-items-center gap-2"
          >
            <i className="bi bi-info-circle-fill fs-6" />
            <div className="flex-grow-1">
              <strong>Vista de maqueta con datos de ejemplo:</strong> Todas las operaciones simulan su efecto de manera local en el frontend sin comunicarse con un servidor real.
            </div>
          </Alert>
        )}

        {/* 3. BARRA LATERAL OFFCANVAS PARA MÓVILES (< lg) */}
        <Offcanvas
          show={showMobileSidebar}
          onHide={() => setShowMobileSidebar(false)}
          placement="start"
          className="d-lg-none"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title
              className="d-flex align-items-center gap-2 fs-6 fw-bold"
              style={{ color: 'var(--m-primary)' }}
            >
              <i className="bi bi-mortarboard-fill fs-5" />
              <span>Academit</span>
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body className="d-flex flex-column p-0">
            {/* Cabecera del usuario en móvil */}
            <div
              className="p-3 border-bottom border-secondary border-opacity-25"
              style={{ backgroundColor: 'var(--m-surface)' }}
            >
              <div className="fw-semibold" style={{ color: 'var(--m-on-surface)' }}>
                {nombre || usuario}
              </div>
              <div className="d-flex align-items-center justify-content-between mt-1">
                <span className="text-muted small">@{usuario}</span>
                <Badge bg="secondary">{rol}</Badge>
              </div>
            </div>

            {/* Opciones agrupadas */}
            <div className="p-3 flex-grow-1 overflow-auto">
              {renderNavGrupos(() => setShowMobileSidebar(false))}
            </div>

            {/* Botón Salir al pie del drawer móvil */}
            <div className="p-3 border-top border-secondary border-opacity-25 mt-auto">
              <Button
                variant="outline-danger"
                className="w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right" />
                <span className="fw-semibold">Cerrar sesión</span>
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Contenido principal de la página */}
        <main className="p-3 p-lg-4 flex-grow-1">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
