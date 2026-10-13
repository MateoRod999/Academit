# Relevamiento de Entidades y Endpoints de la Maqueta Frontend

> **Documento de Auditoría y Especificación de Contratos**  
> **Proyecto:** Academit - Sistema de Gestión del Instituto  
> **Ubicación:** `docs/frontend/entidades-y-endpoints.md`  
> **Alcance:** Auditoría arquitectónica del frontend (`frontend/src/`) y alineación con el Diseño Entidad-Relación (DER).

---

## Resumen Ejecutivo

Este informe documenta el inventario completo de entidades de dominio, atributos, relaciones y endpoints REST que gobiernan el intercambio de información entre la interfaz de usuario en React y la futura API del backend en Spring Boot.

- **Total de Entidades Identificadas:** 22
- **Total de Endpoints en el Contrato:** 68
- **Endpoints Implementados en API (`real`):** 68 (100.0%)
- **Endpoints Inferidos / Convención REST (`inferido`):** 0 (0.0%)
- **Endpoints Faltantes / Brechas (`falta`):** 0 (0.0%)

---

## 1. Inventario de Entidades de Dominio

A continuación se presenta cada una de las entidades del frontend con su descripción, atributos completos, tipos de datos, cardinalidades y pantallas asociadas.

### 1.1 Entidad: `Alumno`
**Descripción:** Estudiante inscripto en el instituto educativo.

| Campo | Tipo de Dato | Requerido | Valores Permitidos (Enum) | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `idAlumno` | `number (Integer)` | Sí | - | Identificador único del alumno (PK). |
| `legajo` | `string` | Sí | - | Código identificatorio institucional (ej. ALU-1001). |
| `nombre` | `string` | Sí | - | Nombres del estudiante. |
| `apellido` | `string` | Sí | - | Apellidos del estudiante. |
| `dni` | `string` | Sí | - | Documento Nacional de Identidad único. |
| `email` | `string` | Sí | - | Correo electrónico de contacto. |
| `telefono` | `string` | No | - | Teléfono de contacto. |
| `domicilio` | `string` | No | - | Domicilio residencial del estudiante. |
| `fechaNacimiento` | `string (YYYY-MM-DD)` | Sí | - | Fecha de nacimiento. |
| `idCarrera` | `number (Integer)` | Sí | - | FK a la Carrera en la que está inscripto. |
| `carrera` | `string` | No | - | Nombre desnormalizado de la carrera. |
| `idPlan` | `number (Integer)` | Sí | - | FK al Plan de Estudio asignado. |
| `planNombre` | `string` | No | - | Nombre desnormalizado del plan curricular. |
| `idCurso` | `number (Integer)` | No | - | FK al curso/comisión principal asignada. |
| `cursoNombre` | `string` | No | - | Nombre del curso asignado. |
| `cicloLectivo` | `number (Integer)` | Sí | - | Año lectivo de ingreso o cursada activa. |
| `estado` | `string (Enum)` | Sí | `REGULAR, ACTIVO, INACTIVO` | Condición académica institucional. |
| `estadoMatricula` | `string (Enum)` | Sí | `ACTIVA, PENDIENTE, CANCELADA` | Estado de la matrícula para el ciclo lectivo actual. |
| `idMatricula` | `number (Integer)` | No | - | FK a la matrícula del ciclo actual. |

**Relaciones:**
- Con `Carrera` (M:1): `idCarrera` -> `idCarrera`
- Con `PlanEstudio` (M:1): `idPlan` -> `idPlan`
- Con `Curso` (M:1): `idCurso` -> `idCurso`
- Con `Matricula` (1:1): `idMatricula` -> `idMatricula`

**Pantallas que la consumen:** `GestionAlumnosPage.jsx, GestionInscripcionesPage.jsx, AdminMatriculasPage.jsx, AdminCuotasPage.jsx, AdminPagosPage.jsx, AdminSituacionAlumnoPage.jsx, AdminDeudasPage.jsx, AsistenciasDocentePage.jsx, CalificacionesDocentePage.jsx, InicioPage.jsx, MisDatosPage.jsx`

---

### 1.2 Entidad: `Docente`
**Descripción:** Profesor o docente que dicta asignaturas en el instituto.

| Campo | Tipo de Dato | Requerido | Valores Permitidos (Enum) | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `idDocente` | `number (Integer)` | Sí | - | Identificador único del docente (PK). |
| `legajo` | `string` | Sí | - | Código identificatorio del docente (ej. DOC-201). |
| `nombre` | `string` | Sí | - | Nombres del docente. |
| `apellido` | `string` | Sí | - | Apellidos del docente. |
| `dni` | `string` | Sí | - | Documento Nacional de Identidad único. |
| `email` | `string` | Sí | - | Correo electrónico institucional. |
| `telefono` | `string` | No | - | Teléfono de contacto. |
| `titulo` | `string` | No | - | Título académico o área de habilitación docente. |
| `estado` | `string (Enum)` | Sí | `ACTIVO, INACTIVO` | Estado operativo del docente. |

**Pantallas que la consumen:** `GestionDocentesPage.jsx, GestionAsignacionesPage.jsx`

---

### 1.3 Entidad: `Carrera`
**Descripción:** Oferta académica o tecnicatura superior dictada por el instituto.

| Campo | Tipo de Dato | Requerido | Valores Permitidos (Enum) | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `idCarrera` | `number (Integer)` | Sí | - | Identificador único de la carrera (PK). |
| `codigo` | `string` | Sí | `TSDS, TSCDIA` | Código corto o sigla oficial. |
| `nombre` | `string` | Sí | - | Denominación oficial de la carrera. |
| `tituloOtorgado` | `string` | No | - | Título expedido al egresar. |
| `duracionAnios` | `number (Integer)` | Sí | - | Duración de cursada en años (ej. 3). |
| `resolucion` | `string` | No | - | Resolución ministerial habilitante. |
| `estado` | `string (Enum)` | Sí | `ACTIVA, INACTIVA` | Estado de vigencia académica. |
| `planesCount` | `number (Integer)` | No | - | Cantidad desnormalizada de planes asociados. |
| `cursosCount` | `number (Integer)` | No | - | Cantidad desnormalizada de comisiones activas. |

**Pantallas que la consumen:** `GestionCarrerasPage.jsx, GestionAlumnosPage.jsx, GestionCursosPage.jsx, GestionPlanEstudiosPage.jsx, CambioCarreraPage.jsx`

---

### 1.4 Entidad: `PlanEstudio`
**Descripción:** Currícula de materias estructurada para una cohorte y carrera. En el modelo relacional físico se vincula a través de la relación muchos a muchos PlanMateria (con anio_plan). En el frontend se consume la lista de materias del plan mediante el endpoint GET /api/planes-estudio/{id}/materias.

| Campo | Tipo de Dato | Requerido | Valores Permitidos (Enum) | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `idPlan` | `number (Integer)` | Sí | - | Identificador único del plan (PK). |
| `codigo` | `string` | Sí | `PLAN-2024, PLAN-2025` | Código identificatorio del plan. |
| `nombre` | `string` | Sí | - | Nombre del plan curricular. |
| `idCarrera` | `number (Integer)` | Sí | - | FK a la carrera asociada. |
| `carreraNombre` | `string` | No | - | Nombre de la carrera desnormalizado. |
| `anioResolucion` | `number (Integer)` | Sí | - | Año de aprobación o entrada en vigencia. |
| `horasTotales` | `number (Integer)` | No | - | Carga horaria total de la currícula. |
| `cantidadMaterias` | `number (Integer)` | No | - | Total de asignaturas del plan. |
| `estado` | `string (Enum)` | Sí | `VIGENTE, CADUCO` | Estado reglamentario del plan. |

**Relaciones:**
- Con `Carrera` (M:1): `idCarrera` -> `idCarrera`

**Pantallas que la consumen:** `GestionPlanEstudiosPage.jsx, GestionAlumnosPage.jsx, GestionCarrerasPage.jsx, PlanEstudiosAlumnoPage.jsx`

---

### 1.5 Entidad: `Materia`
**Descripción:** Asignatura curricular del instituto. En base de datos la asociación a planes es muchos a muchos (PlanMateria). En frontend se consulta por plan con su régimen y correlatividades.

