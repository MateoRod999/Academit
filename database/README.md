# Base de Datos de Academit

Este directorio contiene los scripts SQL de definición y datos iniciales para PostgreSQL 16+.

## Estructura de Scripts

- `01-schema.sql`: Creación del esquema `public` y definición de las 32 tablas (25 tablas de negocio + 7 tablas catálogo), restricciones `CHECK`, claves primarias, claves foráneas e índices.
- `02-datos-iniciales.sql`: Inserción de catálogos, datos maestros institucionales, usuarios de prueba por cada rol y registros iniciales para desarrollo.

## Tablas del Esquema (32 tablas)

### 1. Usuarios y Roles (2)
- `rol`: Roles del sistema (`ADMINISTRADOR`, `ADMINISTRATIVO`, `DOCENTE`, `ALUMNO`).
- `usuario`: Cuentas de acceso con hash BCrypt vinculadas opcionalmente a alumno o docente.

### 2. Catálogos (7)
- `estado_persona`: Estados de alumno y docente (`ACTIVO`, `INACTIVO`).
- `estado_matricula`: Estados de matrícula (`PENDIENTE`, `ACTIVA`, `CANCELADA`).
- `estado_cuota`: Estados de cuota (`PENDIENTE`, `PAGADA`, `VENCIDA`, `ANULADA`).
- `tipo_cuota`: Tipos arancelarios (`CUOTA_MENSUAL`, `SEGURO_CUATRIMESTRAL`).
- `medio_pago`: Medios de cobro (`EFECTIVO`, `TRANSFERENCIA`, `TARJETA`, `OTRO`).
- `tipo_evaluacion`: Instancias evaluativas (`PRIMER_PARCIAL`, `SEGUNDO_PARCIAL`, `TRABAJO_PRACTICO`, `EXAMEN_FINAL`, `RECUPERATORIO`).
- `estado_asistencia`: Estados de asistencia (`PRESENTE`, `AUSENTE`, `TARDANZA`, `JUSTIFICADO`).

### 3. Estructura Académica (7)
- `carrera`: Carreras universitarias y terciarias.
- `plan_estudio`: Planes de estudio por carrera.
- `materia`: Catálogo curricular de materias.
- `plan_materia`: Asignación de materias a planes de estudio.
- `correlativa`: Reglas de correlatividades entre materias.
- `ciclo_lectivo`: Períodos lectivos anuales.
- `curso`: Comisiones por carrera y ciclo con turno (`MANANA`, `TARDE`, `NOCHE`).

### 4. Personas y Asignaciones (3)
- `alumno`: Datos personales y académicos de estudiantes.
- `docente`: Padrón docente con título y contacto.
- `curso_materia`: Asignación de docentes a materias dentro de un curso con su rol (`TITULAR`, `ADJUNTO`, `JTP`).

### 5. Inscripciones, Matrículas y Aranceles (4)
- `inscripcion`: Inscripción de alumnos a comisiones.
- `matricula`: Registro de matrícula anual por ciclo lectivo.
- `cuota`: Obligaciones de pago mensuales o de seguro cuatrimestral por matrícula.
- `pago`: Registros de cancelación efectiva de cuotas.

### 6. Desempeño Académico (4)
- `evaluacion`: Evaluaciones programadas por cátedra/comisión.
- `calificacion`: Notas individuales asignadas a estudiantes (1-10).
- `asistencia`: Registro de asistencia diario por alumno, curso y materia.
- `mesa_examen`: Mesas examinadoras finales con tribunal y turno.
- `inscripcion_mesa`: Inscripción de estudiantes a mesas de examen.

### 7. Trámites y Declaraciones (3)
- `declaracion_jurada`: DDJJ de materias por ciclo lectivo.
- `declaracion_materia`: Detalle de materias incluidas en la DDJJ.
- `solicitud`: Solicitudes académicas, pasantías y constancias.
- `documentacion`: Control de legajo y documentación obligatoria requerida.

## Administración con Nix-Shell

Desde la raíz del proyecto ejecutando `nix-shell`:
- `db-init`: Inicializa el clúster local en `.pgdata/`, crea el rol y base `academit`.
- `db-reset`: Reinicia la base y carga en orden `01-schema.sql` y `02-datos-iniciales.sql`.
- `db-psql`: Abre una sesión interactiva de `psql` conectada a `academit`.
