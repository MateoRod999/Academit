# Inventario de Entidades y Endpoints - Academit

> **Auditoría Técnica del Frontend (Solo Lectura)**  
> Este documento consolida el relevamiento exhaustivo de todas las entidades, campos, relaciones y especificaciones de endpoints REST requeridos para la integración definitiva entre el frontend y el backend de Spring Boot.

## Resumen Ejecutivo de la Auditoría

- **Total de entidades identificadas:** 22
- **Total de endpoints inventariados:** 68
  - **Endpoints Reales (declarados e implementados en `src/api/`):** 64
  - **Endpoints Inferidos (sin declaración explícita):** 0
  - **Endpoints Faltantes (acciones simuladas en UI o procesos requeridos):** 4
- **Pantallas auditadas:** 41 vistas (39 rutas de menú + Login + 404 Not Found)
- **Cumplimiento de arquitectura:** **100% de desacoplamiento**. Ninguna pantalla importa datos mock directamente de `mocks/data.js`.

## Índice por Entidad

- [Alumno](#alumno): Estudiante inscripto en el instituto educativo.
- [Docente](#docente): Profesor o docente que dicta asignaturas en el instituto.
- [Carrera](#carrera): Oferta académica o tecnicatura superior dictada por el instituto.
- [PlanEstudio](#planestudio): Currícula de materias estructurada para una cohorte y carrera.
- [Materia](#materia): Asignatura perteneciente a un plan de estudios.
- [Curso](#curso): Comisión o división de cursada para un año y turno específico.
- [CicloLectivo](#ciclolectivo): Período lectivo anual del instituto que agrupa cursadas, matrículas e inscripciones.
- [Asignacion](#asignacion): Vínculo tripartito entre docente, curso y materia (CursoMateria).
- [Inscripcion](#inscripcion): Inscripción formal de un alumno a una comisión/curso específico.
- [Matricula](#matricula): Registro anual de matrícula académica que habilita la cursada del alumno.
- [Cuota](#cuota): Obligación de pago arancelario periódica (cuota mensual o seguro).
- [Pago](#pago): Transacción financiera de cobro de una cuota o arancel.
- [Evaluacion](#evaluacion): Instancia evaluativa (parcial o TP) programada para una materia en un curso.
- [Calificacion](#calificacion): Nota numérica de 1 a 10 obtenida por un alumno en una evaluación.
- [Asistencia](#asistencia): Registro diario de presentismo de un alumno a una clase.
- [MesaExamen](#mesaexamen): Turno de examen final para una materia ante un tribunal evaluador.
- [InscripcionMesa](#inscripcionmesa): Inscripción de un alumno regular a una mesa de examen final.
- [Solicitud](#solicitud): Trámite institucional o académico gestionado por un estudiante.
- [DeclaracionJurada](#declaracionjurada): Declaración jurada de asignaturas que el estudiante cursará en el ciclo lectivo.
- [Documentacion](#documentacion): Requisito documental o legal que el alumno debe presentar para su legajo.
- [Usuario](#usuario): Cuenta de autenticación y acceso al sistema de gestión Academit.
- [Rol](#rol): Perfil de seguridad que define los privilegios y menús de acceso.
- [Endpoints de Procesos del Negocio](#endpoints-de-procesos-del-negocio)
- [Problemas Encontrados y Recomendaciones](#problemas-encontrados-y-recomendaciones)
- [Comparación con el Diseño (DER)](#comparación-con-el-diseño-der)

---

## Alumno

Estudiante inscripto en el instituto educativo.

**Pantallas que la utilizan:** `GestionAlumnosPage.jsx, GestionInscripcionesPage.jsx, AdminMatriculasPage.jsx, AdminCuotasPage.jsx, AdminPagosPage.jsx, AdminSituacionAlumnoPage.jsx, AdminDeudasPage.jsx, AsistenciasDocentePage.jsx, CalificacionesDocentePage.jsx, InicioPage.jsx, MisDatosPage.jsx`

### Campos

| Campo | Tipo Inferido | Obligatorio | Valores Enum / Restricciones | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `idAlumno` | number (Integer) | Sí | - | Identificador único del alumno (PK). |
| `legajo` | string | Sí | - | Código identificatorio institucional (ej. ALU-1001). |
| `nombre` | string | Sí | - | Nombres del estudiante. |
| `apellido` | string | Sí | - | Apellidos del estudiante. |
| `dni` | string | Sí | - | Documento Nacional de Identidad único. |
| `email` | string | Sí | - | Correo electrónico de contacto. |
| `telefono` | string | No | - | Teléfono de contacto. |
| `direccion` | string | No | - | Domicilio residencial del estudiante. |
| `fechaNacimiento` | string (YYYY-MM-DD) | Sí | - | Fecha de nacimiento. |
| `idCarrera` | number (Integer) | Sí | - | FK a la Carrera en la que está inscripto. |
| `carrera` | string | No | - | Nombre desnormalizado de la carrera. |
| `idPlan` | number (Integer) | Sí | - | FK al Plan de Estudio asignado. |
| `planNombre` | string | No | - | Nombre desnormalizado del plan curricular. |
| `idCurso` | number (Integer) | No | - | FK al curso/comisión principal asignada. |
| `cursoNombre` | string | No | - | Nombre del curso asignado. |
| `cicloLectivo` | number (Integer) | Sí | - | Año lectivo de ingreso o cursada activa. |
| `estado` | string (Enum) | Sí | `REGULAR, ACTIVO, INACTIVO` | Condición académica institucional. |
| `estadoMatricula` | string (Enum) | Sí | `ACTIVA, PENDIENTE, CANCELADA` | Estado de la matrícula para el ciclo lectivo actual. |
| `idMatricula` | number (Integer) | No | - | FK a la matrícula del ciclo actual. |

**Relaciones:**
- `idCarrera` → **Carrera** (`idCarrera`) [M:1]
- `idPlan` → **PlanEstudio** (`idPlan`) [M:1]
- `idCurso` → **Curso** (`idCurso`) [M:1]
- `idMatricula` → **Matricula** (`idMatricula`) [1:1]

### Endpoints Asociados

| Método | Ruta | Descripción | Parámetros y Query | Cuerpo | Respuesta | Códigos HTTP | Roles | Pantallas | Función API | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/alumnos` | Obtiene la lista completa de alumnos con filtros opcionales de búsqueda. | Query: ?search=, ?idCarrera=, ?estado= | `-` | `Array<AlumnoDTO>` | `200, 401, 403` | ADMINISTRADOR, ADMINISTRATIVO | GestionAlumnosPage.jsx, GestionInscripcionesPage.jsx, AdminDeudasPage.jsx, AdminPagosPage.jsx, AdminSituacionAlumnoPage.jsx, AsistenciasDocentePage.jsx, CalificacionesDocentePage.jsx, InicioPage.jsx | `getAlumnos` | **real** |
| `GET` | `/api/alumnos/{id}` | Obtiene el detalle completo del legajo de un alumno por ID. | Path: id (number) | `-` | `AlumnoDTO` | `200, 401, 403, 404` | ADMINISTRADOR, ADMINISTRATIVO | GestionAlumnosPage.jsx (auxiliar) | `getAlumnoById` | **real** |
| `POST` | `/api/alumnos` | Registra el alta de un nuevo alumno en el instituto. | - | `AlumnoCreateDTO { nombre, apellido, dni, email, telefono, direccion, fechaNacimiento, idCarrera, idPlan }` | `AlumnoDTO` | `201, 400, 401, 403, 409` | ADMINISTRADOR, ADMINISTRATIVO | GestionAlumnosPage.jsx | `createAlumno` | **real** |
| `PUT` | `/api/alumnos/{id}` | Actualiza la información de legajo o filiación de un alumno. | Path: id (number) | `AlumnoUpdateDTO { nombre, apellido, email, telefono, direccion, estado, idPlan }` | `AlumnoDTO` | `200, 400, 401, 403, 404` | ADMINISTRADOR, ADMINISTRATIVO | GestionAlumnosPage.jsx | `updateAlumno` | **real** |
| `DELETE` | `/api/alumnos/{id}` | Da de baja lógica a un alumno (inactiva su estado académico). | Path: id (number) | `-` | `204 No Content` | `200, 204, 401, 403, 404` | ADMINISTRADOR | GestionAlumnosPage.jsx | `deleteAlumno` | **real** |
| `GET` | `/api/alumnos/{id}/situacion-academica` | Consulta consolidada de materias aprobadas, cursadas, correlatividades y promedio. | Path: id (number) | `-` | `SituacionAcademicaDTO { materiasAprobadas, promedio, regularidades }` | `200, 401, 403, 404` | ALUMNO, ADMINISTRADOR, ADMINISTRATIVO | SituacionAcademicaArancelariaPage.jsx | `getSituacionAcademica` | **real** |
| `GET` | `/api/alumnos/{id}/situacion-administrativa` | Consulta consolidada del estado financiero, cuotas pendientes, deudas y matrícula del alumno. | Path: id (number) | `-` | `SituacionAdministrativaDTO { cuotasPagas, cuotasPendientes, totalDeuda, matricula }` | `200, 401, 403, 404` | ADMINISTRATIVO, ADMINISTRADOR | AdminSituacionAlumnoPage.jsx | `getSituacionAdministrativa` | **real** |

---

## Docente

Profesor o docente que dicta asignaturas en el instituto.

**Pantallas que la utilizan:** `GestionDocentesPage.jsx, GestionAsignacionesPage.jsx`

### Campos

| Campo | Tipo Inferido | Obligatorio | Valores Enum / Restricciones | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `idDocente` | number (Integer) | Sí | - | Identificador único del docente (PK). |
| `legajo` | string | Sí | - | Código identificatorio del docente (ej. DOC-201). |
| `nombre` | string | Sí | - | Nombres del docente. |
| `apellido` | string | Sí | - | Apellidos del docente. |
| `dni` | string | Sí | - | Documento Nacional de Identidad único. |
| `email` | string | Sí | - | Correo electrónico institucional. |
| `telefono` | string | No | - | Teléfono de contacto. |
| `especialidad` | string | No | - | Área de especialidad académica o titulación. |
| `estado` | string (Enum) | Sí | `ACTIVO, INACTIVO` | Estado operativo del docente. |

### Endpoints Asociados

| Método | Ruta | Descripción | Parámetros y Query | Cuerpo | Respuesta | Códigos HTTP | Roles | Pantallas | Función API | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/docentes` | Obtiene la nómina de docentes del instituto. | Query: ?estado= | `-` | `Array<DocenteDTO>` | `200, 401, 403` | ADMINISTRADOR, ADMINISTRATIVO | GestionDocentesPage.jsx, GestionAsignacionesPage.jsx | `getDocentes` | **real** |
| `POST` | `/api/docentes` | Registra el alta de un nuevo docente. | - | `DocenteCreateDTO { legajo, nombre, apellido, dni, email, telefono, especialidad }` | `DocenteDTO` | `201, 400, 401, 403, 409` | ADMINISTRADOR | GestionDocentesPage.jsx | `createDocente` | **real** |
| `PUT` | `/api/docentes/{id}` | Modifica datos de legajo o contacto de un docente. | Path: id (number) | `DocenteUpdateDTO { nombre, apellido, email, telefono, especialidad, estado }` | `DocenteDTO` | `200, 400, 401, 403, 404` | ADMINISTRADOR | GestionDocentesPage.jsx | `updateDocente` | **real** |
| `DELETE` | `/api/docentes/{id}` | Da de baja lógica a un docente en el sistema. | Path: id (number) | `-` | `204 No Content` | `200, 204, 401, 403, 404` | ADMINISTRADOR | GestionDocentesPage.jsx | `deleteDocente` | **real** |

---

## Carrera

Oferta académica o tecnicatura superior dictada por el instituto.

**Pantallas que la utilizan:** `GestionCarrerasPage.jsx, GestionAlumnosPage.jsx, GestionCursosPage.jsx, GestionPlanEstudiosPage.jsx, CambioCarreraPage.jsx`

### Campos

| Campo | Tipo Inferido | Obligatorio | Valores Enum / Restricciones | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `idCarrera` | number (Integer) | Sí | - | Identificador único de la carrera (PK). |
| `codigo` | string | Sí | `TSDS, TSCDIA` | Código corto o sigla oficial. |
| `nombre` | string | Sí | - | Denominación oficial de la carrera. |
| `tituloOtorgado` | string | No | - | Título expedido al egresar. |
| `duracion` | string | Sí | - | Duración de cursada (ej. '3 años'). |
| `resolucion` | string | No | - | Resolución ministerial habilitante. |
| `estado` | string (Enum) | Sí | `ACTIVA, INACTIVA` | Estado de vigencia académica. |
| `planesCount` | number (Integer) | No | - | Cantidad desnormalizada de planes asociados. |
| `cursosCount` | number (Integer) | No | - | Cantidad desnormalizada de comisiones activas. |

### Endpoints Asociados

| Método | Ruta | Descripción | Parámetros y Query | Cuerpo | Respuesta | Códigos HTTP | Roles | Pantallas | Función API | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/carreras` | Obtiene la oferta completa de carreras del instituto. | Query: ?estado= | `-` | `Array<CarreraDTO>` | `200, 401, 403` | ADMINISTRADOR, ADMINISTRATIVO | GestionCarrerasPage.jsx, GestionAlumnosPage.jsx, GestionCursosPage.jsx, GestionPlanEstudiosPage.jsx | `getCarreras` | **real** |
| `GET` | `/api/carreras/{id}` | Obtiene el detalle de una carrera por ID. | Path: id (number) | `-` | `CarreraDTO` | `200, 401, 403, 404` | ADMINISTRADOR, ADMINISTRATIVO | GestionCarrerasPage.jsx | `getCarreraById` | **real** |
| `POST` | `/api/carreras` | Crea una nueva titulación o carrera en el instituto. | - | `CarreraCreateDTO { codigo, nombre, tituloOtorgado, duracion, resolucion }` | `CarreraDTO` | `201, 400, 401, 403, 409` | ADMINISTRADOR | GestionCarrerasPage.jsx | `createCarrera` | **real** |
| `PUT` | `/api/carreras/{id}` | Actualiza denominación o datos formales de una carrera. | Path: id (number) | `CarreraUpdateDTO { codigo, nombre, tituloOtorgado, duracion, resolucion, estado }` | `CarreraDTO` | `200, 400, 401, 403, 404` | ADMINISTRADOR | GestionCarrerasPage.jsx | `updateCarrera` | **real** |
| `DELETE` | `/api/carreras/{id}` | Da de baja o inactiva una carrera. | Path: id (number) | `-` | `204 No Content` | `200, 204, 401, 403, 404` | ADMINISTRADOR | GestionCarrerasPage.jsx | `deleteCarrera` | **real** |
| `GET` | `/api/carreras/{id}/planes` | Obtiene los planes de estudio correspondientes a una carrera. | Path: id (number) | `-` | `Array<PlanEstudioDTO>` | `200, 401, 403, 404` | ADMINISTRADOR, ADMINISTRATIVO | GestionCarrerasPage.jsx | `getCarreraPlanes` | **real** |
| `GET` | `/api/carreras/{id}/cursos` | Obtiene las comisiones/cursos habilitados para una carrera. | Path: id (number) | `-` | `Array<CursoDTO>` | `200, 401, 403, 404` | ADMINISTRADOR, ADMINISTRATIVO | GestionCarrerasPage.jsx | `getCarreraCursos` | **real** |

---

## PlanEstudio

Currícula de materias estructurada para una cohorte y carrera.

**Pantallas que la utilizan:** `GestionPlanEstudiosPage.jsx, GestionAlumnosPage.jsx, GestionCarrerasPage.jsx, PlanEstudiosAlumnoPage.jsx`

### Campos

| Campo | Tipo Inferido | Obligatorio | Valores Enum / Restricciones | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `idPlan` | number (Integer) | Sí | - | Identificador único del plan (PK). |
| `codigo` | string | Sí | `PLAN-2024, PLAN-2025` | Código identificatorio del plan. |
| `nombre` | string | Sí | - | Nombre del plan curricular. |
| `idCarrera` | number (Integer) | Sí | - | FK a la carrera asociada. |
| `carreraNombre` | string | No | - | Nombre de la carrera desnormalizado. |
| `anioResolucion` | number (Integer) | Sí | - | Año de aprobación o entrada en vigencia. |
| `horasTotales` | number (Integer) | No | - | Carga horaria total de la currícula. |
| `cantidadMaterias` | number (Integer) | No | - | Total de asignaturas del plan. |
| `estado` | string (Enum) | Sí | `VIGENTE, CADUCO` | Estado reglamentario del plan. |

**Relaciones:**
- `idCarrera` → **Carrera** (`idCarrera`) [M:1]

### Endpoints Asociados

| Método | Ruta | Descripción | Parámetros y Query | Cuerpo | Respuesta | Códigos HTTP | Roles | Pantallas | Función API | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/planes-estudio` | Obtiene el listado general de planes de estudio. | Query: ?idCarrera= | `-` | `Array<PlanEstudioDTO>` | `200, 401, 403` | ADMINISTRADOR, ADMINISTRATIVO | GestionPlanEstudiosPage.jsx, GestionAlumnosPage.jsx | `getPlanesEstudio` | **real** |

---

## Materia

Asignatura perteneciente a un plan de estudios.

**Pantallas que la utilizan:** `GestionMateriasPage.jsx, GestionPlanEstudiosPage.jsx, GestionAsignacionesPage.jsx, GestionMesasPage.jsx, PlanEstudiosAlumnoPage.jsx, AsistenciasDocentePage.jsx, CalificacionesDocentePage.jsx, EvaluacionesDocentePage.jsx`

### Campos

| Campo | Tipo Inferido | Obligatorio | Valores Enum / Restricciones | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `idMateria` | number (Integer) | Sí | - | Identificador único de la materia (PK). |
| `codigo` | string | Sí | - | Código identificatorio (ej. MAT-101, CD-101). |
| `nombre` | string | Sí | - | Nombre de la materia. |
| `idCarrera` | number (Integer) | Sí | - | FK a la carrera a la que pertenece. |
| `carreraNombre` | string | No | - | Nombre de la carrera para visualización. |
| `idPlan` | number (Integer) | Sí | - | FK al plan curricular. |
| `anio` | number (Integer) | Sí | - | Año de cursada en la carrera (1, 2, 3). |
| `regimen` | string (Enum) | Sí | `CUATRIMESTRAL, ANUAL` | Régimen académico de dictado. |
| `horasSemanales` | number (Integer) | No | - | Horas semanales de cursada. |
| `correlativas` | array of numbers | No | - | Lista de idMateria de asignaturas correlativas previas. |

**Relaciones:**
- `idCarrera` → **Carrera** (`idCarrera`) [M:1]
- `idPlan` → **PlanEstudio** (`idPlan`) [M:1]

### Endpoints Asociados

| Método | Ruta | Descripción | Parámetros y Query | Cuerpo | Respuesta | Códigos HTTP | Roles | Pantallas | Función API | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/materias` | Obtiene materias filtradas por carrera o plan de estudios. | Query: ?idCarrera=, ?idPlan= | `-` | `Array<MateriaDTO>` | `200, 401, 403` | ADMINISTRADOR, DOCENTE, ALUMNO | GestionMateriasPage.jsx, GestionPlanEstudiosPage.jsx, GestionAsignacionesPage.jsx, GestionMesasPage.jsx, PlanEstudiosAlumnoPage.jsx, AsistenciasDocentePage.jsx, CalificacionesDocentePage.jsx, EvaluacionesDocentePage.jsx | `getMaterias` | **real** |
| `POST` | `/api/materias` | Crea una nueva materia en el catálogo del plan de estudios. | - | `MateriaCreateDTO { codigo, nombre, idCarrera, idPlan, anio, regimen, horasSemanales, correlativas }` | `MateriaDTO` | `201, 400, 401, 403, 409` | ADMINISTRADOR | GestionMateriasPage.jsx | `createMateria` | **real** |
| `PUT` | `/api/materias/{id}` | Actualiza los datos académicos o correlatividades de una materia. | Path: id (number) | `MateriaUpdateDTO { nombre, anio, regimen, horasSemanales, correlativas }` | `MateriaDTO` | `200, 400, 401, 403, 404` | ADMINISTRADOR | GestionMateriasPage.jsx, GestionPlanEstudiosPage.jsx | `updateMateria` | **real** |

---

## Curso

Comisión o división de cursada para un año y turno específico.

**Pantallas que la utilizan:** `GestionCursosPage.jsx, GestionInscripcionesPage.jsx, GestionAsignacionesPage.jsx, MisCursosPage.jsx, AsistenciasDocentePage.jsx, CalificacionesDocentePage.jsx, EvaluacionesDocentePage.jsx`

### Campos

| Campo | Tipo Inferido | Obligatorio | Valores Enum / Restricciones | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `idCurso` | number (Integer) | Sí | - | Identificador único de la comisión (PK). |
| `codigo` | string | Sí | - | Código identificatorio (ej. 1A-INF-TM, 1A-CD-TM). |
| `nombre` | string | Sí | - | Nombre descriptivo de la comisión. |
| `idCarrera` | number (Integer) | Sí | - | FK a la carrera a la que pertenece. |
| `carreraNombre` | string | No | - | Nombre de la carrera para visualización. |
| `idPlan` | number (Integer) | No | - | FK al plan curricular. |
| `turno` | string (Enum) | Sí | `MAÑANA, TARDE, NOCHE` | Turno de cursada. |
| `aula` | string | No | - | Aula física o laboratorio asignado. |
| `capacidadMaxima` | number (Integer) | Sí | - | Cupo máximo de inscriptos. |
| `inscriptos` | number (Integer) | Sí | - | Cantidad actual de alumnos inscriptos. |
| `cuposDisponibles` | number (Integer) | Sí | - | Vacantes disponibles restantes. |
| `cicloLectivo` | number (Integer) | Sí | - | Año lectivo al que corresponde la comisión. |

**Relaciones:**
- `idCarrera` → **Carrera** (`idCarrera`) [M:1]
- `idPlan` → **PlanEstudio** (`idPlan`) [M:1]

### Endpoints Asociados

| Método | Ruta | Descripción | Parámetros y Query | Cuerpo | Respuesta | Códigos HTTP | Roles | Pantallas | Función API | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/cursos` | Obtiene la lista de comisiones/cursos y su ocupación de cupos. | Query: ?idCarrera=, ?turno= | `-` | `Array<CursoDTO>` | `200, 401, 403` | ADMINISTRADOR, DOCENTE, ADMINISTRATIVO | GestionCursosPage.jsx, GestionInscripcionesPage.jsx, GestionAsignacionesPage.jsx, MisCursosPage.jsx, AsistenciasDocentePage.jsx, CalificacionesDocentePage.jsx, EvaluacionesDocentePage.jsx | `getCursos` | **real** |
| `POST` | `/api/cursos` | Crea una nueva división/comisión de curso. | - | `CursoCreateDTO { codigo, nombre, idCarrera, idPlan, turno, aula, capacidadMaxima, cicloLectivo }` | `CursoDTO` | `201, 400, 401, 403, 409` | ADMINISTRADOR | GestionCursosPage.jsx | `createCurso` | **real** |
| `PUT` | `/api/cursos/{id}` | Actualiza la capacidad, turno o aula de una comisión. | Path: id (number) | `CursoUpdateDTO { nombre, turno, aula, capacidadMaxima }` | `CursoDTO` | `200, 400, 401, 403, 404` | ADMINISTRADOR | GestionCursosPage.jsx | `updateCurso` | **real** |

---

## CicloLectivo

Período lectivo anual del instituto que agrupa cursadas, matrículas e inscripciones.

**Pantallas que la utilizan:** `GestionCiclosLectivosPage.jsx, GestionInscripcionesPage.jsx`

### Campos

| Campo | Tipo Inferido | Obligatorio | Valores Enum / Restricciones | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `idCiclo` | number (Integer) | Sí | - | Identificador único del ciclo (PK). |
| `anio` | number (Integer) | Sí | - | Año calendario del ciclo (ej. 2026). |
| `nombre` | string | Sí | - | Denominación del ciclo lectivo. |
| `fechaInicio` | string (YYYY-MM-DD) | Sí | - | Fecha de inicio del ciclo escolar. |
| `fechaFin` | string (YYYY-MM-DD) | Sí | - | Fecha de finalización del ciclo escolar. |
| `estado` | string (Enum) | Sí | `ACTIVO, CERRADO` | Estado operativo del ciclo. |

### Endpoints Asociados

| Método | Ruta | Descripción | Parámetros y Query | Cuerpo | Respuesta | Códigos HTTP | Roles | Pantallas | Función API | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/ciclos-lectivos` | Lista los ciclos lectivos registrados en la institución. | - | `-` | `Array<CicloLectivoDTO>` | `200, 401, 403` | ADMINISTRADOR, ADMINISTRATIVO | GestionCiclosLectivosPage.jsx, GestionInscripcionesPage.jsx | `getCiclosLectivos` | **real** |
| `POST` | `/api/ciclos-lectivos` | Abre o registra un nuevo ciclo lectivo anual. | - | `CicloLectivoCreateDTO { anio, nombre, fechaInicio, fechaFin, estado }` | `CicloLectivoDTO` | `201, 400, 401, 403, 409` | ADMINISTRADOR | GestionCiclosLectivosPage.jsx | `createCicloLectivo` | **real** |
| `PUT` | `/api/ciclos-lectivos/{id}` | Modifica fechas límite o estado (cierre) de un ciclo lectivo. | Path: id (number) | `CicloLectivoUpdateDTO { nombre, fechaInicio, fechaFin, estado }` | `CicloLectivoDTO` | `200, 400, 401, 403, 404` | ADMINISTRADOR | GestionCiclosLectivosPage.jsx | `updateCicloLectivo` | **real** |

---

## Asignacion

Vínculo tripartito entre docente, curso y materia (CursoMateria).

**Pantallas que la utilizan:** `GestionAsignacionesPage.jsx, MisCursosPage.jsx`

### Campos

| Campo | Tipo Inferido | Obligatorio | Valores Enum / Restricciones | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `idAsignacion` | number (Integer) | Sí | - | Identificador único de la asignación (PK). |
| `idDocente` | number (Integer) | Sí | - | FK al docente asignado. |
| `docenteNombre` | string | No | - | Nombre y apellido del docente. |
| `idCurso` | number (Integer) | Sí | - | FK a la comisión o curso. |
| `cursoNombre` | string | No | - | Nombre de la comisión. |
| `idMateria` | number (Integer) | Sí | - | FK a la materia dictada. |
| `materiaNombre` | string | No | - | Nombre de la materia. |
| `rolDocente` | string (Enum) | Sí | `TITULAR, ADJUNTO, JTP` | Rol en la cátedra. |

**Relaciones:**
- `idDocente` → **Docente** (`idDocente`) [M:1]
- `idCurso` → **Curso** (`idCurso`) [M:1]
- `idMateria` → **Materia** (`idMateria`) [M:1]

### Endpoints Asociados

| Método | Ruta | Descripción | Parámetros y Query | Cuerpo | Respuesta | Códigos HTTP | Roles | Pantallas | Función API | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/asignaciones` | Lista las asignaciones de docentes a cursos y materias. | Query: ?idDocente=, ?idCurso= | `-` | `Array<AsignacionDTO>` | `200, 401, 403` | ADMINISTRADOR, ADMINISTRATIVO, DOCENTE | GestionAsignacionesPage.jsx, MisCursosPage.jsx | `getAsignaciones` | **real** |
| `POST` | `/api/asignaciones` | Asigna un docente a una cátedra y comisión. | - | `AsignacionCreateDTO { idDocente, idCurso, idMateria, rolDocente }` | `AsignacionDTO` | `201, 400, 401, 403, 409` | ADMINISTRADOR | GestionAsignacionesPage.jsx | `createAsignacion` | **real** |
| `DELETE` | `/api/asignaciones/{id}` | Elimina la asignación docente-curso-materia. | Path: id (number) | `-` | `204 No Content` | `200, 204, 401, 403, 404` | ADMINISTRADOR | GestionAsignacionesPage.jsx | `deleteAsignacion` | **real** |

---

## Inscripcion

Inscripción formal de un alumno a una comisión/curso específico.

**Pantallas que la utilizan:** `GestionInscripcionesPage.jsx`

### Campos

| Campo | Tipo Inferido | Obligatorio | Valores Enum / Restricciones | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `idInscripcion` | number (Integer) | Sí | - | Identificador único de inscripción (PK). |
| `idAlumno` | number (Integer) | Sí | - | FK al alumno inscripto. |
| `alumnoNombre` | string | No | - | Nombre del alumno. |
| `idCurso` | number (Integer) | Sí | - | FK al curso inscripto. |
| `cursoNombre` | string | No | - | Nombre del curso inscripto. |
| `cicloLectivo` | number (Integer) | Sí | - | Año de la cursada. |
| `fechaInscripcion` | string (YYYY-MM-DD) | Sí | - | Fecha de confirmación de la inscripción. |
| `estado` | string (Enum) | Sí | `CONFIRMADA, CANCELADA` | Estado de la inscripción. |

**Relaciones:**
- `idAlumno` → **Alumno** (`idAlumno`) [M:1]
- `idCurso` → **Curso** (`idCurso`) [M:1]

### Endpoints Asociados

| Método | Ruta | Descripción | Parámetros y Query | Cuerpo | Respuesta | Códigos HTTP | Roles | Pantallas | Función API | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/inscripciones` | Lista las inscripciones de alumnos a comisiones/cursos. | Query: ?idCurso=, ?idAlumno= | `-` | `Array<InscripcionDTO>` | `200, 401, 403` | ADMINISTRADOR, ADMINISTRATIVO | GestionInscripcionesPage.jsx | `getInscripciones` | **real** |
| `POST` | `/api/inscripciones` | Inscribe a un alumno a un curso verificando cupo disponible y carrera. | - | `InscripcionCreateDTO { idAlumno, idCurso, cicloLectivo }` | `InscripcionDTO` | `201, 400, 401, 403, 409` | ADMINISTRADOR, ADMINISTRATIVO | GestionInscripcionesPage.jsx | `createInscripcion` | **real** |
| `DELETE` | `/api/inscripciones/{id}` | Cancela la inscripción de un alumno y libera cupo en la comisión. | Path: id (number) | `-` | `204 No Content` | `200, 204, 401, 403, 404` | ADMINISTRADOR, ADMINISTRATIVO | GestionInscripcionesPage.jsx | `cancelarInscripcion` | **real** |

---

## Matricula

Registro anual de matrícula académica que habilita la cursada del alumno.

**Pantallas que la utilizan:** `AdminMatriculasPage.jsx, AdminSituacionAlumnoPage.jsx, CancelarMatriculaPage.jsx, SituacionAcademicaArancelariaPage.jsx`

### Campos

| Campo | Tipo Inferido | Obligatorio | Valores Enum / Restricciones | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `idMatricula` | number (Integer) | Sí | - | Identificador único de la matrícula (PK). |
| `idAlumno` | number (Integer) | Sí | - | FK al alumno matriculado. |
| `alumnoNombre` | string | No | - | Nombre del alumno. |
| `cicloLectivo` | number (Integer) | Sí | - | Año del ciclo lectivo. |
| `monto` | number (Monetario) | Sí | - | Arancel fijado para la matrícula. |
| `fechaAlta` | string (YYYY-MM-DD) | Sí | - | Fecha de emisión de la matrícula. |
| `estado` | string (Enum) | Sí | `ACTIVA, PENDIENTE, CANCELADA` | Estado administrativo de la matrícula. |
| `estadoPago` | string (Enum) | Sí | `PAGADA, PENDIENTE, ANULADA` | Estado del pago del arancel. |

**Relaciones:**
- `idAlumno` → **Alumno** (`idAlumno`) [M:1]

### Endpoints Asociados

| Método | Ruta | Descripción | Parámetros y Query | Cuerpo | Respuesta | Códigos HTTP | Roles | Pantallas | Función API | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/matriculas` | Lista las matrículas anuales registradas. | Query: ?cicloLectivo=, ?estado= | `-` | `Array<MatriculaDTO>` | `200, 401, 403` | ADMINISTRADOR, ADMINISTRATIVO, ALUMNO | AdminMatriculasPage.jsx, AdminSituacionAlumnoPage.jsx, CancelarMatriculaPage.jsx, SituacionAcademicaArancelariaPage.jsx | `getMatriculas` | **real** |
| `PUT` | `/api/matriculas/{id}` | Actualiza el estado administrativo o de pago de la matrícula. | Path: id (number) | `MatriculaUpdateDTO { estado, estadoPago }` | `MatriculaDTO` | `200, 400, 401, 403, 404` | ADMINISTRADOR, ADMINISTRATIVO | AdminMatriculasPage.jsx | `updateMatricula` | **real** |
| `POST` | `/api/matriculas/cancelar` | Solicita o registra la cancelación de la matrícula de un estudiante. | - | `CancelarMatriculaDTO { idAlumno, motivo }` | `MatriculaDTO { estado: 'CANCELADA' }` | `200, 400, 401, 403, 404` | ALUMNO | CancelarMatriculaPage.jsx | `cancelarMatricula` | **real** |

---

## Cuota

Obligación de pago arancelario periódica (cuota mensual o seguro).

**Pantallas que la utilizan:** `AdminCuotasPage.jsx, AdminDeudasPage.jsx, AdminPagosPage.jsx, AdminSituacionAlumnoPage.jsx, InicioPage.jsx, SituacionAcademicaArancelariaPage.jsx`

### Campos

| Campo | Tipo Inferido | Obligatorio | Valores Enum / Restricciones | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `idCuota` | number (Integer) | Sí | - | Identificador único de la cuota (PK). |
| `idAlumno` | number (Integer) | Sí | - | FK al alumno deudor. |
| `alumnoNombre` | string | No | - | Nombre del alumno. |
| `concepto` | string | Sí | - | Descripción del concepto facturado. |
| `tipo` | string (Enum) | Sí | `CUOTA_MENSUAL, SEGURO_CUATRIMESTRAL` | Tipo de obligación arancelaria. |
| `numeroCuota` | number (Integer) | Sí | - | Número ordinal de cuota (1 a 10). |
| `periodo` | string | Sí | - | Mes y año correspondiente (ej. 'Marzo 2026'). |
| `monto` | number (Monetario) | Sí | - | Importe de la cuota. |
| `fechaVencimiento` | string (YYYY-MM-DD) | Sí | - | Fecha límite de pago. |
| `estado` | string (Enum) | Sí | `PAGADA, PENDIENTE, VENCIDA` | Estado de cobranza. |
| `fechaPago` | string (YYYY-MM-DD) | No | - | Fecha de cancelación de la cuota. |
| `comprobante` | string | No | - | Número de recibo asociado si está paga. |

**Relaciones:**
- `idAlumno` → **Alumno** (`idAlumno`) [M:1]

### Endpoints Asociados

| Método | Ruta | Descripción | Parámetros y Query | Cuerpo | Respuesta | Códigos HTTP | Roles | Pantallas | Función API | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/cuotas` | Consulta cuotas arancelarias con filtro opcional por alumno. | Query: ?idAlumno=, ?estado= | `-` | `Array<CuotaDTO>` | `200, 401, 403` | ADMINISTRADOR, ADMINISTRATIVO, ALUMNO | AdminCuotasPage.jsx, AdminDeudasPage.jsx, AdminPagosPage.jsx, AdminSituacionAlumnoPage.jsx, InicioPage.jsx, SituacionAcademicaArancelariaPage.jsx | `getCuotas` | **real** |
| `POST` | `/api/cuotas/{id}/pagar` | Marca una cuota como pagada registrando el medio de pago. | Path: id (number) | `PagarCuotaDTO { medioPago }` | `CuotaDTO { estado: 'PAGADA', fechaPago, comprobante }` | `200, 400, 401, 403, 404, 409` | ADMINISTRADOR, ADMINISTRATIVO | AdminPagosPage.jsx (alternativo) | `pagarCuota` | **real** |
| `POST` | `/api/cuotas/generar` | Proceso masivo de emisión de cuotas mensuales para todas las matrículas activas del ciclo. | - | `GenerarCuotasDTO { idCiclo, mes, monto, vencimiento }` | `BatchCuotasResultDTO { totalGeneradas, cicloLectivo }` | `201, 400, 401, 403, 409` | ADMINISTRADOR, ADMINISTRATIVO | AdminCuotasPage.jsx | `-` | **falta** |

---

## Pago

Transacción financiera de cobro de una cuota o arancel.

**Pantallas que la utilizan:** `AdminPagosPage.jsx, AdminSituacionAlumnoPage.jsx, SituacionAcademicaArancelariaPage.jsx`

### Campos

| Campo | Tipo Inferido | Obligatorio | Valores Enum / Restricciones | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `idPago` | number (Integer) | Sí | - | Identificador único del pago (PK). |
| `idAlumno` | number (Integer) | Sí | - | FK al alumno pagador. |
| `alumnoNombre` | string | No | - | Nombre del alumno. |
| `concepto` | string | Sí | - | Concepto cancelado. |
| `monto` | number (Monetario) | Sí | - | Importe cobrado. |
| `medioPago` | string (Enum) | Sí | `EFECTIVO, TRANSFERENCIA, TARJETA` | Canal o medio de pago utilizado. |
| `fechaPago` | string (YYYY-MM-DD) | Sí | - | Fecha y hora del cobro. |
| `comprobante` | string | Sí | - | Número de recibo oficial generado (ej. REC-2026-0001). |
| `estado` | string (Enum) | Sí | `ACREDITADO, ANULADO` | Estado de la transacción. |

**Relaciones:**
- `idAlumno` → **Alumno** (`idAlumno`) [M:1]

### Endpoints Asociados

| Método | Ruta | Descripción | Parámetros y Query | Cuerpo | Respuesta | Códigos HTTP | Roles | Pantallas | Función API | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/pagos` | Consulta el historial de pagos y recibos emitidos. | Query: ?idAlumno= | `-` | `Array<PagoDTO>` | `200, 401, 403` | ADMINISTRADOR, ADMINISTRATIVO, ALUMNO | AdminPagosPage.jsx, AdminSituacionAlumnoPage.jsx, SituacionAcademicaArancelariaPage.jsx | `getPagos` | **real** |
| `POST` | `/api/pagos` | Registra el cobro de una cuota o arancel y genera el recibo de caja. | - | `PagoCreateDTO { idAlumno, idCuota, concepto, monto, medioPago, fechaPago }` | `PagoDTO { idPago, comprobante, estado: 'ACREDITADO' }` | `201, 400, 401, 403, 404, 409` | ADMINISTRADOR, ADMINISTRATIVO | AdminPagosPage.jsx | `registrarPago` | **real** |

---

## Evaluacion

Instancia evaluativa (parcial o TP) programada para una materia en un curso.

**Pantallas que la utilizan:** `EvaluacionesDocentePage.jsx`

### Campos

| Campo | Tipo Inferido | Obligatorio | Valores Enum / Restricciones | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `idEvaluacion` | number (Integer) | Sí | - | Identificador único de la evaluación (PK). |
| `idMateria` | number (Integer) | Sí | - | FK a la materia evaluada. |
| `materiaNombre` | string | No | - | Nombre de la materia. |
| `idCurso` | number (Integer) | Sí | - | FK al curso/comisión evaluado. |
| `cursoNombre` | string | No | - | Nombre del curso evaluado. |
| `tipo` | string (Enum) | Sí | `PARCIAL, TRABAJO_PRACTICO` | Tipo de evaluación. |
| `descripcion` | string | Sí | - | Nombre o tema de la evaluación. |
| `fecha` | string (YYYY-MM-DD) | Sí | - | Fecha de la prueba o entrega. |
| `ponderacion` | string | No | - | Ponderación en la nota final (ej. '40%'). |

**Relaciones:**
- `idMateria` → **Materia** (`idMateria`) [M:1]
- `idCurso` → **Curso** (`idCurso`) [M:1]

### Endpoints Asociados

| Método | Ruta | Descripción | Parámetros y Query | Cuerpo | Respuesta | Códigos HTTP | Roles | Pantallas | Función API | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/evaluaciones` | Consulta las evaluaciones creadas filtradas por materia y curso. | Query: ?idMateria=, ?idCurso= | `-` | `Array<EvaluacionDTO>` | `200, 401, 403` | DOCENTE, ADMINISTRADOR | EvaluacionesDocentePage.jsx | `getEvaluaciones` | **real** |
| `POST` | `/api/evaluaciones` | Programa una nueva evaluación (parcial o TP) en el cronograma. | - | `EvaluacionCreateDTO { idMateria, idCurso, tipo, descripcion, fecha, ponderacion }` | `EvaluacionDTO` | `201, 400, 401, 403` | DOCENTE, ADMINISTRADOR | EvaluacionesDocentePage.jsx | `createEvaluacion` | **real** |

---

## Calificacion

Nota numérica de 1 a 10 obtenida por un alumno en una evaluación.

**Pantallas que la utilizan:** `CalificacionesDocentePage.jsx, ParcialesPage.jsx, TrabajosPracticosPage.jsx, SituacionAcademicaArancelariaPage.jsx, InicioPage.jsx`

### Campos

| Campo | Tipo Inferido | Obligatorio | Valores Enum / Restricciones | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `idCalificacion` | number (Integer) | Sí | - | Identificador único de la calificación (PK). |
| `idAlumno` | number (Integer) | Sí | - | FK al alumno calificado. |
| `alumnoNombre` | string | No | - | Nombre del alumno calificado. |
| `idMateria` | number (Integer) | Sí | - | FK a la materia calificada. |
| `materiaNombre` | string | No | - | Nombre de la materia. |
| `evaluacionNombre` | string | Sí | - | Nombre de la evaluación asociada. |
| `tipo` | string (Enum) | Sí | `PARCIAL, TRABAJO_PRACTICO` | Categoría evaluativa. |
| `nota` | number (Integer 1-10) | Sí | - | Calificación numérica en escala oficial de 1 a 10. |
| `condicion` | string (Enum) | Sí | `APROBADO, DESAPROBADO` | Resultado (APROBADO si nota >= 4). |
| `fecha` | string (YYYY-MM-DD) | Sí | - | Fecha de carga de la nota. |
| `observacion` | string | No | - | Observaciones docentes sobre la calificación. |

**Relaciones:**
- `idAlumno` → **Alumno** (`idAlumno`) [M:1]
- `idMateria` → **Materia** (`idMateria`) [M:1]

### Endpoints Asociados

| Método | Ruta | Descripción | Parámetros y Query | Cuerpo | Respuesta | Códigos HTTP | Roles | Pantallas | Función API | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/calificaciones` | Consulta notas por filtros de alumno, tipo de evaluación o materia. | Query: ?idAlumno=, ?tipo=, ?idMateria= | `-` | `Array<CalificacionDTO>` | `200, 401, 403` | DOCENTE, ALUMNO, ADMINISTRADOR | CalificacionesDocentePage.jsx, InicioPage.jsx, ParcialesPage.jsx, SituacionAcademicaArancelariaPage.jsx, TrabajosPracticosPage.jsx | `getCalificaciones` | **real** |
| `POST` | `/api/calificaciones` | Registra o actualiza la nota individual de un alumno (escala 1 a 10 con aprobación >= 4). | - | `CalificacionDTO { idAlumno, idMateria, evaluacionNombre, tipo, nota, observacion }` | `CalificacionDTO` | `200, 201, 400, 401, 403` | DOCENTE | CalificacionesDocentePage.jsx | `saveCalificacion` | **real** |
| `POST` | `/api/calificaciones/lote` | Guarda de forma atómica y transaccional la planilla completa de calificaciones del curso. | - | `BatchCalificacionesDTO { idMateria, idCurso, evaluacionNombre, tipo, notas: [{ idAlumno, nota, observacion }] }` | `BatchResultDTO { actualizadas, creadas }` | `200, 201, 400, 401, 403` | DOCENTE | CalificacionesDocentePage.jsx | `-` | **falta** |

---

## Asistencia

Registro diario de presentismo de un alumno a una clase.

**Pantallas que la utilizan:** `AsistenciasDocentePage.jsx, AsistenciasAlumnoPage.jsx`

### Campos

| Campo | Tipo Inferido | Obligatorio | Valores Enum / Restricciones | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `idAsistencia` | number (Integer) | Sí | - | Identificador único de asistencia (PK). |
| `idAlumno` | number (Integer) | Sí | - | FK al estudiante. |
| `alumnoNombre` | string | No | - | Nombre del estudiante. |
| `idCurso` | number (Integer) | Sí | - | FK al curso/comisión. |
| `idMateria` | number (Integer) | Sí | - | FK a la materia dictada. |
| `materiaNombre` | string | No | - | Nombre de la materia. |
| `fecha` | string (YYYY-MM-DD) | Sí | - | Fecha de la clase dictada. |
| `estado` | string (Enum) | Sí | `PRESENTE, AUSENTE, TARDANZA, JUSTIFICADO` | Estado de asistencia registrado. |

**Relaciones:**
- `idAlumno` → **Alumno** (`idAlumno`) [M:1]
- `idCurso` → **Curso** (`idCurso`) [M:1]
- `idMateria` → **Materia** (`idMateria`) [M:1]

### Endpoints Asociados

| Método | Ruta | Descripción | Parámetros y Query | Cuerpo | Respuesta | Códigos HTTP | Roles | Pantallas | Función API | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/asistencias` | Consulta asistencias de alumnos por curso, materia y fecha. | Query: ?idCurso=, ?idMateria=, ?idAlumno=, ?fecha= | `-` | `Array<AsistenciaDTO>` | `200, 401, 403` | DOCENTE, ALUMNO, ADMINISTRADOR | AsistenciasAlumnoPage.jsx, AsistenciasDocentePage.jsx | `getAsistencias` | **real** |
| `POST` | `/api/asistencias/lote` | Registra en bloque la toma de lista diaria de asistencias para todo el curso. | - | `Array<AsistenciaItemDTO { idAlumno, idCurso, idMateria, fecha, estado }>` | `Array<AsistenciaDTO>` | `200, 201, 400, 401, 403` | DOCENTE | AsistenciasDocentePage.jsx | `registrarAsistencias` | **real** |

---

## MesaExamen

Turno de examen final para una materia ante un tribunal evaluador.

**Pantallas que la utilizan:** `GestionMesasPage.jsx, MesasExamenPage.jsx, InicioPage.jsx`

### Campos

| Campo | Tipo Inferido | Obligatorio | Valores Enum / Restricciones | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `idMesa` | number (Integer) | Sí | - | Identificador único de la mesa de examen (PK). |
| `idMateria` | number (Integer) | Sí | - | FK a la materia evaluada. |
| `materiaNombre` | string | No | - | Nombre de la materia evaluada. |
| `fecha` | string (YYYY-MM-DD) | Sí | - | Fecha programada del llamado. |
| `hora` | string (HH:MM) | Sí | - | Horario de inicio del examen. |
| `turno` | string (Enum) | Sí | `MAÑANA, TARDE, NOCHE` | Turno del examen final. |
| `aula` | string | No | - | Aula física de sustanciación. |
| `tribunal` | string | Sí | - | Nombres de los docentes que componen el tribunal. |
| `cupoMaximo` | number (Integer) | Sí | - | Cupo máximo de inscriptos. |
| `inscriptos` | number (Integer) | Sí | - | Cantidad actual de alumnos anotados. |
| `estadoMesa` | string (Enum) | Sí | `ABIERTA, CERRADA` | Estado de habilitación de inscripciones. |
| `alumnosInscriptosIds` | array of numbers | No | - | Lista de IDs de alumnos actualmente inscriptos. |

**Relaciones:**
- `idMateria` → **Materia** (`idMateria`) [M:1]

### Endpoints Asociados

| Método | Ruta | Descripción | Parámetros y Query | Cuerpo | Respuesta | Códigos HTTP | Roles | Pantallas | Función API | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/mesas-examen` | Lista las mesas de examen final habilitadas con cupos disponibles. | Query: ?idMateria= | `-` | `Array<MesaExamenDTO>` | `200, 401, 403` | ALUMNO, ADMINISTRADOR | GestionMesasPage.jsx, InicioPage.jsx, MesasExamenPage.jsx | `getMesasExamen` | **real** |
| `POST` | `/api/mesas-examen/{id}/inscribir` | Inscribe a un alumno a una mesa de examen final verificando cupo. | Path: id (number) | `InscripcionMesaDTO { idAlumno }` | `MesaExamenDTO { inscriptos, alumnosInscriptosIds }` | `200, 400, 401, 403, 404, 409` | ALUMNO | MesasExamenPage.jsx | `inscribirseMesa` | **real** |
| `POST` | `/api/mesas-examen/{id}/baja` | Da de baja la inscripción de un alumno a una mesa final liberando el cupo. | Path: id (number) | `BajaMesaDTO { idAlumno }` | `MesaExamenDTO { inscriptos, alumnosInscriptosIds }` | `200, 400, 401, 403, 404` | ALUMNO | MesasExamenPage.jsx | `darseDeBajaMesa` | **real** |
| `POST` | `/api/mesas-examen` | Crea una nueva mesa de examen final. | - | `MesaExamenCreateDTO { idMateria, fecha, hora, turno, aula, tribunal, cupoMaximo }` | `MesaExamenDTO` | `201, 400, 401, 403, 409` | ADMINISTRADOR | GestionMesasPage.jsx | `createMesa` | **real** |
| `PUT` | `/api/mesas-examen/{id}` | Modifica fecha, horario, aula, tribunal o cupo de la mesa de examen. | Path: id (number) | `MesaExamenUpdateDTO { fecha, hora, turno, aula, tribunal, cupoMaximo, estadoMesa }` | `MesaExamenDTO` | `200, 400, 401, 403, 404` | ADMINISTRADOR | GestionMesasPage.jsx | `updateMesa` | **real** |

---

## InscripcionMesa

Inscripción de un alumno regular a una mesa de examen final.

**Pantallas que la utilizan:** `MesasExamenPage.jsx`

### Campos

| Campo | Tipo Inferido | Obligatorio | Valores Enum / Restricciones | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `idInscripcionMesa` | number (Integer) | Sí | - | Identificador único de la inscripción a mesa (PK). |
| `idMesa` | number (Integer) | Sí | - | FK a la mesa de examen. |
| `idAlumno` | number (Integer) | Sí | - | FK al alumno inscripto. |
| `fecha` | string (YYYY-MM-DD) | Sí | - | Fecha en que se confirmó la inscripción. |
| `activa` | boolean | Sí | - | Indica si la inscripción está vigente o fue cancelada. |

**Relaciones:**
- `idMesa` → **MesaExamen** (`idMesa`) [M:1]
- `idAlumno` → **Alumno** (`idAlumno`) [M:1]

*(Gestionada a través de las operaciones de Usuario o entidades compuestas).*

---

## Solicitud

Trámite institucional o académico gestionado por un estudiante.

**Pantallas que la utilizan:** `BandejaSolicitudesPage.jsx, ConstanciasPage.jsx, DeclaracionJuradaPage.jsx, PasantiasPage.jsx, SolicitudTituloPage.jsx, SolicitudesAcademicasPage.jsx, CambioCarreraPage.jsx, ReincorporacionPage.jsx, InicioPage.jsx`

### Campos

| Campo | Tipo Inferido | Obligatorio | Valores Enum / Restricciones | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `idSolicitud` | number (Integer) | Sí | - | Identificador único del trámite (PK). |
| `idAlumno` | number (Integer) | Sí | - | FK al alumno solicitante. |
| `alumnoNombre` | string | No | - | Nombre del estudiante solicitante. |
| `tipo` | string (Enum) | Sí | `Constancia de Alumno Regular, Declaración jurada de materias a cursar, Inscripción a pasantías, Solicitud de título intermedio, Solicitudes académicas generales, CAMBIO_CARRERA, REINCORPORACION` | Categoría o tipo de solicitud presentada. |
| `motivo` | string | Sí | - | Fundamentación y detalle de la solicitud. |
| `fechaSolicitud` | string (YYYY-MM-DD) | Sí | - | Fecha de ingreso del trámite. |
| `estado` | string (Enum) | Sí | `PENDIENTE, EN_PROCESO, APROBADA, RECHAZADA` | Estado de tramitación resolutiva. |
| `fechaResolucion` | string (YYYY-MM-DD) | No | - | Fecha en que se dictaminó resolución. |
| `respuesta` | string | No | - | Dictamen oficial o respuesta escrita de secretaría. |

**Relaciones:**
- `idAlumno` → **Alumno** (`idAlumno`) [M:1]

### Endpoints Asociados

| Método | Ruta | Descripción | Parámetros y Query | Cuerpo | Respuesta | Códigos HTTP | Roles | Pantallas | Función API | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/solicitudes` | Consulta trámites y solicitudes filtradas por alumno o estado. | Query: ?idAlumno=, ?tipo=, ?estado= | `-` | `Array<SolicitudDTO>` | `200, 401, 403` | ADMINISTRATIVO, ADMINISTRADOR, ALUMNO | BandejaSolicitudesPage.jsx, ConstanciasPage.jsx, DeclaracionJuradaPage.jsx, InicioPage.jsx, PasantiasPage.jsx, ReincorporacionPage.jsx, SolicitudTituloPage.jsx, SolicitudesAcademicasPage.jsx, CambioCarreraPage.jsx | `getSolicitudes` | **real** |
| `POST` | `/api/solicitudes` | Presenta una nueva solicitud institucional (constancia, DJ, pasantía, título, reincorporación, etc.). | - | `SolicitudCreateDTO { idAlumno, tipo, motivo, observaciones }` | `SolicitudDTO` | `201, 400, 401, 403` | ALUMNO | CambioCarreraPage.jsx, ConstanciasPage.jsx, DeclaracionJuradaPage.jsx, PasantiasPage.jsx, ReincorporacionPage.jsx, SolicitudTituloPage.jsx, SolicitudesAcademicasPage.jsx | `createSolicitud` | **real** |
| `PUT` | `/api/solicitudes/{id}/resolver` | Dictamina una solicitud aprobándola o rechazándola con respuesta fundamentada. | Path: id (number) | `ResolverSolicitudDTO { estado: 'APROBADA' | 'RECHAZADA', respuesta }` | `SolicitudDTO` | `200, 400, 401, 403, 404` | ADMINISTRATIVO, ADMINISTRADOR | BandejaSolicitudesPage.jsx | `resolverSolicitud` | **real** |

---

## DeclaracionJurada

Declaración jurada de asignaturas que el estudiante cursará en el ciclo lectivo.

**Pantallas que la utilizan:** `DeclaracionJuradaPage.jsx`

### Campos

| Campo | Tipo Inferido | Obligatorio | Valores Enum / Restricciones | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `idDeclaracion` | number (Integer) | Sí | - | Identificador único de la declaración jurada (PK). |
| `idAlumno` | number (Integer) | Sí | - | FK al alumno firmante. |
| `idCiclo` | number (Integer) | Sí | - | FK al ciclo lectivo correspondiente. |
| `fecha` | string (YYYY-MM-DD) | Sí | - | Fecha de suscripción de la DJ. |
| `materiasDeclaradasIds` | array of numbers | Sí | - | Lista de IDs de materias que se compromete a cursar. |

**Relaciones:**
- `idAlumno` → **Alumno** (`idAlumno`) [M:1]
- `idCiclo` → **CicloLectivo** (`idCiclo`) [M:1]

*(Gestionada a través de las operaciones de Usuario o entidades compuestas).*

---

## Documentacion

Requisito documental o legal que el alumno debe presentar para su legajo.

**Pantallas que la utilizan:** `DocumentacionPage.jsx`

### Campos

| Campo | Tipo Inferido | Obligatorio | Valores Enum / Restricciones | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `idDocumento` | number (Integer) | Sí | - | Identificador único del requisito (PK). |
| `idAlumno` | number (Integer) | Sí | - | FK al alumno titular del legajo. |
| `tipo` | string (Enum) | Sí | `DNI (Frente y Dorso), Título Secundario / Certificado Analítico, Certificado de Aptitud Médica, Fotos 4x4 (2 unidades)` | Tipo de documento exigido por la institución. |
| `estado` | string (Enum) | Sí | `ENTREGADO, PENDIENTE` | Estado de recepción documental. |
| `obligatorio` | boolean | Sí | - | Si es condición obligatoria para la regularidad. |
| `fechaEntrega` | string (YYYY-MM-DD) | No | - | Fecha en que se recepcionó el papel en secretaría. |
| `observaciones` | string | No | - | Observaciones de control legal o formal. |

**Relaciones:**
- `idAlumno` → **Alumno** (`idAlumno`) [M:1]

### Endpoints Asociados

| Método | Ruta | Descripción | Parámetros y Query | Cuerpo | Respuesta | Códigos HTTP | Roles | Pantallas | Función API | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/documentacion` | Consulta el estado de entrega de los documentos de legajo del alumno. | Query: ?idAlumno= | `-` | `Array<DocumentacionDTO>` | `200, 401, 403` | ALUMNO, ADMINISTRATIVO, ADMINISTRADOR | DocumentacionPage.jsx | `getDocumentacion` | **real** |
| `PUT` | `/api/documentacion/{id}` | Marca la recepción o actualiza observaciones de un documento de legajo. | Path: id (number) | `DocumentacionUpdateDTO { estado: 'ENTREGADO' | 'PENDIENTE', observaciones }` | `DocumentacionDTO` | `200, 400, 401, 403, 404` | ADMINISTRATIVO, ADMINISTRADOR | DocumentacionPage.jsx (auxiliar) | `updateDocumentacion` | **real** |

---

## Usuario

Cuenta de autenticación y acceso al sistema de gestión Academit.

**Pantallas que la utilizan:** `GestionUsuariosPage.jsx, Login.jsx, MisDatosPage.jsx, CambiarPasswordPage.jsx`

### Campos

| Campo | Tipo Inferido | Obligatorio | Valores Enum / Restricciones | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `idUsuario` | number (Integer) | Sí | - | Identificador único de la cuenta de usuario (PK). |
| `username` | string | Sí | - | Nombre de usuario único para login. |
| `nombre` | string | Sí | - | Nombre y apellido completo del usuario. |
| `email` | string | Sí | - | Correo electrónico registrado. |
| `rol` | string (Enum) | Sí | `ADMINISTRADOR, ADMINISTRATIVO, DOCENTE, ALUMNO` | Rol asignado para permisos del portal. |
| `estado` | string (Enum) | Sí | `ACTIVO, INACTIVO` | Estado de la cuenta. |
| `ultimoAcceso` | string (Timestamp) | No | - | Fecha y hora del último acceso al sistema. |

### Endpoints Asociados

| Método | Ruta | Descripción | Parámetros y Query | Cuerpo | Respuesta | Códigos HTTP | Roles | Pantallas | Función API | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Autentica credenciales de usuario y abre sesión en el portal. | - | `LoginDTO { username, password }` | `SesionDTO { usuario, nombre, rol, token }` | `200, 400, 401` | PÚBLICO | Login.jsx (vía AuthContext) | `loginApi` | **real** |
| `POST` | `/api/auth/logout` | Cierra la sesión activa del usuario e invalida token o cookie. | - | `-` | `200 OK (o 204 No Content)` | `200, 204, 401` | AUTENTICADO | Layout.jsx (vía AuthContext) | `logoutApi` | **real** |
| `POST` | `/api/auth/cambiar-password` | Permite al usuario autenticado cambiar su clave de acceso personal. | - | `CambioPasswordDTO { actual, nueva }` | `MensajeDTO { success: true }` | `200, 400, 401` | AUTENTICADO | CambiarPasswordPage.jsx | `cambiarPasswordApi` | **real** |
| `GET` | `/api/usuarios` | Lista todas las cuentas de usuario y sus roles asignados. | Query: ?rol=, ?estado= | `-` | `Array<UsuarioDTO>` | `200, 401, 403` | ADMINISTRADOR | GestionUsuariosPage.jsx | `getUsuarios` | **real** |
| `POST` | `/api/usuarios` | Crea una nueva cuenta de usuario en el sistema. | - | `UsuarioCreateDTO { username, nombre, email, rol, estado }` | `UsuarioDTO` | `201, 400, 401, 403, 409` | ADMINISTRADOR | GestionUsuariosPage.jsx | `createUsuario` | **real** |
| `PUT` | `/api/usuarios/{id}` | Modifica datos de cuenta, rol o estado de un usuario. | Path: id (number) | `UsuarioUpdateDTO { nombre, email, rol, estado }` | `UsuarioDTO` | `200, 400, 401, 403, 404` | ADMINISTRADOR | GestionUsuariosPage.jsx | `updateUsuario` | **real** |
| `DELETE` | `/api/usuarios/{id}` | Desactiva la cuenta de un usuario en el sistema. | Path: id (number) | `-` | `204 No Content` | `200, 204, 401, 403, 404` | ADMINISTRADOR | GestionUsuariosPage.jsx | `deleteUsuario` | **real** |
| `GET` | `/api/usuarios/me` | Obtiene la ficha personal y datos de filiación del usuario conectado. | - | `-` | `PerfilUsuarioDTO { username, nombre, email, telefono, direccion, rol }` | `200, 401` | AUTENTICADO | MisDatosPage.jsx | `-` | **falta** |
| `PUT` | `/api/usuarios/me` | Actualiza la información personal de contacto del usuario en sesión (acción simulada en el front). | - | `UpdatePerfilDTO { email, telefono, direccion }` | `PerfilUsuarioDTO` | `200, 400, 401` | AUTENTICADO | MisDatosPage.jsx | `-` | **falta** |

---

## Rol

Perfil de seguridad que define los privilegios y menús de acceso.

**Pantallas que la utilizan:** `GestionUsuariosPage.jsx, Login.jsx, MisDatosPage.jsx`

### Campos

| Campo | Tipo Inferido | Obligatorio | Valores Enum / Restricciones | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `idRol` | number (Integer) | Sí | - | Identificador del rol (PK). |
| `nombre` | string (Enum) | Sí | `ADMINISTRADOR, ADMINISTRATIVO, DOCENTE, ALUMNO` | Nombre del rol de usuario. |

*(Gestionada a través de las operaciones de Usuario o entidades compuestas).*

---

## Endpoints de Procesos del Negocio

Aquellas operaciones transaccionales complejas que van más allá del CRUD estándar de una tabla:

### 1. Registrar Pago y Emisión de Recibo
- **Método y Ruta:** `POST /api/pagos`
- **Descripción:** Cancela la obligación de una cuota o arancel y genera el comprobante contable.
- **Lógica esperada:** Recibe `{ idAlumno, idCuota, monto, medioPago, fechaPago }`. Verifica que la cuota no esté paga, cambia su estado a `PAGADA`, registra el registro de pago y devuelve el comprobante oficial (ej. `REC-2026-0001`).

### 2. Generación Masiva de Cuotas Periódicas
- **Método y Ruta:** `POST /api/cuotas/generar`
- **Descripción:** Emisión mensual de obligaciones de pago para todos los alumnos con matrícula activa.
- **Lógica esperada:** Recibe `{ idCiclo, mes, monto, vencimiento }`. Proceso batch que recorre todas las matrículas activas del ciclo lectivo y genera las cuotas con estado `PENDIENTE`. Actualmente falta en el backend y es requerido por `AdminCuotasPage.jsx`.

### 3. Inscripción a Cursos con Control de Cupo
- **Método y Ruta:** `POST /api/inscripciones`
- **Descripción:** Inscripción a división verificando coincidencia de carrera, estado de matrícula y vacante disponible.
- **Lógica esperada:** Recibe `{ idAlumno, idCurso, cicloLectivo }`. El backend debe validar: 1) Matrícula activa del alumno, 2) Que el curso pertenezca a la misma carrera del alumno, 3) Que `inscriptos < capacidadMaxima`. Incrementa `inscriptos` y crea la inscripción `CONFIRMADA`.

### 4. Calificaciones en Lote (Planilla de Cátedra)
- **Método y Ruta:** `POST /api/calificaciones/lote`
- **Descripción:** Carga y consolidación masiva de calificaciones para una división completa.
- **Lógica esperada:** Recibe `{ idMateria, idCurso, evaluacionNombre, tipo, notas: [...] }`. Guarda de forma atómica todas las notas del curso evitando N peticiones individuales. Actualiza la condición (`APROBADO` si >= 4) en una única transacción.

### 5. Asistencias por Curso y Fecha
- **Método y Ruta:** `POST /api/asistencias/lote`
- **Descripción:** Toma de lista diaria de presentismo por comisión y materia.
- **Lógica esperada:** Recibe una lista de registros `{ idAlumno, idCurso, idMateria, fecha, estado }`. Inserta o actualiza el presentismo asegurando la restricción única `(idAlumno, idCurso, fecha)`.

### 6. Situación Administrativa Consolidada
- **Método y Ruta:** `GET /api/alumnos/{id}/situacion-administrativa`
- **Descripción:** Cálculo en tiempo real del balance deudor, cuotas vencidas y regularidad económica.
- **Lógica esperada:** Agrupa todas las cuotas del alumno, calcula deuda acumulada, cuotas abonadas y estado de matrícula para determinar si el estudiante se encuentra habilitado financieramente.

### 7. Tramitación de Cambio de Carrera
- **Método y Ruta:** `POST /api/solicitudes`
- **Descripción:** Solicitud formal de transferencia de carrera iniciada por el alumno.
- **Lógica esperada:** El alumno presenta trámite con `tipo = 'CAMBIO_CARRERA'` indicando carrera destino y motivos. Queda en estado `PENDIENTE` en la bandeja directiva.

### 8. Resolución de Solicitudes y Trámites
- **Método y Ruta:** `PUT /api/solicitudes/{id}/resolver`
- **Descripción:** Dictamen fundado de secretaría académica aprobando o rechazando una solicitud.
- **Lógica esperada:** La secretaría actualiza la solicitud asignando `estado = 'APROBADA' | 'RECHAZADA'` junto con la fundamentación escrita oficial en el campo `respuesta`.

### 9. Autenticación y Control de Sesión (Login / Logout)
- **Método y Ruta:** `POST /api/auth/login  |  /api/auth/logout`
- **Descripción:** Apertura, verificación de roles e invalidación segura de sesiones de usuario.
- **Lógica esperada:** Verifica credenciales, valida `activo == true`, retorna el rol y token/cookie para el `AuthContext`. Al cerrar sesión invalida el token y limpia el almacenamiento del navegador.

---

## Problemas Encontrados y Recomendaciones

### 1. Acciones Simuladas sin llamada a la API (Endpoints Faltantes)
- **Severidad:** `Alta`
- **Diagnóstico:** En la pantalla `MisDatosPage.jsx`, la acción de editar los datos personales (`handleSubmit`) modifica únicamente el estado local de React y despliega un Toast de éxito, sin invocar ningún servicio de `src/api/`.
- **Impacto en el sistema:** Los datos editados por el usuario no se persisten en ningún lado y se pierden al recargar la página.
- **Acción recomendada:** Crear en `src/api/usuarios.js` las funciones `getMiPerfil()` (`GET /api/usuarios/me`) y `updateMiPerfil(data)` (`PUT /api/usuarios/me`) y consumirlas en `MisDatosPage.jsx`.

### 2. Carga de Calificaciones sin Endpoint Transaccional en Lote
- **Severidad:** `Alta`
- **Diagnóstico:** En `CalificacionesDocentePage.jsx`, al presionar 'Guardar Calificaciones', la función `handleGuardarTodas` realiza un `Promise.all` disparando múltiples peticiones HTTP individuales en paralelo a `POST /api/calificaciones` (una por cada alumno).
- **Impacto en el sistema:** Sobrecarga de peticiones sobre el servidor, potencial inconsistencia parcial si una petición falla a mitad de camino y falta de atomicidad transaccional.
- **Acción recomendada:** Implementar en el backend y en la API frontend el endpoint `POST /api/calificaciones/lote` para enviar la lista completa en un único payload transaccional.

### 3. Rutas no RESTful para Cancelación e Inscripción
- **Severidad:** `Media`
- **Diagnóstico:** Se detectaron rutas que utilizan verbos como sustantivos en la URL:
  - `POST /api/matriculas/cancelar`: Debería ser `DELETE /api/matriculas/{id}` o `PATCH /api/matriculas/{id}/cancelar`.
  - `POST /api/mesas-examen/{id}/inscribir` y `POST /api/mesas-examen/{id}/baja`: Deberían seguir la convención de subrecurso `POST /api/mesas-examen/{id}/inscripciones` y `DELETE /api/mesas-examen/{id}/inscripciones/{idInscripcion}`.
  - `PUT /api/solicitudes/{id}/resolver`: Debería ser `PATCH /api/solicitudes/{id}` con el nuevo estado y resolución.
- **Impacto en el sistema:** Desvío de los estándares REST de la industria y dificultad de cacheo o diseño de API uniforme.
- **Acción recomendada:** Adoptar en el diseño de controladores de Spring Boot las rutas REST estándar orientadas a recursos.

### 4. Duplicación y Conflicto en el Registro de Pagos
- **Severidad:** `Media`
- **Diagnóstico:** Existen dos funciones que compiten para registrar cobros:
  - `registrarPago(pagoData)` en `src/api/pagos.js` apuntando a `POST /api/pagos`.
  - `pagarCuota(idCuota, medioPago)` en `src/api/cuotas.js` apuntando a `POST /api/cuotas/{id}/pagar`.
- **Impacto en el sistema:** Ambigüedad conceptual sobre qué entidad gestiona la transacción financiera y la generación del recibo.
- **Acción recomendada:** Unificar el proceso: `POST /api/pagos` debe ser el único endpoint financiero que reciba el pago, registre la transacción y marque la cuota asociada como `PAGADA`.

### 5. Ausencia de Endpoint para Emisión / Generación de Cuotas
- **Severidad:** `Media`
- **Diagnóstico:** `AdminCuotasPage.jsx` solo permite consultar cuotas existentes (`getCuotas`). No existe ninguna función en la capa API ni en la interfaz para que el administrativo ejecute la emisión periódica o masiva de las cuotas del mes.
- **Impacto en el sistema:** Imposibilidad de que el instituto emita nuevas cuotas para cobrar en los ciclos lectivos venideros.
- **Acción recomendada:** Incorporar el endpoint `POST /api/cuotas/generar` asociado al ciclo lectivo.

### 6. Auditoría de Mocks Directos en Pantallas (Cumplimiento Verificado)
- **Severidad:** `Informativa (Positiva)`
- **Diagnóstico:** Se verificó si alguna vista de `src/pages/` importaba `mocks/data.js` de forma directa.
- **Impacto en el sistema:** Ninguna pantalla ni componente importa datos mock directamente. **100% de las páginas pasan por la capa de abstracción `src/api/`** respetando el flag `VITE_USE_MOCK`.
- **Acción recomendada:** Mantener esta disciplina arquitectónica en los desarrollos futuros.

---

## Comparación con el Diseño (DER)

> **Nota sobre el archivo de diseño:** El archivo `docs/uml/06-der.puml` no existe en esa ruta física exacta; sin embargo, el modelo Entidad-Relación oficial del proyecto se encuentra documentado y decodificado en `docs/Entregables/entregable 2/der.md`. Se realizó la auditoría comparativa exhaustiva contra dicho diseño formal.

### 1. Entidades del Frontend ausentes en el DER
- **`Solicitud` (`solicitudes`):** Central en la aplicación web para trámites de estudiantes (constancias, pasantías, cambio de carrera, título intermedio, reincorporaciones). En el DER físico no fue modelada una tabla genérica de solicitudes o trámites.
- **`Documentacion` (`documentacion`):** Administra los requisitos legales del legajo del alumno (fotocopias, fotos, certificado de salud, título secundario). No existe en el DER relacional.

### 2. Entidades del DER ausentes o integradas en el Frontend
- **`CORRELATIVA`:** En el DER es una tabla intermedia relacional `(id_plan, id_materia, id_materia_requerida)`. En el frontend se modeló de forma desnormalizada como un arreglo numérico dentro de cada materia: `correlativas: [101, 102]`.
- **`PLAN_MATERIA`:** En el DER vincula `PLAN_ESTUDIO` con `MATERIA` asociando `anio_plan`. En el frontend, `Materia` contiene directamente `idPlan`, `idCarrera` y `anio`.
- **`DECLARACION_MATERIA`:** En el DER vincula la declaración jurada con sus materias. En el frontend se maneja como lista dentro de la solicitud.
- **`ROL`:** En el DER es una tabla física con `id_rol` y `nombre`. En el frontend, `Usuario` posee directamente el rol como string enum (`ADMINISTRADOR`, `ADMINISTRATIVO`, `DOCENTE`, `ALUMNO`).

### 3. Campos del Frontend que no están en el DER (Desnormalizaciones para UI)
El frontend incorpora campos desnormalizados para optimizar el rendimiento y evitar múltiples llamadas en cascada:
- Nombres de entidades relacionadas en DTOs: `alumnoNombre`, `materiaNombre`, `cursoNombre`, `carreraNombre`, `planNombre`, `docenteNombre`.
- Atributos calculados y contadores: `cuposDisponibles`, `inscriptos`, `cursosCount`, `planesCount`, `alumnosInscriptosIds`.
- Códigos y legajos sintéticos: `legajo` en Alumno (`ALU-1001`), `legajo` en Docente (`DOC-201`), `codigo` en Carrera (`TSDS`), `codigo` en Curso (`1A-INF-TM`).
- Claves foráneas directas: `idCarrera` en `Alumno`, `idCarrera` en `Materia`, `idAlumno` en `Cuota` y `Pago` (en el DER, `Pago` apunta a `Cuota`, `Cuota` a `Matricula` y `Matricula` a `Alumno`).

### 4. Campos del DER que el Frontend no utiliza
- `domicilio` en `ALUMNO`: El frontend utiliza `direccion`.
- `fecha_ingreso` en `ALUMNO`: El frontend utiliza `cicloLectivo`.
- `titulo` en `DOCENTE`: El frontend utiliza `especialidad`.
- `duracion_anios` en `CARRERA`: El frontend utiliza `duracion` de tipo string (ej. `'3 años'`).
- `anio_vigencia` en `PLAN_ESTUDIO`: El frontend utiliza `anioResolucion`.
- `password_hash`, `id_rol`, `id_alumno`, `id_docente` en `USUARIO`: En el frontend la seguridad y hashes son gestionados en backend y solo se recibe el perfil del usuario activo.

### 5. Diferencias de Nomenclatura y Convenciones
| Concepto | Nombre en Frontend (camelCase) | Nombre en DER (snake_case) | Comentario |
| :--- | :--- | :--- | :--- |
| Identificador Alumno | `idAlumno` | `id_alumno` | Convención estándar JS vs SQL |
| Domicilio | `direccion` | `domicilio` | Sinónimo semántico |
| Importe monetario | `monto` | `importe` | En cuotas, pagos y matrículas |
| Título docente | `especialidad` | `titulo` | Especialidad curricular vs título académico |
| Identificador Asignación | `idAsignacion` | `id_curso_materia` | Nombre simplificado en UI |
| Número de Cuota | `numeroCuota` | `numero` | Mayor claridad contextual |
| Fecha de Matrícula | `fechaAlta` | `fecha` | Atributo de creación |
| Canal de pago | `medioPago` | `medio_pago` | Convención de nombres |
| Fecha de nacimiento | `fechaNacimiento` | `fecha_nacimiento` | Convención de nombres |