| Campo | Tipo de Dato | Requerido | Valores Permitidos (Enum) | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `idMateria` | `number (Integer)` | Sí | - | Identificador único de la materia (PK). |
| `codigo` | `string` | Sí | - | Código identificatorio (ej. MAT-101, CD-101). |
| `nombre` | `string` | Sí | - | Nombre de la materia. |
| `idCarrera` | `number (Integer)` | Sí | - | FK a la carrera a la que pertenece. |
| `carreraNombre` | `string` | No | - | Nombre de la carrera para visualización. |
| `idPlan` | `number (Integer)` | Sí | - | FK al plan curricular. |
| `anio` | `number (Integer)` | Sí | - | Año de cursada en la carrera (1, 2, 3). |
| `regimen` | `string (Enum)` | Sí | `CUATRIMESTRAL, ANUAL` | Régimen académico de dictado. |
| `horasSemanales` | `number (Integer)` | No | - | Horas semanales de cursada. |
| `correlativas` | `array of numbers` | No | - | Lista de identificadores idMateria de correlativas requeridas. |

**Relaciones:**
- Con `Carrera` (M:1): `idCarrera` -> `idCarrera`
- Con `PlanEstudio` (M:1): `idPlan` -> `idPlan`

**Pantallas que la consumen:** `GestionMateriasPage.jsx, GestionPlanEstudiosPage.jsx, GestionAsignacionesPage.jsx, GestionMesasPage.jsx, PlanEstudiosAlumnoPage.jsx, AsistenciasDocentePage.jsx, CalificacionesDocentePage.jsx, EvaluacionesDocentePage.jsx`

---

### 1.6 Entidad: `Curso`
**Descripción:** Comisión o división de cursada para un año y turno específico.

| Campo | Tipo de Dato | Requerido | Valores Permitidos (Enum) | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `idCurso` | `number (Integer)` | Sí | - | Identificador único de la comisión (PK). |
| `codigo` | `string` | Sí | - | Código identificatorio (ej. 1A-INF-TM, 1A-CD-TM). |
| `nombre` | `string` | Sí | - | Nombre descriptivo de la comisión. |
| `idCarrera` | `number (Integer)` | Sí | - | FK a la carrera a la que pertenece. |
| `carreraNombre` | `string` | No | - | Nombre de la carrera para visualización. |
| `idPlan` | `number (Integer)` | No | - | FK al plan curricular. |
| `turno` | `string (Enum)` | Sí | `MAÑANA, TARDE, NOCHE` | Turno de cursada. |
| `aula` | `string` | No | - | Aula física o laboratorio asignado. |
| `capacidadMaxima` | `number (Integer)` | Sí | - | Cupo máximo de inscriptos. |
| `inscriptos` | `number (Integer)` | Sí | - | Cantidad actual de alumnos inscriptos. |
| `cuposDisponibles` | `number (Integer)` | Sí | - | Vacantes disponibles restantes. |
| `cicloLectivo` | `number (Integer)` | Sí | - | Año lectivo al que corresponde la comisión. |

**Relaciones:**
- Con `Carrera` (M:1): `idCarrera` -> `idCarrera`
- Con `PlanEstudio` (M:1): `idPlan` -> `idPlan`

**Pantallas que la consumen:** `GestionCursosPage.jsx, GestionInscripcionesPage.jsx, GestionAsignacionesPage.jsx, MisCursosPage.jsx, AsistenciasDocentePage.jsx, CalificacionesDocentePage.jsx, EvaluacionesDocentePage.jsx`

---

### 1.7 Entidad: `CicloLectivo`
**Descripción:** Período lectivo anual del instituto que agrupa cursadas, matrículas e inscripciones.

| Campo | Tipo de Dato | Requerido | Valores Permitidos (Enum) | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `idCiclo` | `number (Integer)` | Sí | - | Identificador único del ciclo (PK). |
| `anio` | `number (Integer)` | Sí | - | Año calendario del ciclo (ej. 2026). |
| `nombre` | `string` | Sí | - | Denominación del ciclo lectivo. |
| `fechaInicio` | `string (YYYY-MM-DD)` | Sí | - | Fecha de inicio del ciclo escolar. |
| `fechaFin` | `string (YYYY-MM-DD)` | Sí | - | Fecha de finalización del ciclo escolar. |
| `estado` | `string (Enum)` | Sí | `ACTIVO, CERRADO` | Estado operativo del ciclo. |

**Pantallas que la consumen:** `GestionCiclosLectivosPage.jsx, GestionInscripcionesPage.jsx`

---

### 1.8 Entidad: `Asignacion`
**Descripción:** Vínculo tripartito entre docente, curso y materia (CursoMateria).

| Campo | Tipo de Dato | Requerido | Valores Permitidos (Enum) | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `idAsignacion` | `number (Integer)` | Sí | - | Identificador único de la asignación (PK). |
| `idDocente` | `number (Integer)` | Sí | - | FK al docente asignado. |
| `docenteNombre` | `string` | No | - | Nombre y apellido del docente. |
| `idCurso` | `number (Integer)` | Sí | - | FK a la comisión o curso. |
| `cursoNombre` | `string` | No | - | Nombre de la comisión. |
| `idMateria` | `number (Integer)` | Sí | - | FK a la materia dictada. |
| `materiaNombre` | `string` | No | - | Nombre de la materia. |
| `rolDocente` | `string (Enum)` | Sí | `TITULAR, ADJUNTO, JTP` | Rol en la cátedra. |

**Relaciones:**
- Con `Docente` (M:1): `idDocente` -> `idDocente`
- Con `Curso` (M:1): `idCurso` -> `idCurso`
- Con `Materia` (M:1): `idMateria` -> `idMateria`

**Pantallas que la consumen:** `GestionAsignacionesPage.jsx, MisCursosPage.jsx`

---

### 1.9 Entidad: `Inscripcion`
**Descripción:** Inscripción formal de un alumno a una comisión/curso específico.

| Campo | Tipo de Dato | Requerido | Valores Permitidos (Enum) | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `idInscripcion` | `number (Integer)` | Sí | - | Identificador único de inscripción (PK). |
| `idAlumno` | `number (Integer)` | Sí | - | FK al alumno inscripto. |
| `alumnoNombre` | `string` | No | - | Nombre del alumno. |
| `idCurso` | `number (Integer)` | Sí | - | FK al curso inscripto. |
| `cursoNombre` | `string` | No | - | Nombre del curso inscripto. |
| `cicloLectivo` | `number (Integer)` | Sí | - | Año de la cursada. |
| `fechaInscripcion` | `string (YYYY-MM-DD)` | Sí | - | Fecha de confirmación de la inscripción. |
| `estado` | `string (Enum)` | Sí | `CONFIRMADA, CANCELADA` | Estado de la inscripción. |

**Relaciones:**
- Con `Alumno` (M:1): `idAlumno` -> `idAlumno`
- Con `Curso` (M:1): `idCurso` -> `idCurso`

**Pantallas que la consumen:** `GestionInscripcionesPage.jsx`

---

### 1.10 Entidad: `Matricula`
**Descripción:** Registro anual de matrícula académica que habilita la cursada del alumno.

| Campo | Tipo de Dato | Requerido | Valores Permitidos (Enum) | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `idMatricula` | `number (Integer)` | Sí | - | Identificador único de la matrícula (PK). |
| `idAlumno` | `number (Integer)` | Sí | - | FK al alumno matriculado. |
| `alumnoNombre` | `string` | No | - | Nombre del alumno. |
| `cicloLectivo` | `number (Integer)` | Sí | - | Año del ciclo lectivo. |
| `importe` | `number (Monetario)` | Sí | - | Arancel fijado para la matrícula. |
| `fechaAlta` | `string (YYYY-MM-DD)` | Sí | - | Fecha de emisión de la matrícula. |
| `estado` | `string (Enum)` | Sí | `ACTIVA, PENDIENTE, CANCELADA` | Estado administrativo de la matrícula. |
| `estadoPago` | `string (Enum)` | Sí | `PAGADA, PENDIENTE, ANULADA` | Estado del pago del arancel. |

**Relaciones:**
- Con `Alumno` (M:1): `idAlumno` -> `idAlumno`

**Pantallas que la consumen:** `AdminMatriculasPage.jsx, AdminSituacionAlumnoPage.jsx, CancelarMatriculaPage.jsx, SituacionAcademicaArancelariaPage.jsx`

---

### 1.11 Entidad: `Cuota`
**Descripción:** Obligación de pago arancelario periódica (cuota mensual o seguro cuatrimestral).

