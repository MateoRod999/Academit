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

          <div className="d-flex flex-column mt-1">
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
        <div className="p-3 border-bottom" style={{ borderColor: '#36312F' }}>
          <Link to="/" className="text-decoration-none d-block">
            <div className="sidebar-brand">Academit</div>
            <div className="sidebar-brand-subtitle">Gestión Institucional</div>
          </Link>
        </div>

        {/* Tarjeta de usuario en sidebar */}
        <div className="sidebar-user-panel">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span
              className="fw-semibold text-truncate small"
              style={{ maxWidth: '140px', color: 'var(--sidebar-texto)' }}
            >
              {nombre || usuario}
            </span>
            <Badge bg="secondary" className="small">
              {rol}
            </Badge>
          </div>
          <div className="small" style={{ fontSize: '0.72rem', color: 'var(--sidebar-grupos)' }}>
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
            {/* Botón menú simple en pantallas chicas (< lg), sin animación */}
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowMobileSidebar(true)}
              className="d-lg-none me-3 py-1 px-2 border"
              aria-label="Abrir menú"
            >
              Menú
            </Button>

            {/* Nombre de la institución | Página activa */}
            <span className="fw-bold me-2 academic-serif" style={{ fontSize: '1.15rem', color: 'var(--texto)' }}>
              Academit
            </span>
            <span className="text-muted me-2 opacity-50">|</span>
            <span
              className="small text-truncate"
              style={{ color: 'var(--texto-secundario)', maxWidth: '300px' }}
            >
              {activeTitle}
            </span>
          </div>

          {/* Datos del usuario y botón Salir en la barra superior */}
          <div className="d-flex align-items-center gap-3">
            <div className="d-none d-sm-flex align-items-center gap-2">
              <span className="small" style={{ color: 'var(--texto)' }}>{nombre || usuario}</span>
              <Badge bg="secondary" className="text-uppercase small">
                {rol}
              </Badge>
            </div>

            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleLogout}
              className="py-1 px-2"
            >
              Salir
            </Button>
          </div>
        </header>

        {/* Alerta de maqueta descartable sin animación */}
        {isMock && showMockAlert && (
          <div className="content-container pb-0 pt-3">
            <Alert
              variant="warning"
              dismissible
              transition={false}
              onClose={() => setShowMockAlert(false)}
              className="mb-0 py-2 px-3 small d-flex align-items-center justify-content-between"
            >
              <div>
                <strong>Vista de maqueta:</strong> Todas las operaciones simulan su efecto de manera local en el frontend sin comunicarse con un servidor real.
              </div>
            </Alert>
          </div>
        )}

        {/* 3. BARRA LATERAL OFFCANVAS PARA MÓVILES (< lg) SIN ANIMACIÓN */}
        <Offcanvas
          show={showMobileSidebar}
          onHide={() => setShowMobileSidebar(false)}
          placement="start"
          className="d-lg-none"
          animation={false}
          style={{
            backgroundColor: 'var(--sidebar-fondo)',
            color: 'var(--sidebar-texto)',
            width: '260px',
            borderRight: '1px solid var(--borde-fuerte)',
          }}
        >
          <Offcanvas.Header closeButton closeVariant="white" style={{ borderBottom: '1px solid #36312F' }}>
            <Offcanvas.Title className="sidebar-brand fs-5">
              Academit
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body className="d-flex flex-column p-0">
            <div className="sidebar-user-panel">
              <div className="fw-semibold small" style={{ color: 'var(--sidebar-texto)' }}>
                {nombre || usuario}
              </div>
              <div className="d-flex align-items-center justify-content-between mt-1">
                <span className="small" style={{ fontSize: '0.72rem', color: 'var(--sidebar-grupos)' }}>@{usuario}</span>
                <Badge bg="secondary">{rol}</Badge>
              </div>
            </div>

            <div className="p-3 flex-grow-1 overflow-auto">
              {renderNavGrupos(() => setShowMobileSidebar(false))}
            </div>

            <div className="p-3 border-top mt-auto" style={{ borderColor: '#36312F' }}>
              <Button
                variant="outline-danger"
                className="w-100 py-2"
                onClick={handleLogout}
              >
                Cerrar sesión
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Contenido principal de la página (máximo 1200px) */}
        <main className="content-container">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
