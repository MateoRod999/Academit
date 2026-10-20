import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { MENU_GRUPOS } from '../config/menu'

export const Layout = ({ children }) => {
  const { isAuthenticated, rol, nombre, usuario, logout } = useAuth()
  const [showMockAlert, setShowMockAlert] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  const isMock = import.meta.env.VITE_USE_MOCK === 'true'

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

  // Índice del grupo correspondiente a la ruta actual
  const currentGroupIndex = gruposVisibles.findIndex((g) =>
    g.items.some((item) => item.path === location.pathname)
  )

  const [grupoAbierto, setGrupoAbierto] = useState(
    currentGroupIndex !== -1 ? currentGroupIndex : 0
  )

  // Sincronizar el grupo abierto al navegar
  useEffect(() => {
    if (currentGroupIndex !== -1) {
      setGrupoAbierto(currentGroupIndex)
    }
  }, [location.pathname, currentGroupIndex])

  // Si no está autenticado o está en login, renderizar children directamente
  if (!isAuthenticated || location.pathname === '/login') {
    return <main>{children}</main>
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const formatRol = (r) => {
    if (!r) return ''
    if (r === 'ALUMNO') return 'Alumno'
    if (r === 'DOCENTE') return 'Docente'
    if (r === 'ADMINISTRATIVO') return 'Administrativo'
    if (r === 'ADMINISTRADOR') return 'Administrador'
    return r.charAt(0) + r.slice(1).toLowerCase()
  }

  const grupoActivo = gruposVisibles[grupoAbierto] || gruposVisibles[0]

  return (
    <div className="app-container">
      {/* Cabecera institucional con escudo, marca y menú por grupos */}
      <header className="cabecera">
        <div className="gutter">
          <div className="contenedor">
            <div className="cab-fila">
              <Link to="/" className="marca">
                <svg
                  className="escudo"
                  width="44"
                  height="44"
                  viewBox="0 0 56 56"
                  aria-hidden="true"
                >
                  <circle cx="28" cy="28" r="26" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="28" cy="28" r="21" fill="none" stroke="currentColor" strokeWidth=".8" />
                  <text
                    x="28"
                    y="37"
                    textAnchor="middle"
                    fontFamily="Georgia, serif"
                    fontSize="27"
                    fontWeight="700"
                    fill="currentColor"
                  >
                    A
                  </text>
                </svg>
                <div>
                  <b>Academit</b>
                  <small>Instituto de formación superior</small>
                </div>
              </Link>

              <div className="usuario">
                <div>
                  <b>{nombre || usuario}</b> <span>{formatRol(rol)}</span>
                </div>
                <button
                  className="salir"
                  type="button"
                  onClick={handleLogout}
                  aria-label="Cerrar sesión"
                >
                  Salir
                </button>
              </div>
            </div>

            {/* Menú de grupos como pestañas horizontales */}
            <nav className="menu" aria-label="Navegación principal">
              {gruposVisibles.map((grupo, idx) => {
                const esGrupoActual = grupo.items.some((it) => it.path === location.pathname)
                const estaAbierto = grupoAbierto === idx
                return (
                  <button
                    key={grupo.id}
                    type="button"
                    aria-expanded={estaAbierto}
                    className={esGrupoActual ? 'actual' : ''}
                    onClick={() => setGrupoAbierto(idx)}
                  >
                    {grupo.titulo}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Franja de submenú que muestra los ítems del grupo seleccionado */}
      {grupoActivo && (
        <nav className="submenu" aria-label="Submenú de sección">
          <div className="gutter">
            <div className="contenedor">
              <ul>
                {grupoActivo.items.map((item) => (
                  <li key={item.path}>
                    {item.component ? (
                      <NavLink
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) => (isActive ? 'activo' : '')}
                      >
                        {item.label}
                      </NavLink>
                    ) : (
                      <span className="no" title="Pantalla no implementada">
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      )}

      {/* Alerta de maqueta si VITE_USE_MOCK=true */}
      {isMock && showMockAlert && (
        <div className="gutter pt-3">
          <div className="contenedor">
            <Alert
              variant="warning"
              dismissible
              transition={false}
              onClose={() => setShowMockAlert(false)}
              className="py-2 px-3 small d-flex justify-content-between align-items-center mb-0"
              style={{ backgroundColor: 'var(--papel)', borderColor: 'var(--acento)', color: 'var(--texto)' }}
            >
              <div>
                <strong>Vista de maqueta:</strong> Operaciones simuladas en memoria local.
              </div>
            </Alert>
          </div>
        </div>
      )}

      {/* Contenido principal centrado de máximo 1180px */}
      <main className="pagina gutter">
        <div className="contenedor">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