| Campo | Tipo de Dato | Requerido | Valores Permitidos (Enum) | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `idCuota` | `number (Integer)` | Sí | - | Identificador único de la cuota (PK). |
| `idAlumno` | `number (Integer)` | Sí | - | FK al alumno deudor. |
| `alumnoNombre` | `string` | No | - | Nombre del alumno. |
| `concepto` | `string` | Sí | - | Descripción del concepto facturado. |
| `tipo` | `string (Enum)` | Sí | `CUOTA_MENSUAL, SEGURO_CUATRIMESTRAL` | Tipo de obligación arancelaria. |
| `numero` | `number (Integer)` | Sí | - | Número ordinal de cuota. |
| `periodo` | `string` | Sí | - | Mes y año correspondiente (ej. 'Marzo 2026'). |
| `importe` | `number (Monetario)` | Sí | - | Importe de la cuota. |
| `fechaVencimiento` | `string (YYYY-MM-DD)` | Sí | - | Fecha límite de pago. |
| `estado` | `string (Enum)` | Sí | `PAGADA, PENDIENTE, VENCIDA` | Estado de cobranza. |
| `fechaPago` | `string (YYYY-MM-DD)` | No | - | Fecha de cancelación de la cuota. |
| `comprobante` | `string` | No | - | Número de recibo asociado si está paga. |

**Relaciones:**
- Con `Alumno` (M:1): `idAlumno` -> `idAlumno`

**Pantallas que la consumen:** `AdminCuotasPage.jsx, AdminDeudasPage.jsx, AdminPagosPage.jsx, AdminSituacionAlumnoPage.jsx, InicioPage.jsx, SituacionAcademicaArancelariaPage.jsx`

---

### 1.12 Entidad: `Pago`
**Descripción:** Transacción financiera de cobro de una cuota o arancel. Se realiza por el importe exacto de la cuota (RN09) y el usuario cobrador se obtiene de la sesión autenticada.

| Campo | Tipo de Dato | Requerido | Valores Permitidos (Enum) | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `idPago` | `number (Integer)` | Sí | - | Identificador único del pago (PK). |
| `idAlumno` | `number (Integer)` | Sí | - | FK al alumno pagador. |
| `alumnoNombre` | `string` | No | - | Nombre del alumno. |
| `concepto` | `string` | Sí | - | Concepto cancelado. |
| `importe` | `number (Monetario)` | Sí | - | Importe cobrado. |
| `medioPago` | `string (Enum)` | Sí | `EFECTIVO, TRANSFERENCIA, TARJETA` | Canal o medio de pago utilizado. |
| `fechaPago` | `string (YYYY-MM-DD)` | Sí | - | Fecha y hora del cobro. |
| `comprobante` | `string` | Sí | - | Número de recibo oficial generado (ej. REC-2026-0001). |
| `estado` | `string (Enum)` | Sí | `ACREDITADO, ANULADO` | Estado de la transacción. |

**Relaciones:**
- Con `Alumno` (M:1): `idAlumno` -> `idAlumno`

**Pantallas que la consumen:** `AdminPagosPage.jsx, AdminSituacionAlumnoPage.jsx, SituacionAcademicaArancelariaPage.jsx`

---

### 1.13 Entidad: `Evaluacion`
**Descripción:** Instancia evaluativa (parcial o TP) programada para una materia en un curso.

| Campo | Tipo de Dato | Requerido | Valores Permitidos (Enum) | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `idEvaluacion` | `number (Integer)` | Sí | - | Identificador único de la evaluación (PK). |
| `idMateria` | `number (Integer)` | Sí | - | FK a la materia evaluada. |
| `materiaNombre` | `string` | No | - | Nombre de la materia. |
| `idCurso` | `number (Integer)` | Sí | - | FK al curso/comisión evaluado. |
| `cursoNombre` | `string` | No | - | Nombre del curso evaluado. |
| `tipo` | `string (Enum)` | Sí | `PARCIAL, TRABAJO_PRACTICO` | Tipo de evaluación. |
| `descripcion` | `string` | Sí | - | Nombre o tema de la evaluación. |
| `fecha` | `string (YYYY-MM-DD)` | Sí | - | Fecha de la prueba o entrega. |
| `ponderacion` | `string` | No | - | Ponderación en la nota final (ej. '40%'). |

**Relaciones:**
- Con `Materia` (M:1): `idMateria` -> `idMateria`
- Con `Curso` (M:1): `idCurso` -> `idCurso`

**Pantallas que la consumen:** `EvaluacionesDocentePage.jsx`

---

### 1.14 Entidad: `Calificacion`
**Descripción:** Nota numérica de 1 a 10 obtenida por un alumno en una evaluación.

| Campo | Tipo de Dato | Requerido | Valores Permitidos (Enum) | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `idCalificacion` | `number (Integer)` | Sí | - | Identificador único de la calificación (PK). |
| `idAlumno` | `number (Integer)` | Sí | - | FK al alumno calificado. |
| `alumnoNombre` | `string` | No | - | Nombre del alumno calificado. |
| `idMateria` | `number (Integer)` | Sí | - | FK a la materia calificada. |
| `materiaNombre` | `string` | No | - | Nombre de la materia. |
| `evaluacionNombre` | `string` | Sí | - | Nombre de la evaluación asociada. |
| `tipo` | `string (Enum)` | Sí | `PARCIAL, TRABAJO_PRACTICO` | Categoría evaluativa. |
| `nota` | `number (Integer 1-10)` | Sí | - | Calificación numérica en escala oficial de 1 a 10. |
| `condicion` | `string (Enum)` | Sí | `APROBADO, DESAPROBADO` | Resultado (APROBADO si nota >= 4). |
| `fecha` | `string (YYYY-MM-DD)` | Sí | - | Fecha de carga de la nota. |
| `observacion` | `string` | No | - | Observaciones docentes sobre la calificación. |

**Relaciones:**
- Con `Alumno` (M:1): `idAlumno` -> `idAlumno`
- Con `Materia` (M:1): `idMateria` -> `idMateria`

**Pantallas que la consumen:** `CalificacionesDocentePage.jsx, ParcialesPage.jsx, TrabajosPracticosPage.jsx, SituacionAcademicaArancelariaPage.jsx, InicioPage.jsx`

---

### 1.15 Entidad: `Asistencia`
**Descripción:** Registro diario de presentismo de un alumno a una clase.

| Campo | Tipo de Dato | Requerido | Valores Permitidos (Enum) | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `idAsistencia` | `number (Integer)` | Sí | - | Identificador único de asistencia (PK). |
| `idAlumno` | `number (Integer)` | Sí | - | FK al estudiante. |
| `alumnoNombre` | `string` | No | - | Nombre del estudiante. |
| `idCurso` | `number (Integer)` | Sí | - | FK al curso/comisión. |
| `idMateria` | `number (Integer)` | Sí | - | FK a la materia dictada. |
| `materiaNombre` | `string` | No | - | Nombre de la materia. |
| `fecha` | `string (YYYY-MM-DD)` | Sí | - | Fecha de la clase dictada. |
| `estado` | `string (Enum)` | Sí | `PRESENTE, AUSENTE, TARDANZA, JUSTIFICADO` | Estado de asistencia registrado. |

**Relaciones:**
- Con `Alumno` (M:1): `idAlumno` -> `idAlumno`
- Con `Curso` (M:1): `idCurso` -> `idCurso`
- Con `Materia` (M:1): `idMateria` -> `idMateria`

**Pantallas que la consumen:** `AsistenciasDocentePage.jsx, AsistenciasAlumnoPage.jsx`

---

### 1.16 Entidad: `MesaExamen`
**Descripción:** Turno de examen final para una materia ante un tribunal evaluador.

| Campo | Tipo de Dato | Requerido | Valores Permitidos (Enum) | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `idMesa` | `number (Integer)` | Sí | - | Identificador único de la mesa de examen (PK). |
| `idMateria` | `number (Integer)` | Sí | - | FK a la materia evaluada. |
| `materiaNombre` | `string` | No | - | Nombre de la materia evaluada. |
| `fecha` | `string (YYYY-MM-DD)` | Sí | - | Fecha programada del llamado. |
| `hora` | `string (HH:MM)` | Sí | - | Horario de inicio del examen. |
| `turno` | `string (Enum)` | Sí | `MAÑANA, TARDE, NOCHE` | Turno del examen final. |
| `aula` | `string` | No | - | Aula física de sustanciación. |
| `tribunal` | `string` | Sí | - | Nombres de los docentes que componen el tribunal. |
| `cupoMaximo` | `number (Integer)` | Sí | - | Cupo máximo de inscriptos. |
| `inscriptos` | `number (Integer)` | Sí | - | Cantidad actual de alumnos anotados. |
| `estadoMesa` | `string (Enum)` | Sí | `ABIERTA, CERRADA` | Estado de habilitación de inscripciones. |
| `alumnosInscriptosIds` | `array of numbers` | No | - | Lista de IDs de alumnos actualmente inscriptos. |

**Relaciones:**
- Con `Materia` (M:1): `idMateria` -> `idMateria`

**Pantallas que la consumen:** `GestionMesasPage.jsx, MesasExamenPage.jsx, InicioPage.jsx`

---

