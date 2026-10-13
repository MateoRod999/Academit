# Estructura del Proyecto Frontend - Academit

Este documento detalla la organización de carpetas del código fuente (`frontend/src/`), la responsabilidad asignada a cada capa arquitectónica y las convenciones de nomenclatura adoptadas en el proyecto.

---

## 1. Árbol de Carpetas (`src/`)

```
frontend/src/
├── api/                        # Capa de comunicación HTTP y servicios cliente
│   ├── mocks/
│   │   └── data.js             # Banco único de datos mockeados en memoria (mockDb)
│   ├── client.js               # Instancia de Axios configurada y flag isMock
│   ├── alumnos.js              # Servicios REST para gestión de alumnos
│   ├── asignaciones.js         # Servicios para asignaciones docente-cátedra
│   ├── asistencias.js          # Servicios para toma y consulta de asistencias
│   ├── auth.js                 # Autenticación, login y cambio de contraseña
│   ├── calificaciones.js       # Servicios de carga y auditoría de notas
│   ├── carreras.js             # Servicios para carreras y planes de estudio
│   ├── ciclosLectivos.js       # Servicios para períodos y ciclos lectivos
│   ├── cuotas.js               # Servicios para cuotas mensuales y seguros
│   ├── cursos.js               # Servicios para comisiones y cupos
│   ├── docentes.js             # Servicios para padrón de docentes
│   ├── documentacion.js        # Requisitos de legajo del estudiante
│   ├── evaluaciones.js         # Planificación de parciales y TPs por cátedra
│   ├── inscripciones.js        # Matriculación de alumnos en cursos
│   ├── materias.js             # Catálogo de materias y correlatividades
│   ├── matriculas.js           # Matrículas anuales y cancelaciones
│   ├── mesasExamen.js          # Mesas de exámenes finales y turnos
│   ├── pagos.js                # Registro de cobros y medios de pago
│   ├── solicitudes.js          # Gestión y resolución de trámites estudiantiles
│   └── usuarios.js             # Cuentas de usuario y asignación de roles
│
├── components/                 # Componentes compartidos y reutilizables
│   ├── AppToast.jsx            # Contenedor de notificaciones flotantes contextuales
│   ├── ConfirmModal.jsx        # Diálogo modal reutilizable para confirmaciones
│   ├── DataTable.jsx           # Tabla con buscador en vivo y paginación
│   ├── EmptyState.jsx          # Estado visual ante listas vacías o sin resultados
│   ├── FormModal.jsx           # Modal contenedor de formularios con estado de carga
│   ├── Layout.jsx              # Estructura portal (navbar superior + sidebar + offcanvas)
│   ├── PageHeader.jsx          # Encabezado estándar de cada pantalla con título y acciones
│   ├── ProtectedRoute.jsx      # Guardián de rutas según rol autenticado
│   ├── SolicitudForm.jsx       # Formulario genérico para emisión de trámites
│   └── StatusBadge.jsx         # Insignia de color para estados (ACTIVA, PAGADA, etc.)
│
├── config/                     # Configuraciones transversales del sistema
│   └── menu.js                 # Fuente única de verdad de navegación, grupos, permisos y modos
│
├── context/                    # Estados globales con React Context API
│   ├── AuthContext.jsx         # Estado de sesión (usuario, nombre, rol, token simulado)
│   └── ToastContext.jsx        # Manejador de notificaciones visuales tipo Toast
│
├── hooks/                      # Custom hooks reutilizables
│   └── useModo.js              # Hook que retorna el modo activo ('edicion' | 'lectura')
│
├── pages/                      # Vistas organizadas por grupo temático
│   ├── inicio/
│   │   └── InicioPage.jsx      # Panel de bienvenida y tarjetas de resumen
│   ├── academico/              # Vistas de consulta académica del estudiante
│   │   ├── AsistenciasAlumnoPage.jsx
│   │   ├── MesasExamenPage.jsx
│   │   ├── ParcialesPage.jsx
│   │   ├── PlanEstudiosAlumnoPage.jsx
│   │   ├── SituacionAcademicaArancelariaPage.jsx
│   │   └── TrabajosPracticosPage.jsx
│   ├── solicitudes/            # Formularios y bandeja de trámites estudiantiles
│   │   ├── BandejaSolicitudesPage.jsx
│   │   ├── ConstanciasPage.jsx
│   │   ├── DeclaracionJuradaPage.jsx
│   │   ├── PasantiasPage.jsx
│   │   ├── SolicitudTituloPage.jsx
│   │   └── SolicitudesAcademicasPage.jsx
│   ├── otros/                  # Trámites y configuraciones adicionales
│   │   ├── CambiarPasswordPage.jsx
│   │   ├── CambioCarreraPage.jsx
│   │   ├── CancelarMatriculaPage.jsx
│   │   ├── DocumentacionPage.jsx
│   │   ├── MisDatosPage.jsx
│   │   └── ReincorporacionPage.jsx
│   ├── docencia/               # Operaciones del cuerpo docente
│   │   ├── AsistenciasDocentePage.jsx
│   │   ├── CalificacionesDocentePage.jsx
│   │   ├── EvaluacionesDocentePage.jsx
│   │   └── MisCursosPage.jsx
│   ├── gestion/                # Administración académica
│   │   ├── GestionAlumnosPage.jsx
│   │   ├── GestionAsignacionesPage.jsx
│   │   ├── GestionCarrerasPage.jsx
│   │   ├── GestionCiclosLectivosPage.jsx
│   │   ├── GestionCursosPage.jsx
│   │   ├── GestionDocentesPage.jsx
│   │   ├── GestionInscripcionesPage.jsx
│   │   ├── GestionMateriasPage.jsx
│   │   ├── GestionMesasPage.jsx
│   │   └── GestionPlanEstudiosPage.jsx
│   ├── administrativo/         # Operaciones arancelarias y de cobranza
│   │   ├── AdminCuotasPage.jsx
│   │   ├── AdminDeudasPage.jsx
│   │   ├── AdminMatriculasPage.jsx
│   │   ├── AdminPagosPage.jsx
│   │   └── AdminSituacionAlumnoPage.jsx
│   ├── sistema/                # Mantenimiento y seguridad
│   │   └── GestionUsuariosPage.jsx
│   ├── Login.jsx               # Pantalla pública de acceso
│   └── NotFound.jsx            # Vista 404 ante rutas no registradas
│
├── App.jsx                     # Componente raíz envuelto en AuthProvider y ToastProvider
├── index.css                   # Sistema de diseño con variables CSS y tema oscuro/cálido
├── main.jsx                    # Punto de montaje de ReactDOM con BrowserRouter
└── routes.jsx                  # Generador dinámico de rutas basado en config/menu.js
```

