import InicioPage from '../pages/inicio/InicioPage'
// Académico
import MesasExamenPage from '../pages/academico/MesasExamenPage'
import ParcialesPage from '../pages/academico/ParcialesPage'
import TrabajosPracticosPage from '../pages/academico/TrabajosPracticosPage'
import AsistenciasAlumnoPage from '../pages/academico/AsistenciasAlumnoPage'
import SituacionAcademicaArancelariaPage from '../pages/academico/SituacionAcademicaArancelariaPage'
import PlanEstudiosAlumnoPage from '../pages/academico/PlanEstudiosAlumnoPage'
// Solicitudes
import ConstanciasPage from '../pages/solicitudes/ConstanciasPage'
import DeclaracionJuradaPage from '../pages/solicitudes/DeclaracionJuradaPage'
import PasantiasPage from '../pages/solicitudes/PasantiasPage'
import SolicitudTituloPage from '../pages/solicitudes/SolicitudTituloPage'
import SolicitudesAcademicasPage from '../pages/solicitudes/SolicitudesAcademicasPage'
import BandejaSolicitudesPage from '../pages/solicitudes/BandejaSolicitudesPage'
// Otros
import MisDatosPage from '../pages/otros/MisDatosPage'
import CambiarPasswordPage from '../pages/otros/CambiarPasswordPage'
import DocumentacionPage from '../pages/otros/DocumentacionPage'
import CambioCarreraPage from '../pages/otros/CambioCarreraPage'
import ReincorporacionPage from '../pages/otros/ReincorporacionPage'
import CancelarMatriculaPage from '../pages/otros/CancelarMatriculaPage'
// Docencia
import MisCursosPage from '../pages/docencia/MisCursosPage'
import EvaluacionesDocentePage from '../pages/docencia/EvaluacionesDocentePage'
import CalificacionesDocentePage from '../pages/docencia/CalificacionesDocentePage'
import AsistenciasDocentePage from '../pages/docencia/AsistenciasDocentePage'
// Gestión Académica
import GestionAlumnosPage from '../pages/gestion/GestionAlumnosPage'
import GestionDocentesPage from '../pages/gestion/GestionDocentesPage'
import GestionCursosPage from '../pages/gestion/GestionCursosPage'
import GestionMateriasPage from '../pages/gestion/GestionMateriasPage'
import GestionCiclosLectivosPage from '../pages/gestion/GestionCiclosLectivosPage'
import GestionPlanEstudiosPage from '../pages/gestion/GestionPlanEstudiosPage'
import GestionAsignacionesPage from '../pages/gestion/GestionAsignacionesPage'
import GestionMesasPage from '../pages/gestion/GestionMesasPage'
import GestionInscripcionesPage from '../pages/gestion/GestionInscripcionesPage'
// Administrativo
import AdminMatriculasPage from '../pages/administrativo/AdminMatriculasPage'
import AdminCuotasPage from '../pages/administrativo/AdminCuotasPage'
import AdminPagosPage from '../pages/administrativo/AdminPagosPage'
import AdminSituacionAlumnoPage from '../pages/administrativo/AdminSituacionAlumnoPage'
import AdminDeudasPage from '../pages/administrativo/AdminDeudasPage'
// Sistema
import GestionUsuariosPage from '../pages/sistema/GestionUsuariosPage'

/**
 * FUENTE ÚNICA DE VERDAD: Menú y Rutas de Academit.
 * Cada grupo define sus opciones, rutas, roles permitidos, íconos de Bootstrap y componentes.
 */