### 1.17 Entidad: `InscripcionMesa`
**Descripción:** Inscripción de un alumno regular a una mesa de examen final.

| Campo | Tipo de Dato | Requerido | Valores Permitidos (Enum) | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `idInscripcionMesa` | `number (Integer)` | Sí | - | Identificador único de la inscripción a mesa (PK). |
| `idMesa` | `number (Integer)` | Sí | - | FK a la mesa de examen. |
| `idAlumno` | `number (Integer)` | Sí | - | FK al alumno inscripto. |
| `fecha` | `string (YYYY-MM-DD)` | Sí | - | Fecha en que se confirmó la inscripción. |
| `activa` | `boolean` | Sí | - | Indica si la inscripción está vigente o fue cancelada. |

**Relaciones:**
- Con `MesaExamen` (M:1): `idMesa` -> `idMesa`
- Con `Alumno` (M:1): `idAlumno` -> `idAlumno`

**Pantallas que la consumen:** `MesasExamenPage.jsx`

---

### 1.18 Entidad: `Solicitud`
**Descripción:** Trámite institucional o académico gestionado por un estudiante. NOTA: Solicitud es un artefacto de la interfaz de usuario del frontend requerido para su operativa; en la base de datos se persistirá según el esquema y definiciones que se adopten en etapas posteriores.

| Campo | Tipo de Dato | Requerido | Valores Permitidos (Enum) | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `idSolicitud` | `number (Integer)` | Sí | - | Identificador único del trámite (PK). |
| `idAlumno` | `number (Integer)` | Sí | - | FK al alumno solicitante. |
| `alumnoNombre` | `string` | No | - | Nombre del estudiante solicitante. |
| `tipo` | `string (Enum)` | Sí | `Constancia de Alumno Regular, Declaración jurada de materias a cursar, Inscripción a pasantías, Solicitud de título intermedio, Solicitudes académicas generales, CAMBIO_CARRERA, REINCORPORACION` | Categoría o tipo de solicitud presentada. |
| `motivo` | `string` | Sí | - | Fundamentación y detalle de la solicitud. |
| `fechaSolicitud` | `string (YYYY-MM-DD)` | Sí | - | Fecha de ingreso del trámite. |
| `estado` | `string (Enum)` | Sí | `PENDIENTE, EN_PROCESO, APROBADA, RECHAZADA` | Estado de tramitación resolutiva. |
| `fechaResolucion` | `string (YYYY-MM-DD)` | No | - | Fecha en que se dictaminó resolución. |
| `respuesta` | `string` | No | - | Dictamen oficial o respuesta escrita de secretaría. |

**Relaciones:**
- Con `Alumno` (M:1): `idAlumno` -> `idAlumno`

**Pantallas que la consumen:** `BandejaSolicitudesPage.jsx, ConstanciasPage.jsx, DeclaracionJuradaPage.jsx, PasantiasPage.jsx, SolicitudTituloPage.jsx, SolicitudesAcademicasPage.jsx, CambioCarreraPage.jsx, ReincorporacionPage.jsx, InicioPage.jsx`

---

### 1.19 Entidad: `DeclaracionJurada`
**Descripción:** Declaración jurada de asignaturas que el estudiante cursará en el ciclo lectivo.

| Campo | Tipo de Dato | Requerido | Valores Permitidos (Enum) | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `idDeclaracion` | `number (Integer)` | Sí | - | Identificador único de la declaración jurada (PK). |
| `idAlumno` | `number (Integer)` | Sí | - | FK al alumno firmante. |
| `idCiclo` | `number (Integer)` | Sí | - | FK al ciclo lectivo correspondiente. |
| `fecha` | `string (YYYY-MM-DD)` | Sí | - | Fecha de suscripción de la DJ. |
| `materiasDeclaradasIds` | `array of numbers` | Sí | - | Lista de IDs de materias que se compromete a cursar. |

**Relaciones:**
- Con `Alumno` (M:1): `idAlumno` -> `idAlumno`
- Con `CicloLectivo` (M:1): `idCiclo` -> `idCiclo`

**Pantallas que la consumen:** `DeclaracionJuradaPage.jsx`

---

### 1.20 Entidad: `Documentacion`
**Descripción:** Requisito documental o legal que el alumno debe presentar para su legajo. NOTA: Documentacion es un artefacto de la interfaz de usuario del frontend requerido para su operativa; en la base de datos se persistirá según el esquema y definiciones que se adopten en etapas posteriores.

| Campo | Tipo de Dato | Requerido | Valores Permitidos (Enum) | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `idDocumento` | `number (Integer)` | Sí | - | Identificador único del requisito (PK). |
| `idAlumno` | `number (Integer)` | Sí | - | FK al alumno titular del legajo. |
| `tipo` | `string (Enum)` | Sí | `DNI (Frente y Dorso), Título Secundario / Certificado Analítico, Certificado de Aptitud Médica, Fotos 4x4 (2 unidades)` | Tipo de documento exigido por la institución. |
| `estado` | `string (Enum)` | Sí | `ENTREGADO, PENDIENTE` | Estado de recepción documental. |
| `obligatorio` | `boolean` | Sí | - | Si es condición obligatoria para la regularidad. |
| `fechaEntrega` | `string (YYYY-MM-DD)` | No | - | Fecha en que se recepcionó el papel en secretaría. |
| `observaciones` | `string` | No | - | Observaciones de control legal o formal. |

**Relaciones:**
- Con `Alumno` (M:1): `idAlumno` -> `idAlumno`

**Pantallas que la consumen:** `DocumentacionPage.jsx`

---

### 1.21 Entidad: `Usuario`
**Descripción:** Cuenta de autenticación y acceso al sistema de gestión Academit.

| Campo | Tipo de Dato | Requerido | Valores Permitidos (Enum) | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `idUsuario` | `number (Integer)` | Sí | - | Identificador único de la cuenta de usuario (PK). |
| `username` | `string` | Sí | - | Nombre de usuario único para login. |
| `nombre` | `string` | Sí | - | Nombre y apellido completo del usuario. |
| `email` | `string` | Sí | - | Correo electrónico registrado. |
| `telefono` | `string` | No | - | Teléfono de contacto. |
| `domicilio` | `string` | No | - | Domicilio residencial del usuario. |
| `rol` | `string (Enum)` | Sí | `ADMINISTRADOR, ADMINISTRATIVO, DOCENTE, ALUMNO` | Rol asignado para permisos del portal. |
| `estado` | `string (Enum)` | Sí | `ACTIVO, INACTIVO` | Estado de la cuenta. |
| `ultimoAcceso` | `string (Timestamp)` | No | - | Fecha y hora del último acceso al sistema. |

**Pantallas que la consumen:** `GestionUsuariosPage.jsx, Login.jsx, MisDatosPage.jsx, CambiarPasswordPage.jsx`

---

### 1.22 Entidad: `Rol`
**Descripción:** Perfil de seguridad que define los privilegios y menús de acceso.

| Campo | Tipo de Dato | Requerido | Valores Permitidos (Enum) | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `idRol` | `number (Integer)` | Sí | - | Identificador del rol (PK). |
| `nombre` | `string (Enum)` | Sí | `ADMINISTRADOR, ADMINISTRATIVO, DOCENTE, ALUMNO` | Nombre del rol de usuario. |

**Pantallas que la consumen:** `GestionUsuariosPage.jsx, Login.jsx, MisDatosPage.jsx`

---

## 2. Inventario de Endpoints REST

Tabla exhaustiva con la totalidad de los contratos de comunicación consumidos o requeridos por el frontend:

