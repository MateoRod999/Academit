# Mapa de Pantallas y Trazabilidad de Requisitos - Academit

Este documento detalla la estructura completa de navegación, rutas, grupos temáticos, roles autorizados y la trazabilidad con los requisitos funcionales (RF) implementados en la maqueta del frontend de **Academit**.

## Convención de Estados y Requisitos
- **Estado: `maqueta`**: Todas las pantallas se encuentran completamente diseñadas e interactivas con datos de prueba coherentes (`VITE_USE_MOCK=true`), componentes modales, toasts y listas para conectarse al backend real mediante la capa `src/api/`.
- **Adicional (fuera del análisis)**: Identifica aquellas pantallas complementarias del portal universitario de autogestión que no forman parte del alcance de los requisitos RF01 a RF57 del Entregable 1.

---

## Tabla General de Pantallas, Rutas y Permisos

| Pantalla | Ruta | Grupo | Roles Permitidos | Modo | Requisitos Relacionados | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Inicio / Dashboard** | `/` | INICIO | ADMINISTRADOR, ADMINISTRATIVO, DOCENTE, ALUMNO | Lectura | Resumen según rol (próxima cuota, mesa y carrera) | maqueta |
| **Mesas de examen** | `/academico/mesas-examen` | ACADÉMICO | ALUMNO, ADMINISTRADOR | Edición (ALU) / Lectura (ADM) | RF49, RF50 | maqueta |
| **Parciales** | `/academico/parciales` | ACADÉMICO | ALUMNO, ADMINISTRADOR | Lectura | Consulta de evaluaciones parciales | maqueta |
| **Trabajos prácticos** | `/academico/trabajos-practicos` | ACADÉMICO | ALUMNO, ADMINISTRADOR | Lectura | Consulta de trabajos prácticos | maqueta |
| **Asistencias (Historial)** | `/academico/asistencias` | ACADÉMICO | ALUMNO, ADMINISTRADOR | Lectura | Historial y porcentaje de asistencia | maqueta |
| **Situación académica y arancelaria** | `/academico/situacion` | ACADÉMICO | ALUMNO, ADMINISTRADOR | Lectura | Notas (aprobado >= 4), matrícula, 12 cuotas y 3 seguros | maqueta |
| **Plan de estudios y correlativas** | `/academico/plan-estudios` | ACADÉMICO | ALUMNO, ADMINISTRADOR | Lectura | RF48 | maqueta |
| **Constancias** | `/solicitudes/constancias` | SOLICITUDES | ALUMNO | Edición | **Adicional (fuera del análisis)** | maqueta |
| **Declaración jurada de materias** | `/solicitudes/declaracion-jurada` | SOLICITUDES | ALUMNO | Edición | RF51 | maqueta |
| **Inscripción a pasantías** | `/solicitudes/pasantias` | SOLICITUDES | ALUMNO | Edición | **Adicional (fuera del análisis)** | maqueta |
| **Solicitud de título** | `/solicitudes/titulo` | SOLICITUDES | ALUMNO | Edición | **Adicional (fuera del análisis)** | maqueta |
| **Solicitudes académicas** | `/solicitudes/academicas` | SOLICITUDES | ALUMNO | Edición | **Adicional (fuera del análisis)** | maqueta |
| **Bandeja de solicitudes** | `/solicitudes/bandeja` | SOLICITUDES | ADMINISTRATIVO, ADMINISTRADOR | Edición | **Adicional (fuera del análisis)** | maqueta |
| **Mis datos personales** | `/otros/mis-datos` | OTROS | ADMINISTRADOR, ADMINISTRATIVO, DOCENTE, ALUMNO | Edición | Consulta y actualización de datos de perfil | maqueta |
| **Modificar contraseña** | `/otros/cambiar-password` | OTROS | ADMINISTRADOR, ADMINISTRATIVO, DOCENTE, ALUMNO | Edición | Validación de contraseña actual y nueva | maqueta |
| **Documentación académica/legal** | `/otros/documentacion` | OTROS | ALUMNO | Lectura | **Adicional (fuera del análisis)** | maqueta |
| **Cambio de carrera** | `/otros/cambio-carrera` | OTROS | ALUMNO | Edición | **Adicional (fuera del análisis)** | maqueta |
| **Reincorporación** | `/otros/reincorporacion` | OTROS | ALUMNO | Edición | **Adicional (fuera del análisis)** | maqueta |
| **Cancelación de matrícula** | `/otros/cancelar-matricula` | OTROS | ALUMNO | Edición | RF27 | maqueta |
| **Mis cursos** | `/docencia/mis-cursos` | DOCENCIA | DOCENTE | Lectura | Asignaciones de cátedra docente | maqueta |
| **Evaluaciones** | `/docencia/evaluaciones` | DOCENCIA | DOCENTE | Edición | Alta de evaluaciones y ponderaciones | maqueta |
| **Calificaciones** | `/docencia/calificaciones` | DOCENCIA | DOCENTE | Edición | Carga de notas 1 a 10 con aprobación >= 4 | maqueta |
| **Asistencias (Tomar lista)** | `/docencia/asistencias` | DOCENCIA | DOCENTE | Edición | Toma de asistencia (P, A, T, J) por curso y fecha | maqueta |
| **Gestión de Alumnos** | `/gestion/alumnos` | GESTIÓN ACADÉMICA | ADMINISTRADOR, ADMINISTRATIVO | Edición | Pantalla de referencia: CRUD con carrera y plan | maqueta |
| **Gestión de Carreras** | `/gestion/carreras` | GESTIÓN ACADÉMICA | ADMINISTRADOR, ADMINISTRATIVO | Edición (ADM) / Lectura (SEC) | Alta, edición, baja y visualización de planes/cursos | maqueta |
| **Gestión de Docentes** | `/gestion/docentes` | GESTIÓN ACADÉMICA | ADMINISTRADOR, ADMINISTRATIVO | Edición (ADM) / Lectura (SEC) | Alta, edición y baja lógica de docentes | maqueta |
| **Gestión de Cursos** | `/gestion/cursos` | GESTIÓN ACADÉMICA | ADMINISTRADOR | Edición | Cursos por carrera, ciclo y control de cupos | maqueta |
| **Gestión de Materias** | `/gestion/materias` | GESTIÓN ACADÉMICA | ADMINISTRADOR | Edición | Catálogo de materias, carga horaria y plan | maqueta |
| **Gestión de Ciclos Lectivos** | `/gestion/ciclos-lectivos` | GESTIÓN ACADÉMICA | ADMINISTRADOR | Edición | Períodos lectivos y estados (ACTIVO, CERRADO) | maqueta |
| **Gestión de Plan de Estudios** | `/gestion/plan-estudios` | GESTIÓN ACADÉMICA | ADMINISTRADOR, ADMINISTRATIVO | Edición (ADM) / Lectura (SEC) | Malla y correlativas filtradas por carrera | maqueta |
| **Asignaciones Docente-Curso-Materia** | `/gestion/asignaciones` | GESTIÓN ACADÉMICA | ADMINISTRADOR, ADMINISTRATIVO | Edición (ADM) / Lectura (SEC) | Designaciones de cátedra | maqueta |
| **Gestión de Mesas de Examen** | `/gestion/mesas-examen` | GESTIÓN ACADÉMICA | ADMINISTRADOR | Edición | Programación de finales, aulas y tribunales | maqueta |
| **Inscripciones a Cursos** | `/gestion/inscripciones` | GESTIÓN ACADÉMICA | ADMINISTRADOR, ADMINISTRATIVO | Edición | Selección de curso de la carrera del alumno y cupo | maqueta |
| **Matrículas** | `/administrativo/matriculas` | ADMINISTRATIVO | ADMINISTRATIVO, ADMINISTRADOR | Edición | PENDIENTE, ACTIVA, CANCELADA | maqueta |
| **Cuotas y Seguros** | `/administrativo/cuotas` | ADMINISTRATIVO | ADMINISTRATIVO, ADMINISTRADOR | Edición | 12 cuotas mensuales + 3 seguros cuatrimestrales | maqueta |
| **Registro de Pagos** | `/administrativo/pagos` | ADMINISTRATIVO | ADMINISTRATIVO, ADMINISTRADOR | Edición | Cobro por importe completo con medio de pago | maqueta |
| **Situación Administrativa Alumno** | `/administrativo/situacion-alumno` | ADMINISTRATIVO | ADMINISTRATIVO, ADMINISTRADOR | Lectura | Búsqueda por alumno, deuda y total abonado | maqueta |
| **Deuda de Alumnos** | `/administrativo/deudas` | ADMINISTRATIVO | ADMINISTRATIVO, ADMINISTRADOR | Lectura | Consolidado de deudores y morosidad institucional | maqueta |
| **Usuarios y Roles** | `/sistema/usuarios` | SISTEMA | ADMINISTRADOR | Edición | Alta, asignación de roles y baja lógica | maqueta |