export const MENU_GRUPOS = [
  {
    id: 'inicio',
    titulo: 'INICIO',
    items: [
      {
        path: '/',
        label: 'Inicio',
        icon: 'bi-house-door',
        roles: ['ADMINISTRADOR', 'ADMINISTRATIVO', 'DOCENTE', 'ALUMNO'],
        component: InicioPage,
        rf: 'Portal general',
      },
    ],
  },
  {
    id: 'academico',
    titulo: 'ACADÉMICO',
    items: [
      {
        path: '/academico/mesas-examen',
        label: 'Mesas de examen',
        icon: 'bi-calendar2-check',
        roles: ['ALUMNO', 'ADMINISTRADOR'],
        component: MesasExamenPage,
        rf: 'RF49, RF50',
      },
      {
        path: '/academico/parciales',
        label: 'Parciales',
        icon: 'bi-journal-text',
        roles: ['ALUMNO', 'ADMINISTRADOR'],
        component: ParcialesPage,
        rf: 'Consulta parciales',
      },
      {
        path: '/academico/trabajos-practicos',
        label: 'Trabajos prácticos',
        icon: 'bi-file-earmark-code',
        roles: ['ALUMNO', 'ADMINISTRADOR'],
        component: TrabajosPracticosPage,
        rf: 'Consulta TPs',
      },
      {
        path: '/academico/asistencias',
        label: 'Asistencias',
        icon: 'bi-clock-history',
        roles: ['ALUMNO', 'ADMINISTRADOR'],
        component: AsistenciasAlumnoPage,
        rf: 'Historial asistencia',
      },
      {
        path: '/academico/situacion',
        label: 'Situación académica y arancelaria',
        icon: 'bi-card-checklist',
        roles: ['ALUMNO', 'ADMINISTRADOR'],
        component: SituacionAcademicaArancelariaPage,
        rf: 'Situación integral',
      },
      {
        path: '/academico/plan-estudios',
        label: 'Plan de estudios y correlativas',
        icon: 'bi-diagram-3',
        roles: ['ALUMNO', 'ADMINISTRADOR'],
        component: PlanEstudiosAlumnoPage,
        rf: 'RF48',
      },
    ],
  },
  {
    id: 'solicitudes',
    titulo: 'SOLICITUDES',
    items: [
      {
        path: '/solicitudes/constancias',
        label: 'Constancias',
        icon: 'bi-file-earmark-text',
        roles: ['ALUMNO'],
        component: ConstanciasPage,
        rf: 'Adicional (fuera del análisis)',
      },
      {
        path: '/solicitudes/declaracion-jurada',
        label: 'Declaración jurada de materias',
        icon: 'bi-pencil-square',
        roles: ['ALUMNO'],
        component: DeclaracionJuradaPage,
        rf: 'RF51',
      },
      {
        path: '/solicitudes/pasantias',
        label: 'Inscripción a pasantías',
        icon: 'bi-briefcase',
        roles: ['ALUMNO'],
        component: PasantiasPage,
        rf: 'Adicional (fuera del análisis)',
      },
      {
        path: '/solicitudes/titulo',
        label: 'Solicitud de título',
        icon: 'bi-award',
        roles: ['ALUMNO'],
        component: SolicitudTituloPage,
        rf: 'Adicional (fuera del análisis)',
      },
      {
        path: '/solicitudes/academicas',
        label: 'Solicitudes académicas',
        icon: 'bi-send',
        roles: ['ALUMNO'],
        component: SolicitudesAcademicasPage,
        rf: 'Adicional (fuera del análisis)',
      },
      {
        path: '/solicitudes/bandeja',
        label: 'Bandeja de solicitudes',
        icon: 'bi-inbox',
        roles: ['ADMINISTRATIVO', 'ADMINISTRADOR'],
        component: BandejaSolicitudesPage,
        rf: 'Adicional (fuera del análisis)',
      },
    ],
  },
  {
    id: 'otros',
    titulo: 'OTROS',
    items: [
      {
        path: '/otros/mis-datos',
        label: 'Mis datos personales',
        icon: 'bi-person-badge',
        roles: ['ADMINISTRADOR', 'ADMINISTRATIVO', 'DOCENTE', 'ALUMNO'],
        component: MisDatosPage,
        rf: 'Perfil personal',
      },
      {
        path: '/otros/cambiar-password',
        label: 'Modificar contraseña',
        icon: 'bi-key',
        roles: ['ADMINISTRADOR', 'ADMINISTRATIVO', 'DOCENTE', 'ALUMNO'],
        component: CambiarPasswordPage,
        rf: 'Seguridad de cuenta',
      },
      {
        path: '/otros/documentacion',
        label: 'Documentación académica/legal',
        icon: 'bi-folder-check',
        roles: ['ALUMNO'],
        component: DocumentacionPage,
        rf: 'Adicional (fuera del análisis)',
      },
      {
        path: '/otros/cambio-carrera',
        label: 'Cambio de carrera',
        icon: 'bi-arrow-left-right',
        roles: ['ALUMNO'],
        component: CambioCarreraPage,
        rf: 'Adicional (fuera del análisis)',
      },
      {
        path: '/otros/reincorporacion',
        label: 'Reincorporación',
        icon: 'bi-arrow-repeat',
        roles: ['ALUMNO'],
        component: ReincorporacionPage,
        rf: 'Adicional (fuera del análisis)',
      },
      {
        path: '/otros/cancelar-matricula',
        label: 'Cancelación de matrícula',
        icon: 'bi-x-circle',
        roles: ['ALUMNO'],
        component: CancelarMatriculaPage,
        rf: 'RF27',
      },
    ],
  },
  {
    id: 'docencia',
    titulo: 'DOCENCIA',
    items: [
      {
        path: '/docencia/mis-cursos',
        label: 'Mis cursos',
        icon: 'bi-collection',
        roles: ['DOCENTE'],
        component: MisCursosPage,
        rf: 'Gestión cátedras',
      },
      {
        path: '/docencia/evaluaciones',
        label: 'Evaluaciones',
        icon: 'bi-clipboard2-check',
        roles: ['DOCENTE'],
        component: EvaluacionesDocentePage,
        rf: 'Alta de evaluaciones',
      },
      {
        path: '/docencia/calificaciones',
        label: 'Calificaciones',
        icon: 'bi-award-fill',
        roles: ['DOCENTE'],
        component: CalificacionesDocentePage,
        rf: 'Carga de notas',
      },
      {
        path: '/docencia/asistencias',
        label: 'Asistencias',
        icon: 'bi-calendar-check',
        roles: ['DOCENTE'],
        component: AsistenciasDocentePage,
        rf: 'Toma de asistencia',
      },
    ],
  },
  {
    id: 'gestion',
    titulo: 'GESTIÓN ACADÉMICA',
    items: [
      {
        path: '/gestion/alumnos',
        label: 'Alumnos',
        icon: 'bi-people',
        roles: ['ADMINISTRADOR', 'ADMINISTRATIVO'],
        component: GestionAlumnosPage,
        rf: 'CRUD Alumnos (Referencia)',
      },
      {
        path: '/gestion/docentes',
        label: 'Docentes',
        icon: 'bi-person-video3',
        roles: ['ADMINISTRADOR'],
        component: GestionDocentesPage,
        rf: 'CRUD Docentes',
      },
      {
        path: '/gestion/cursos',
        label: 'Cursos',
        icon: 'bi-building',
        roles: ['ADMINISTRADOR'],
        component: GestionCursosPage,
        rf: 'Control de cupos y cursos',
      },
      {
        path: '/gestion/materias',
        label: 'Materias',
        icon: 'bi-book',
        roles: ['ADMINISTRADOR'],
        component: GestionMateriasPage,
        rf: 'Catálogo de materias',
      },
      {
        path: '/gestion/ciclos-lectivos',
        label: 'Ciclos lectivos',
        icon: 'bi-calendar-range',
        roles: ['ADMINISTRADOR'],
        component: GestionCiclosLectivosPage,
        rf: 'Gestión ciclos lectivos',
      },
      {
        path: '/gestion/plan-estudios',
        label: 'Plan de estudios y correlativas',
        icon: 'bi-diagram-3-fill',
        roles: ['ADMINISTRADOR'],
        component: GestionPlanEstudiosPage,
        rf: 'Gestión plan de estudios',
      },
      {
        path: '/gestion/asignaciones',
        label: 'Asignaciones docente-curso-materia',
        icon: 'bi-link-45deg',
        roles: ['ADMINISTRADOR'],
        component: GestionAsignacionesPage,
        rf: 'Asignación de cátedras',
      },
      {
        path: '/gestion/mesas-examen',
        label: 'Mesas de examen',
        icon: 'bi-calendar-plus',
        roles: ['ADMINISTRADOR'],
        component: GestionMesasPage,
        rf: 'Programación de mesas',
      },
      {
        path: '/gestion/inscripciones',
        label: 'Inscripciones a cursos',
        icon: 'bi-journal-plus',
        roles: ['ADMINISTRADOR', 'ADMINISTRATIVO'],
        component: GestionInscripcionesPage,
        rf: 'Inscripción y cupos',
      },
    ],
  },
  {
    id: 'administrativo',
    titulo: 'ADMINISTRATIVO',
    items: [
      {
        path: '/administrativo/matriculas',
        label: 'Matrículas',
        icon: 'bi-card-heading',
        roles: ['ADMINISTRATIVO', 'ADMINISTRADOR'],
        component: AdminMatriculasPage,
        rf: 'Gestión matrículas',
      },
      {
        path: '/administrativo/cuotas',
        label: 'Cuotas',
        icon: 'bi-receipt',
        roles: ['ADMINISTRATIVO', 'ADMINISTRADOR'],
        component: AdminCuotasPage,
        rf: 'Gestión cuotas y seguros',
      },
      {
        path: '/administrativo/pagos',
        label: 'Registro de pagos',
        icon: 'bi-cash-coin',
        roles: ['ADMINISTRATIVO', 'ADMINISTRADOR'],
        component: AdminPagosPage,
        rf: 'Cobro de cuotas completas',
      },
      {
        path: '/administrativo/situacion-alumno',
        label: 'Situación administrativa alumno',
        icon: 'bi-search',
        roles: ['ADMINISTRATIVO', 'ADMINISTRADOR'],
        component: AdminSituacionAlumnoPage,
        rf: 'Auditoría financiera alumno',
      },
      {
        path: '/administrativo/deudas',
        label: 'Deuda de alumnos',
        icon: 'bi-exclamation-octagon',
        roles: ['ADMINISTRATIVO', 'ADMINISTRADOR'],
        component: AdminDeudasPage,
        rf: 'Reporte de morosidad',
      },
    ],
  },
  {
    id: 'sistema',
    titulo: 'SISTEMA',
    items: [
      {
        path: '/sistema/usuarios',
        label: 'Usuarios y roles',
        icon: 'bi-shield-lock',
        roles: ['ADMINISTRADOR'],
        component: GestionUsuariosPage,
        rf: 'Gestión usuarios y permisos',
      },
    ],
  },
]