| Método | Ruta | Descripción | Parámetros / Query | Cuerpo de la Petición | Respuesta | Códigos HTTP | Roles Permitidos | Pantallas Consumidoras | Función API | Estado |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| `GET` | `/api/alumnos` | Obtiene la lista completa de alumnos con filtros opcionales de búsqueda. | Query: ?search=, ?idCarrera=, ?estado= | `-` | `Array<AlumnoDTO>` | `200, 401, 403` | ADMINISTRADOR, ADMINISTRATIVO | GestionAlumnosPage.jsx, GestionInscripcionesPage.jsx, AdminDeudasPage.jsx, AdminPagosPage.jsx, AdminSituacionAlumnoPage.jsx, AsistenciasDocentePage.jsx, CalificacionesDocentePage.jsx, InicioPage.jsx | `getAlumnos` | **real** |
| `GET` | `/api/alumnos/{id}` | Obtiene el detalle completo del legajo de un alumno por ID. | Path: id (number) | `-` | `AlumnoDTO` | `200, 401, 403, 404` | ADMINISTRADOR, ADMINISTRATIVO | GestionAlumnosPage.jsx (auxiliar) | `getAlumnoById` | **real** |
| `POST` | `/api/alumnos` | Registra el alta de un nuevo alumno en el instituto. | - | `AlumnoCreateDTO { nombre, apellido, dni, email, telefono, domicilio, fechaNacimiento, idCarrera, idPlan }` | `AlumnoDTO` | `201, 400, 401, 403, 409` | ADMINISTRADOR, ADMINISTRATIVO | GestionAlumnosPage.jsx | `createAlumno` | **real** |
| `PUT` | `/api/alumnos/{id}` | Actualiza la información de legajo o filiación de un alumno. | Path: id (number) | `AlumnoUpdateDTO { nombre, apellido, email, telefono, domicilio, estado, idPlan }` | `AlumnoDTO` | `200, 400, 401, 403, 404` | ADMINISTRADOR, ADMINISTRATIVO | GestionAlumnosPage.jsx | `updateAlumno` | **real** |
| `DELETE` | `/api/alumnos/{id}` | Da de baja lógica a un alumno (inactiva su estado académico). | Path: id (number) | `-` | `204 No Content` | `200, 204, 401, 403, 404` | ADMINISTRADOR | GestionAlumnosPage.jsx | `deleteAlumno` | **real** |
| `GET` | `/api/alumnos/{id}/situacion-academica` | Consulta consolidada de materias aprobadas, cursadas, correlatividades y promedio. | Path: id (number) | `-` | `SituacionAcademicaDTO { materiasAprobadas, promedio, regularidades }` | `200, 401, 403, 404` | ALUMNO, ADMINISTRADOR, ADMINISTRATIVO | SituacionAcademicaArancelariaPage.jsx | `getSituacionAcademica` | **real** |
| `GET` | `/api/alumnos/{id}/situacion-administrativa` | Consulta consolidada del estado financiero, cuotas pendientes, deudas y matrícula del alumno. | Path: id (number) | `-` | `SituacionAdministrativaDTO { cuotasPagas, cuotasPendientes, totalDeuda, matricula }` | `200, 401, 403, 404` | ADMINISTRATIVO, ADMINISTRADOR | AdminSituacionAlumnoPage.jsx | `getSituacionAdministrativa` | **real** |
| `GET` | `/api/docentes` | Obtiene la nómina de docentes del instituto. | Query: ?estado= | `-` | `Array<DocenteDTO>` | `200, 401, 403` | ADMINISTRADOR, ADMINISTRATIVO | GestionDocentesPage.jsx, GestionAsignacionesPage.jsx | `getDocentes` | **real** |
| `POST` | `/api/docentes` | Registra el alta de un nuevo docente. | - | `DocenteCreateDTO { legajo, nombre, apellido, dni, email, telefono, titulo }` | `DocenteDTO` | `201, 400, 401, 403, 409` | ADMINISTRADOR | GestionDocentesPage.jsx | `createDocente` | **real** |
| `PUT` | `/api/docentes/{id}` | Modifica datos de legajo o contacto de un docente. | Path: id (number) | `DocenteUpdateDTO { nombre, apellido, email, telefono, titulo, estado }` | `DocenteDTO` | `200, 400, 401, 403, 404` | ADMINISTRADOR | GestionDocentesPage.jsx | `updateDocente` | **real** |
| `DELETE` | `/api/docentes/{id}` | Da de baja lógica a un docente en el sistema. | Path: id (number) | `-` | `204 No Content` | `200, 204, 401, 403, 404` | ADMINISTRADOR | GestionDocentesPage.jsx | `deleteDocente` | **real** |
| `GET` | `/api/carreras` | Obtiene la oferta completa de carreras del instituto. | Query: ?estado= | `-` | `Array<CarreraDTO>` | `200, 401, 403` | ADMINISTRADOR, ADMINISTRATIVO | GestionCarrerasPage.jsx, GestionAlumnosPage.jsx, GestionCursosPage.jsx, GestionPlanEstudiosPage.jsx | `getCarreras` | **real** |
| `GET` | `/api/carreras/{id}` | Obtiene el detalle de una carrera por ID. | Path: id (number) | `-` | `CarreraDTO` | `200, 401, 403, 404` | ADMINISTRADOR, ADMINISTRATIVO | GestionCarrerasPage.jsx | `getCarreraById` | **real** |
| `POST` | `/api/carreras` | Crea una nueva titulación o carrera en el instituto. | - | `CarreraCreateDTO { codigo, nombre, tituloOtorgado, duracionAnios, resolucion }` | `CarreraDTO` | `201, 400, 401, 403, 409` | ADMINISTRADOR | GestionCarrerasPage.jsx | `createCarrera` | **real** |
| `PUT` | `/api/carreras/{id}` | Actualiza denominación o datos formales de una carrera. | Path: id (number) | `CarreraUpdateDTO { codigo, nombre, tituloOtorgado, duracionAnios, resolucion, estado }` | `CarreraDTO` | `200, 400, 401, 403, 404` | ADMINISTRADOR | GestionCarrerasPage.jsx | `updateCarrera` | **real** |
| `DELETE` | `/api/carreras/{id}` | Da de baja o inactiva una carrera. | Path: id (number) | `-` | `204 No Content` | `200, 204, 401, 403, 404` | ADMINISTRADOR | GestionCarrerasPage.jsx | `deleteCarrera` | **real** |
| `GET` | `/api/carreras/{id}/planes` | Obtiene los planes de estudio correspondientes a una carrera. | Path: id (number) | `-` | `Array<PlanEstudioDTO>` | `200, 401, 403, 404` | ADMINISTRADOR, ADMINISTRATIVO | GestionCarrerasPage.jsx | `getCarreraPlanes` | **real** |
| `GET` | `/api/carreras/{id}/cursos` | Obtiene las comisiones/cursos habilitados para una carrera. | Path: id (number) | `-` | `Array<CursoDTO>` | `200, 401, 403, 404` | ADMINISTRADOR, ADMINISTRATIVO | GestionCarrerasPage.jsx | `getCarreraCursos` | **real** |
| `GET` | `/api/planes-estudio` | Obtiene el listado general de planes de estudio. | Query: ?idCarrera= | `-` | `Array<PlanEstudioDTO>` | `200, 401, 403` | ADMINISTRADOR, ADMINISTRATIVO | GestionPlanEstudiosPage.jsx, GestionAlumnosPage.jsx | `getPlanesEstudio` | **real** |
| `GET` | `/api/planes-estudio/{id}/materias` | Obtiene las materias de un plan de estudio estructuradas con año y correlativas. | Path: id (number) | `-` | `Array<MateriaPlanDTO { idMateria, nombre, anio, correlativas: [idMateria] }>` | `200, 401, 403, 404` | ALUMNO, DOCENTE, ADMINISTRATIVO, ADMINISTRADOR | PlanEstudiosAlumnoPage.jsx, GestionPlanEstudiosPage.jsx | `getMateriasDePlan` | **real** |
| `GET` | `/api/materias` | Obtiene materias filtradas por carrera o plan de estudios. | Query: ?idCarrera=, ?idPlan= | `-` | `Array<MateriaDTO>` | `200, 401, 403` | ADMINISTRADOR, DOCENTE, ALUMNO | GestionMateriasPage.jsx, GestionPlanEstudiosPage.jsx, GestionAsignacionesPage.jsx, GestionMesasPage.jsx, PlanEstudiosAlumnoPage.jsx, AsistenciasDocentePage.jsx, CalificacionesDocentePage.jsx, EvaluacionesDocentePage.jsx | `getMaterias` | **real** |
| `POST` | `/api/materias` | Crea una nueva materia en el catálogo del plan de estudios. | - | `MateriaCreateDTO { codigo, nombre, idCarrera, idPlan, anio, regimen, horasSemanales, correlativas }` | `MateriaDTO` | `201, 400, 401, 403, 409` | ADMINISTRADOR | GestionMateriasPage.jsx | `createMateria` | **real** |
| `PUT` | `/api/materias/{id}` | Actualiza los datos académicos o correlatividades de una materia. | Path: id (number) | `MateriaUpdateDTO { nombre, anio, regimen, horasSemanales, correlativas }` | `MateriaDTO` | `200, 400, 401, 403, 404` | ADMINISTRADOR | GestionMateriasPage.jsx, GestionPlanEstudiosPage.jsx | `updateMateria` | **real** |
| `GET` | `/api/cursos` | Obtiene la lista de comisiones/cursos y su ocupación de cupos. | Query: ?idCarrera=, ?turno= | `-` | `Array<CursoDTO>` | `200, 401, 403` | ADMINISTRADOR, DOCENTE, ADMINISTRATIVO | GestionCursosPage.jsx, GestionInscripcionesPage.jsx, GestionAsignacionesPage.jsx, MisCursosPage.jsx, AsistenciasDocentePage.jsx, CalificacionesDocentePage.jsx, EvaluacionesDocentePage.jsx | `getCursos` | **real** |
| `POST` | `/api/cursos` | Crea una nueva división/comisión de curso. | - | `CursoCreateDTO { codigo, nombre, idCarrera, idPlan, turno, aula, capacidadMaxima, cicloLectivo }` | `CursoDTO` | `201, 400, 401, 403, 409` | ADMINISTRADOR | GestionCursosPage.jsx | `createCurso` | **real** |
| `PUT` | `/api/cursos/{id}` | Actualiza la capacidad, turno o aula de una comisión. | Path: id (number) | `CursoUpdateDTO { nombre, turno, aula, capacidadMaxima }` | `CursoDTO` | `200, 400, 401, 403, 404` | ADMINISTRADOR | GestionCursosPage.jsx | `updateCurso` | **real** |
| `GET` | `/api/ciclos-lectivos` | Lista los ciclos lectivos registrados en la institución. | - | `-` | `Array<CicloLectivoDTO>` | `200, 401, 403` | ADMINISTRADOR, ADMINISTRATIVO | GestionCiclosLectivosPage.jsx, GestionInscripcionesPage.jsx | `getCiclosLectivos` | **real** |
| `POST` | `/api/ciclos-lectivos` | Abre o registra un nuevo ciclo lectivo anual. | - | `CicloLectivoCreateDTO { anio, nombre, fechaInicio, fechaFin, estado }` | `CicloLectivoDTO` | `201, 400, 401, 403, 409` | ADMINISTRADOR | GestionCiclosLectivosPage.jsx | `createCicloLectivo` | **real** |
| `PUT` | `/api/ciclos-lectivos/{id}` | Modifica fechas límite o estado (cierre) de un ciclo lectivo. | Path: id (number) | `CicloLectivoUpdateDTO { nombre, fechaInicio, fechaFin, estado }` | `CicloLectivoDTO` | `200, 400, 401, 403, 404` | ADMINISTRADOR | GestionCiclosLectivosPage.jsx | `updateCicloLectivo` | **real** |
| `GET` | `/api/asignaciones` | Lista las asignaciones de docentes a cursos y materias. | Query: ?idDocente=, ?idCurso= | `-` | `Array<AsignacionDTO>` | `200, 401, 403` | ADMINISTRADOR, ADMINISTRATIVO, DOCENTE | GestionAsignacionesPage.jsx, MisCursosPage.jsx | `getAsignaciones` | **real** |
| `POST` | `/api/asignaciones` | Asigna un docente a una cátedra y comisión. | - | `AsignacionCreateDTO { idDocente, idCurso, idMateria, rolDocente }` | `AsignacionDTO` | `201, 400, 401, 403, 409` | ADMINISTRADOR | GestionAsignacionesPage.jsx | `createAsignacion` | **real** |
| `DELETE` | `/api/asignaciones/{id}` | Elimina la asignación docente-curso-materia. | Path: id (number) | `-` | `204 No Content` | `200, 204, 401, 403, 404` | ADMINISTRADOR | GestionAsignacionesPage.jsx | `deleteAsignacion` | **real** |
| `GET` | `/api/inscripciones` | Lista las inscripciones de alumnos a comisiones/cursos. | Query: ?idCurso=, ?idAlumno= | `-` | `Array<InscripcionDTO>` | `200, 401, 403` | ADMINISTRADOR, ADMINISTRATIVO | GestionInscripcionesPage.jsx | `getInscripciones` | **real** |
| `POST` | `/api/inscripciones` | Inscribe a un alumno a un curso verificando cupo disponible y carrera. | - | `InscripcionCreateDTO { idAlumno, idCurso, cicloLectivo }` | `InscripcionDTO` | `201, 400, 401, 403, 409` | ADMINISTRADOR, ADMINISTRATIVO | GestionInscripcionesPage.jsx | `createInscripcion` | **real** |
| `DELETE` | `/api/inscripciones/{id}` | Cancela la inscripción de un alumno y libera cupo en la comisión. | Path: id (number) | `-` | `204 No Content` | `200, 204, 401, 403, 404` | ADMINISTRADOR, ADMINISTRATIVO | GestionInscripcionesPage.jsx | `cancelarInscripcion` | **real** |
| `GET` | `/api/matriculas` | Lista las matrículas anuales registradas. | Query: ?cicloLectivo=, ?estado= | `-` | `Array<MatriculaDTO>` | `200, 401, 403` | ADMINISTRADOR, ADMINISTRATIVO, ALUMNO | AdminMatriculasPage.jsx, AdminSituacionAlumnoPage.jsx, CancelarMatriculaPage.jsx, SituacionAcademicaArancelariaPage.jsx | `getMatriculas` | **real** |
| `PUT` | `/api/matriculas/{id}` | Actualiza el estado administrativo o de pago de la matrícula. | Path: id (number) | `MatriculaUpdateDTO { estado, estadoPago }` | `MatriculaDTO` | `200, 400, 401, 403, 404` | ADMINISTRADOR, ADMINISTRATIVO | AdminMatriculasPage.jsx | `updateMatricula` | **real** |
| `PATCH` | `/api/matriculas/{id}` | Actualiza parcialmente el estado de la matrícula (ej. cancelación a petición del alumno o secretaría). | Path: id (number) | `{ estado: 'CANCELADA' }` | `MatriculaDTO` | `200, 400, 401, 403, 404` | ALUMNO, ADMINISTRATIVO, ADMINISTRADOR | CancelarMatriculaPage.jsx | `cancelarMatricula` | **real** |
| `POST` | `/api/matriculas/{id}/cuotas` | Genera el plan de cuotas anual (12 cuotas mensuales + 3 seguros cuatrimestrales) asociado a una matrícula activa. | Path: id (number) | `-` | `Array<CuotaDTO>` | `201, 400, 401, 403, 404, 409` | ADMINISTRADOR, ADMINISTRATIVO | AdminMatriculasPage.jsx | `generarCuotas` | **real** |
| `GET` | `/api/cuotas` | Consulta cuotas arancelarias con filtro opcional por alumno. | Query: ?idAlumno=, ?estado= | `-` | `Array<CuotaDTO>` | `200, 401, 403` | ADMINISTRADOR, ADMINISTRATIVO, ALUMNO | AdminCuotasPage.jsx, AdminDeudasPage.jsx, AdminPagosPage.jsx, AdminSituacionAlumnoPage.jsx, InicioPage.jsx, SituacionAcademicaArancelariaPage.jsx | `getCuotas` | **real** |
| `GET` | `/api/pagos` | Consulta el historial de pagos y recibos emitidos. | Query: ?idAlumno= | `-` | `Array<PagoDTO>` | `200, 401, 403` | ADMINISTRADOR, ADMINISTRATIVO, ALUMNO | AdminPagosPage.jsx, AdminSituacionAlumnoPage.jsx, SituacionAcademicaArancelariaPage.jsx | `getPagos` | **real** |
| `POST` | `/api/pagos` | Registra el pago de una cuota exigible (RN09: sin pagos parciales, importe exacto; usuario deducido de sesión). | - | `PagoCreateDTO { idCuota, importe, medioPago }` | `PagoDTO { idPago, comprobante, estado: 'ACREDITADO' }` | `201, 400, 401, 403, 404, 409` | ADMINISTRADOR, ADMINISTRATIVO | AdminPagosPage.jsx | `registrarPago` | **real** |
| `GET` | `/api/evaluaciones` | Consulta las evaluaciones creadas filtradas por materia y curso. | Query: ?idMateria=, ?idCurso= | `-` | `Array<EvaluacionDTO>` | `200, 401, 403` | DOCENTE, ADMINISTRADOR | EvaluacionesDocentePage.jsx | `getEvaluaciones` | **real** |
| `POST` | `/api/evaluaciones` | Programa una nueva evaluación (parcial o TP) en el cronograma. | - | `EvaluacionCreateDTO { idMateria, idCurso, tipo, descripcion, fecha, ponderacion }` | `EvaluacionDTO` | `201, 400, 401, 403` | DOCENTE, ADMINISTRADOR | EvaluacionesDocentePage.jsx | `createEvaluacion` | **real** |
| `POST` | `/api/evaluaciones/{id}/calificaciones` | Guarda de forma atómica en lote la nómina completa de calificaciones para una evaluación (notas 1 a 10 con validación por alumno). | Path: id (number) | `Array<{ idAlumno, nota }>` | `{ guardadas: number }` | `200, 400, 401, 403, 404` | DOCENTE | CalificacionesDocentePage.jsx | `guardarCalificaciones` | **real** |
| `GET` | `/api/calificaciones` | Consulta notas por filtros de alumno, tipo de evaluación o materia. | Query: ?idAlumno=, ?tipo=, ?idMateria= | `-` | `Array<CalificacionDTO>` | `200, 401, 403` | DOCENTE, ALUMNO, ADMINISTRADOR | CalificacionesDocentePage.jsx, InicioPage.jsx, ParcialesPage.jsx, SituacionAcademicaArancelariaPage.jsx, TrabajosPracticosPage.jsx | `getCalificaciones` | **real** |
| `POST` | `/api/calificaciones` | Registra o actualiza la nota individual de un alumno (escala 1 a 10 con aprobación >= 4). | - | `CalificacionDTO { idAlumno, idMateria, evaluacionNombre, tipo, nota, observacion }` | `CalificacionDTO` | `200, 201, 400, 401, 403` | DOCENTE | CalificacionesDocentePage.jsx | `saveCalificacion` | **real** |
| `GET` | `/api/asistencias` | Consulta asistencias de alumnos por curso, materia y fecha. | Query: ?idCurso=, ?idMateria=, ?idAlumno=, ?fecha= | `-` | `Array<AsistenciaDTO>` | `200, 401, 403` | DOCENTE, ALUMNO, ADMINISTRADOR | AsistenciasAlumnoPage.jsx, AsistenciasDocentePage.jsx | `getAsistencias` | **real** |
| `POST` | `/api/asistencias/lote` | Registra en bloque la toma de lista diaria de asistencias para todo el curso. | - | `Array<AsistenciaItemDTO { idAlumno, idCurso, idMateria, fecha, estado }>` | `Array<AsistenciaDTO>` | `200, 201, 400, 401, 403` | DOCENTE | AsistenciasDocentePage.jsx | `registrarAsistencias` | **real** |
| `GET` | `/api/mesas-examen` | Lista las mesas de examen final habilitadas con cupos disponibles. | Query: ?idMateria= | `-` | `Array<MesaExamenDTO>` | `200, 401, 403` | ALUMNO, ADMINISTRADOR | GestionMesasPage.jsx, InicioPage.jsx, MesasExamenPage.jsx | `getMesasExamen` | **real** |
| `POST` | `/api/mesas-examen/{id}/inscripciones` | Inscribe al alumno autenticado a la mesa de examen final verificando cupo disponible. | Path: id (number) | `-` | `InscripcionMesaDTO` | `201, 400, 401, 403, 404, 409` | ALUMNO | MesasExamenPage.jsx | `inscribirseMesa` | **real** |
| `DELETE` | `/api/mesas-examen/{id}/inscripciones/{idInscripcion}` | Da de baja la inscripción de un alumno a una mesa final liberando la vacante. | Path: id (number), idInscripcion (number) | `-` | `204 No Content` | `200, 204, 400, 401, 403, 404` | ALUMNO | MesasExamenPage.jsx | `darseDeBajaMesa` | **real** |
| `POST` | `/api/mesas-examen` | Crea una nueva mesa de examen final. | - | `MesaExamenCreateDTO { idMateria, fecha, hora, turno, aula, tribunal, cupoMaximo }` | `MesaExamenDTO` | `201, 400, 401, 403, 409` | ADMINISTRADOR | GestionMesasPage.jsx | `createMesa` | **real** |
| `PUT` | `/api/mesas-examen/{id}` | Modifica fecha, horario, aula, tribunal o cupo de la mesa de examen. | Path: id (number) | `MesaExamenUpdateDTO { fecha, hora, turno, aula, tribunal, cupoMaximo, estadoMesa }` | `MesaExamenDTO` | `200, 400, 401, 403, 404` | ADMINISTRADOR | GestionMesasPage.jsx | `updateMesa` | **real** |
| `GET` | `/api/solicitudes` | Consulta trámites y solicitudes filtradas por alumno o estado. | Query: ?idAlumno=, ?tipo=, ?estado= | `-` | `Array<SolicitudDTO>` | `200, 401, 403` | ADMINISTRATIVO, ADMINISTRADOR, ALUMNO | BandejaSolicitudesPage.jsx, ConstanciasPage.jsx, DeclaracionJuradaPage.jsx, InicioPage.jsx, PasantiasPage.jsx, ReincorporacionPage.jsx, SolicitudTituloPage.jsx, SolicitudesAcademicasPage.jsx, CambioCarreraPage.jsx | `getSolicitudes` | **real** |
| `POST` | `/api/solicitudes` | Presenta una nueva solicitud institucional (constancia, DJ, pasantía, título, reincorporación, cambio de carrera). | - | `SolicitudCreateDTO { idAlumno, tipo, motivo, observaciones }` | `SolicitudDTO` | `201, 400, 401, 403` | ALUMNO | CambioCarreraPage.jsx, ConstanciasPage.jsx, DeclaracionJuradaPage.jsx, PasantiasPage.jsx, ReincorporacionPage.jsx, SolicitudTituloPage.jsx, SolicitudesAcademicasPage.jsx | `createSolicitud` | **real** |
| `PATCH` | `/api/solicitudes/{id}` | Resuelve y dictamina una solicitud (APROBADA o RECHAZADA con observación formal de secretaría). | Path: id (number) | `ResolverSolicitudDTO { estado: 'APROBADA' | 'RECHAZADA', observacion }` | `SolicitudDTO` | `200, 400, 401, 403, 404` | ADMINISTRATIVO, ADMINISTRADOR | BandejaSolicitudesPage.jsx | `resolverSolicitud` | **real** |
| `GET` | `/api/documentacion` | Consulta el estado de entrega de los documentos de legajo del alumno. | Query: ?idAlumno= | `-` | `Array<DocumentacionDTO>` | `200, 401, 403` | ALUMNO, ADMINISTRATIVO, ADMINISTRADOR | DocumentacionPage.jsx | `getDocumentacion` | **real** |
| `PUT` | `/api/documentacion/{id}` | Marca la recepción o actualiza observaciones de un documento de legajo. | Path: id (number) | `DocumentacionUpdateDTO { estado: 'ENTREGADO' | 'PENDIENTE', observaciones }` | `DocumentacionDTO` | `200, 400, 401, 403, 404` | ADMINISTRATIVO, ADMINISTRADOR | DocumentacionPage.jsx (auxiliar) | `updateDocumentacion` | **real** |
| `POST` | `/api/auth/login` | Autentica credenciales de usuario y abre sesión en el portal. | - | `LoginDTO { username, password }` | `SesionDTO { usuario, nombre, rol, token }` | `200, 400, 401` | PÚBLICO | Login.jsx (vía AuthContext) | `loginApi` | **real** |
| `POST` | `/api/auth/logout` | Cierra la sesión activa del usuario e invalida token o cookie. | - | `-` | `200 OK (o 204 No Content)` | `200, 204, 401` | AUTENTICADO | Layout.jsx (vía AuthContext) | `logoutApi` | **real** |
| `POST` | `/api/auth/cambiar-password` | Permite al usuario autenticado cambiar su clave de acceso personal. | - | `CambioPasswordDTO { actual, nueva }` | `MensajeDTO { success: true }` | `200, 400, 401` | AUTENTICADO | CambiarPasswordPage.jsx | `cambiarPasswordApi` | **real** |
| `GET` | `/api/usuarios` | Lista todas las cuentas de usuario y sus roles asignados. | Query: ?rol=, ?estado= | `-` | `Array<UsuarioDTO>` | `200, 401, 403` | ADMINISTRADOR | GestionUsuariosPage.jsx | `getUsuarios` | **real** |
| `POST` | `/api/usuarios` | Crea una nueva cuenta de usuario en el sistema. | - | `UsuarioCreateDTO { username, nombre, email, rol, estado }` | `UsuarioDTO` | `201, 400, 401, 403, 409` | ADMINISTRADOR | GestionUsuariosPage.jsx | `createUsuario` | **real** |
| `PUT` | `/api/usuarios/{id}` | Modifica datos de cuenta, rol o estado de un usuario. | Path: id (number) | `UsuarioUpdateDTO { nombre, email, rol, estado }` | `UsuarioDTO` | `200, 400, 401, 403, 404` | ADMINISTRADOR | GestionUsuariosPage.jsx | `updateUsuario` | **real** |
| `DELETE` | `/api/usuarios/{id}` | Desactiva la cuenta de un usuario en el sistema. | Path: id (number) | `-` | `204 No Content` | `200, 204, 401, 403, 404` | ADMINISTRADOR | GestionUsuariosPage.jsx | `deleteUsuario` | **real** |
| `GET` | `/api/usuarios/me` | Obtiene la ficha personal y datos de filiación del usuario conectado en sesión. | - | `-` | `PerfilUsuarioDTO { username, nombre, email, telefono, domicilio, rol }` | `200, 401` | AUTENTICADO | MisDatosPage.jsx | `getMiPerfil` | **real** |
| `PUT` | `/api/usuarios/me` | Actualiza la información personal de contacto y domicilio del usuario en sesión. | - | `UpdatePerfilDTO { nombre, email, telefono, domicilio }` | `PerfilUsuarioDTO` | `200, 400, 401` | AUTENTICADO | MisDatosPage.jsx | `actualizarMiPerfil` | **real** |