---

## 2. Responsabilidades por Capa

### `src/api/`
- Centraliza todas las llamadas HTTP hacia el backend mediante una instancia de Axios (`client.js`).
- Evalúa el flag `isMock` (`VITE_USE_MOCK === 'true'`). Si está activo, simula la respuesta asíncrona manipulando `mockDb`.
- **Regla estricta:** Las pantallas de la aplicación **nunca importan `mockDb` directamente**; consumen exclusivamente las funciones de servicio exportadas por esta capa.
- Cada función incluye documentación JSDoc con el método HTTP y el endpoint REST (`GET /api/alumnos`, `POST /api/cursos`, etc.).

### `src/components/`
- Componentes reutilizables sin acoplamiento a una entidad de negocio específica.
- Proveen uniformidad en la experiencia de usuario: tablas paginadas, modales de confirmación, badges de estado consistentes y alertas.

### `src/config/menu.js`
- Constituye la **fuente única de verdad** para:
  - Estructura de navegación por grupos del menú lateral.
  - Generación dinámica de rutas en `routes.jsx`.
  - Roles autorizados para acceder a cada pantalla.
  - Modo operativo (`'edicion'` o `'lectura'`) asignado a cada pantalla según el rol activo.

### `src/pages/`
- Organizadas en subcarpetas temáticas que reflejan los grupos del menú: `inicio`, `academico`, `solicitudes`, `otros`, `docencia`, `gestion`, `administrativo`, `sistema`.
- Cada página orquesta la llamada a sus servicios de `src/api/`, maneja estados locales de formulario y filtros, y utiliza los componentes compartidos.

---

## 3. Convenciones de Nomenclatura

1. **Archivos de componentes y páginas:** Notación `PascalCase` con sufijo descriptivo (ej. `GestionAlumnosPage.jsx`, `PageHeader.jsx`, `StatusBadge.jsx`).
2. **Archivos de servicios API y utilitarios:** Notación `camelCase` (ej. `carreras.js`, `mesasExamen.js`, `useModo.js`).
3. **Nombres de atributos del modelo de datos:** Notación `camelCase` alineada con las columnas del DER del sistema (`idAlumno`, `idCarrera`, `fechaVencimiento`, `medioPago`, `estadoMatricula`).
4. **Constantes y listas estáticas:** Notación `UPPER_SNAKE_CASE` (ej. `MENU_GRUPOS`).
5. **Estilos y variables CSS:** Notación `kebab-case` con prefijo temático (ej. `--m-primary`, `--m-surface`, `.sidebar-link`).
