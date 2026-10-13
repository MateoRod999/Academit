# Matriz de Roles y Permisos - Academit

Este documento detalla el modelo de control de acceso del frontend de **Academit**, la matriz de permisos generada a partir de la fuente de verdad `src/config/menu.js`, y la distinción fundamental entre el control visual en la interfaz y la seguridad real del sistema.

---

## 1. Definición de Roles del Sistema

| Rol | Identificador | Descripción del Actor |
| :--- | :--- | :--- |
| **Administrador** | `ADMINISTRADOR` | Máxima autoridad del sistema. Posee acceso total a todos los módulos: configuración institucional, catálogo académico, gestión docente, administrativa y seguridad de usuarios. |
| **Administrativo** | `ADMINISTRATIVO` | Personal de secretaría y tesorería. Gestiona cobranzas, cuotas, matrículas, altas de alumnos e inscripciones a comisiones. En catálogo de carreras, docentes y planes de estudio opera en **Modo Lectura**. |
| **Docente** | `DOCENTE` | Profesores a cargo de cátedras. Gestiona únicamente sus cursos asignados, alta de evaluaciones, carga de calificaciones y toma de asistencia. |
| **Alumno** | `ALUMNO` | Estudiantes regulares. Acceso al portal de autogestión: consulta de su situación académica y de deuda, inscripción a finales, solicitud de trámites y datos de legajo. |

---

## 2. Matriz Rol × Pantalla (Extraída de `src/config/menu.js`)

> **Referencias:**
> - `ED`: Acceso en **Modo Edición** (permite crear, modificar y dar de baja).
> - `LE`: Acceso en **Modo Lectura** (los botones de alta, edición y baja se ocultan automáticamente).
> - `-`: Sin acceso (la opción no se muestra en el menú y la ruta está bloqueada por `ProtectedRoute`).

| Grupo | Pantalla | Ruta | ADMINISTRADOR | ADMINISTRATIVO | DOCENTE | ALUMNO |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| **INICIO** | Inicio / Dashboard | `/` | LE | LE | LE | LE |
| **ACADÉMICO** | Mesas de examen | `/academico/mesas-examen` | LE | - | - | ED |
| | Parciales | `/academico/parciales` | LE | - | - | LE |
| | Trabajos prácticos | `/academico/trabajos-practicos` | LE | - | - | LE |
| | Asistencias (Historial) | `/academico/asistencias` | LE | - | - | LE |
| | Situación académica y arancelaria | `/academico/situacion` | LE | - | - | LE |
| | Plan de estudios y correlativas | `/academico/plan-estudios` | LE | - | - | LE |
| **SOLICITUDES** | Constancias | `/solicitudes/constancias` | - | - | - | ED |
| | Declaración jurada de materias | `/solicitudes/declaracion-jurada` | - | - | - | ED |
| | Inscripción a pasantías | `/solicitudes/pasantias` | - | - | - | ED |
| | Solicitud de título | `/solicitudes/titulo` | - | - | - | ED |
| | Solicitudes académicas | `/solicitudes/academicas` | - | - | - | ED |
| | Bandeja de solicitudes | `/solicitudes/bandeja` | ED | ED | - | - |
| **OTROS** | Mis datos personales | `/otros/mis-datos` | ED | ED | ED | ED |
| | Modificar contraseña | `/otros/cambiar-password` | ED | ED | ED | ED |
| | Documentación académica/legal | `/otros/documentacion` | - | - | - | LE |
| | Cambio de carrera | `/otros/cambio-carrera` | - | - | - | ED |
| | Reincorporación | `/otros/reincorporacion` | - | - | - | ED |
| | Cancelación de matrícula | `/otros/cancelar-matricula` | - | - | - | ED |
| **DOCENCIA** | Mis cursos | `/docencia/mis-cursos` | - | - | LE | - |
| | Evaluaciones | `/docencia/evaluaciones` | - | - | ED | - |
| | Calificaciones | `/docencia/calificaciones` | - | - | ED | - |
| | Asistencias (Tomar lista) | `/docencia/asistencias` | - | - | ED | - |
| **GESTIÓN ACADÉMICA** | Alumnos | `/gestion/alumnos` | ED | ED | - | - |
| | Carreras | `/gestion/carreras` | ED | LE | - | - |
| | Docentes | `/gestion/docentes` | ED | LE | - | - |
| | Cursos / Comisiones | `/gestion/cursos` | ED | - | - | - |
| | Materias | `/gestion/materias` | ED | - | - | - |
| | Ciclos lectivos | `/gestion/ciclos-lectivos` | ED | - | - | - |
| | Plan de estudios y correlativas | `/gestion/plan-estudios` | ED | LE | - | - |
| | Asignaciones docente-cátedra | `/gestion/asignaciones` | ED | LE | - | - |
| | Mesas de examen (Gestión) | `/gestion/mesas-examen` | ED | - | - | - |
| | Inscripciones a cursos | `/gestion/inscripciones` | ED | ED | - | - |
| **ADMINISTRATIVO** | Matrículas | `/administrativo/matriculas` | ED | ED | - | - |
| | Cuotas y Seguros | `/administrativo/cuotas` | ED | ED | - | - |
| | Registro de pagos | `/administrativo/pagos` | ED | ED | - | - |
| | Situación alumno | `/administrativo/situacion-alumno` | LE | LE | - | - |
| | Deuda de alumnos | `/administrativo/deudas` | LE | LE | - | - |
| **SISTEMA** | Usuarios y roles | `/sistema/usuarios` | ED | - | - | - |

---

## 3. Seguridad Real vs. Control de Interfaz

> [!WARNING]
> **El control de rutas y modos en el frontend es EXCLUSIVAMENTE para la experiencia de usuario (UX).**
> Ninguna verificación en React garantiza la seguridad de la información.

### Principio de Seguridad en el Backend
1. **HTTP 401 Unauthorized:** Si una petición no incluye credenciales de autenticación válidas (JWT o sesión HTTP activa).
2. **HTTP 403 Forbidden:** Si el usuario autenticado intenta ejecutar una operación REST sobre un endpoint para el cual su rol carece de privilegios (por ejemplo, si un `DOCENTE` o un `ALUMNO` envía un `POST /api/cursos` o `DELETE /api/alumnos/1`).
3. **Validación de identidad:** En las operaciones del alumno (`GET /api/alumnos/{id}/situacion-academica`, `POST /api/mesas-examen/{id}/inscribir`), el backend debe extraer el identificador del alumno del token de seguridad y rechazar cualquier intento de operar sobre datos ajenos.