---

## 3. Hallazgos, Discrepancias y Resoluciones de Arquitectura

A continuación se documentan los hallazgos identificados en la auditoría inicial y las decisiones de diseño aplicadas para garantizar la integridad arquitectónica:

### 1. Unificación del Circuito de Pago (RN09 - Resuelto)
- **Diagnóstico previo:** Coexistían dos vías disjuntas para cancelar cuotas: `pagarCuota` (`POST /api/cuotas/{id}/pagar`) y `registrarPago` (`POST /api/pagos`).
- **Resolución aplicada:** Se eliminó `pagarCuota` y se unificó la operación en `registrarPago` (`POST /api/pagos`). Se validó la regla de negocio **RN09**: el pago no admite montos parciales (el importe ingresado debe coincidir exactamente con el arancel de la cuota). El operador que registra el cobro se obtiene de la sesión autenticada.

### 2. Carga Atómica de Calificaciones en Lote (Resuelto)
- **Diagnóstico previo:** `CalificacionesDocentePage.jsx` enviaba peticiones concurrentes individuales vía `Promise.all` con `saveCalificacion`.
- **Resolución aplicada:** Se incorporó el endpoint transaccional `guardarCalificaciones` (`POST /api/evaluaciones/{idEvaluacion}/calificaciones`) con payload `[{ idAlumno, nota }]`. Valida escala 1-10 y pertenencia de alumnos al curso con comportamiento *todo-o-nada* y devolución de errores por alumno.