---

## Pantallas Adicionales al Análisis (Fuera de RF01 a RF57)

Las siguientes **8 pantallas** fueron incorporadas a la maqueta para proveer una experiencia completa y profesional de autogestión universitaria:

1. **Constancias** (`/solicitudes/constancias`): Solicitud de certificados de alumno regular y de examen rendido con descarga simulada.
2. **Inscripción a pasantías** (`/solicitudes/pasantias`): Postulación de estudiantes a convenios de pasantías formativas laborales.
3. **Solicitud de título** (`/solicitudes/titulo`): Trámite de diploma intermedio y titulación de egreso.
4. **Solicitudes académicas** (`/solicitudes/academicas`): Pedidos de excepción de correlativas, prórroga de regularidad y mesas especiales.
5. **Bandeja de solicitudes** (`/solicitudes/bandeja`): Bandeja de entrada para que el personal administrativo y directivo revise, apruebe o rechace trámites estudiantiles.
6. **Documentación académica/legal** (`/otros/documentacion`): Checklist de requisitos documentales físicos presentados en el legajo del alumno (DNI, título secundario, apto médico, fotos).
7. **Cambio de carrera** (`/otros/cambio-carrera`): Trámite de pase entre carreras o especialidades académicas con selector de carrera de destino.
8. **Reincorporación** (`/otros/reincorporacion`): Pedido de readmisión por pérdida de condición de regularidad por inasistencias.

---

## Mecanismo de Pasaje a la API Real
1. **Variable de entorno:** Configurar `VITE_USE_MOCK=false` en el archivo `.env.development` o `.env.production`.
2. **Desacoplamiento total:** Las pantallas del frontend nunca importan directamente los mocks ni conocen la estructura interna de `mockDb`. Toda comunicación pasa por `src/api/*.js`.
3. **Comentarios de contrato:** Cada función en `src/api/*.js` documenta formalmente mediante JSDoc el método HTTP y la ruta REST que espera recibir del backend (Spring Boot).