### 3. Emisión de Cuotas por Matrícula (Resuelto)
- **Diagnóstico previo:** No existía interfaz ni endpoint para que el personal administrativo emitiera las cuotas del ciclo lectivo para una matrícula.
- **Resolución aplicada:** Se incorporó la función `generarCuotas` (`POST /api/matriculas/{idMatricula}/cuotas`), que genera las 12 cuotas mensuales y los 3 seguros cuatrimestrales devengados, y se integró el botón de acción en `AdminMatriculasPage.jsx` para administradores y administrativos.

### 4. Endpoints de Perfil de Usuario Conectado (Resuelto)
- **Diagnóstico previo:** `MisDatosPage.jsx` trabajaba con datos locales que no se persistían al navegar entre pantallas.
- **Resolución aplicada:** Se crearon `getMiPerfil` (`GET /api/usuarios/me`) y `actualizarMiPerfil` (`PUT /api/usuarios/me`) en `src/api/usuarios.js`, persistiendo los cambios en `mockDb` y session storage.

### 5. Corrección de Convenciones en Rutas REST (Resuelto)
- **`cancelarMatricula`:** Reemplazada la ruta no canónica `POST /api/matriculas/cancelar` por `PATCH /api/matriculas/{id}` con `{ estado: 'CANCELADA' }`.
- **`inscribirseMesa` y `darseDeBajaMesa`:** Reemplazadas rutas de verbo RPC por subrecursos REST: `POST /api/mesas-examen/{id}/inscripciones` y `DELETE /api/mesas-examen/{id}/inscripciones/{idInscripcion}`.
- **`resolverSolicitud`:** Reemplazada ruta RPC `PUT /api/solicitudes/{id}/resolver` por `PATCH /api/solicitudes/{id}` con `{ estado, observacion }`.

### 6. Disciplina de Mocks (Verificada)
- Ninguna vista o componente importa `mockDb` directamente; **el 100% de las páginas consumen la capa `src/api/`** respetando el flag `VITE_USE_MOCK`.

---

## 4. Comparación con el Diseño (DER)

> **Modelo Entidad-Relación de Referencia:** Auditoría realizada contra el diseño formal de la base de datos decodificado desde `docs/Entregables/entregable 2/der.md`.

### 1. Alineación de Nomenclatura de Atributos
Se refactorizaron los nombres de campos en los modelos, módulos API y pantallas del frontend para alinearse 1:1 con el DER:
- `duracionAnios` (número entero) en `Carrera` (en lugar de `duracion`).
- `domicilio` en `Alumno` y `Usuario` (en lugar de `direccion`).
- `titulo` en `Docente` (en lugar de `especialidad`).
- `importe` en `Cuota`, `Pago` y `Matricula` (en lugar de `monto`).
- `numero` en `Cuota` (en lugar de `numeroCuota`).

### 2. Estructura Curricular: Materias y Planes
- En la base de datos relacional (DER), la relación entre `PLAN_ESTUDIO` y `MATERIA` es muchos a muchos a través de la tabla intermedia `PLAN_MATERIA` (con `anio_plan`).
- En el frontend y en la capa API REST, se consume el endpoint jerárquico `GET /api/planes-estudio/{id}/materias` (`getMateriasDePlan`), que devuelve la colección estructurada de materias con año y correlativas: `[{ idMateria, nombre, anio, correlativas: [idMateria] }]`.

### 3. Entidades Exclusivas del Frontend (Solicitud y Documentación)
> **Nota Importante:** Aunque no figuren explícitamente en el DER físico ni en los requerimientos iniciales, las entidades **`Solicitud`** y **`Documentacion`** son artefactos esenciales que la interfaz de usuario del frontend requiere para proveer la autogestión de trámites estudiantiles (constancias, pasantías, cambio de carrera, título intermedio, reincorporaciones) y el control de legajo.
> Permanecen intactas en el frontend y en la base de datos se persistirán según el esquema y definiciones que se adopten en etapas posteriores del proyecto.

### 4. Campos Desnormalizados para Optimización de UI
El frontend mantiene calculados o desnormalizados en sus DTOs:
- Nombres de entidades vinculadas: `alumnoNombre`, `materiaNombre`, `cursoNombre`, `carreraNombre`, `planNombre`, `docenteNombre`.
- Contadores y vacantes: `cuposDisponibles`, `inscriptos`, `cursosCount`, `planesCount`, `alumnosInscriptosIds`.

---

## 5. Registro de Cambios

A continuación se detallan las decisiones arquitectónicas aplicadas en el refactor del frontend y su contrato API:

1. **Un solo camino para pagar:** Eliminación de `pagarCuota`, unificación en `registrarPago` (`POST /api/pagos`) con validación de regla RN09 (importe igual al de la cuota) y usuario cobrador obtenido de la sesión.
2. **Carga de calificaciones en lote por evaluación:** Incorporación de `guardarCalificaciones` (`POST /api/evaluaciones/{idEvaluacion}/calificaciones`) con guardado atómico, validación de notas 1-10 y reporte de errores por estudiante.
3. **Generación de cuotas por matrícula:** Incorporación de `generarCuotas` (`POST /api/matriculas/{idMatricula}/cuotas`) para emitir 12 cuotas mensuales y 3 seguros cuatrimestrales en estado pendiente, accesible para administrativos.
4. **Endpoints de perfil de usuario:** Incorporación de `getMiPerfil` (`GET /api/usuarios/me`) y `actualizarMiPerfil` (`PUT /api/usuarios/me`) con persistencia en `mockDb` y `sessionStorage` para la vista de datos personales.
5. **Corrección de rutas REST:** Normalización a estándares canónicos de `cancelarMatricula` (`PATCH /api/matriculas/{id}`), `inscribirseMesa` (`POST /api/mesas-examen/{id}/inscripciones`), `darseDeBajaMesa` (`DELETE /api/mesas-examen/{id}/inscripciones/{idInscripcion}`) y `resolverSolicitud` (`PATCH /api/solicitudes/{id}`).
6. **Alineación de campos con el DER:** Reemplazo integral de nombres de campos en modelos y componentes: `duracionAnios`, `domicilio`, `titulo`, `importe` y `numero`.
7. **Materias de un plan:** Creación de `src/api/planes.js` con `getMateriasDePlan` (`GET /api/planes-estudio/{id}/materias`) devolviendo estructura con año y correlativas numéricas, y refactorización de vistas de planes.
8. **Preservación de solicitudes y documentación:** Mantenimiento íntegro de las entidades `Solicitud` y `Documentacion` como artefactos requeridos por la operativa del frontend para su posterior modelado en base de datos.
