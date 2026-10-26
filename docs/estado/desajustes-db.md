# Informe de Desajustes entre Base de Datos y Contrato del Frontend

Este informe compara las especificaciones del contrato (`docs/frontend/entidades.json` y `endpoints.csv`) con el esquema de base de datos (`database/01-schema.sql` y `02-datos-iniciales.sql`). Fue generado automáticamente mediante `tools/comparar-db-contrato.py`.

## 1. Tabla de Desajustes Detectados y Estado de Resolución

| Entidad del Contrato | Tabla del Esquema | Campos o Enums que Faltan o Difieren | Acción Requerida | Estado |
| --- | --- | --- | --- | --- |
| Solicitud | `solicitud` | Tabla ausente en el esquema original. Requería creación con idSolicitud, idAlumno, tipo, fechaSolicitud, motivo, observaciones, estado, fechaResolucion, respuesta y restricciones CHECK. | Crear tabla con FK a alumno y checks de tipo/estado. | Resuelto en `feature/db-alinear-contrato` |
| Documentacion | `documentacion` | Tabla ausente en el esquema original. Requería creación con idDocumento, idAlumno, tipo, obligatorio, estado, fechaEntrega, observaciones y restricciones CHECK. | Crear tabla con FK a alumno y checks correspondientes. | Resuelto en `feature/db-alinear-contrato` |
| Asignacion | `curso_materia` | Faltaba columna `rol_docente` (TITULAR, ADJUNTO, JTP) y la unicidad previa impedía múltiples docentes por curso y materia. | Agregar columna `rol_docente VARCHAR(20) NOT NULL` y cambiar unicidad a `(id_curso, id_materia, id_docente)`. | Resuelto en `feature/db-alinear-contrato` |
| MesaExamen | `mesa_examen` | Faltaban columnas `tribunal` (nombres de evaluadores) y `turno` (MANANA, TARDE, NOCHE). | Agregar `tribunal VARCHAR(150)` y `turno VARCHAR(10)`. | Resuelto en `feature/db-alinear-contrato` |
| Asistencia | `asistencia` | Faltaba columna `id_materia` y la unicidad no discriminaba cátedra en la misma fecha. | Agregar `id_materia INTEGER NOT NULL REFERENCES materia` y unicidad `(id_alumno, id_curso, id_materia, fecha)`. | Resuelto en `feature/db-alinear-contrato` |
| Curso | `curso` | Faltaba columna `turno` normalizada (MANANA, TARDE, NOCHE). | Agregar columna `turno VARCHAR(10) NOT NULL` con CHECK correspondientes. | Resuelto en `feature/db-alinear-contrato` |
| Cuota | `cuota` / `tipo_cuota` | Valores en `tipo_cuota` eran 'MENSUAL' y 'SEGURO' en vez de 'CUOTA_MENSUAL' y 'SEGURO_CUATRIMESTRAL' (rangos 1-12 y 1-3, RN18). | Actualizar catálogo a `CUOTA_MENSUAL` y `SEGURO_CUATRIMESTRAL` y soportar estado `ANULADA`. | Resuelto en `feature/db-alinear-contrato` |
| Pago | `pago` / `medio_pago` | Faltaba columna `comprobante` con formato AAAA-NNNNNN único por recibo emitido. | Agregar `comprobante VARCHAR(11) NOT NULL UNIQUE` con formato año y secuencial. | Resuelto en `refactor/aplicar-decisiones-estado` |
| Alumno / Docente | `alumno`, `docente`, `estado_persona` | Discrepancia de estados: contrato preveía `REGULAR`, `ACTIVO`, `INACTIVO` mientras dominio y BD usaban `ACTIVO`, `INACTIVO` / `BAJA`. | Unificar en `ACTIVO` e `INACTIVO`. Condición regular se calcula por materia. Eliminar `REGULAR` y mapear `BAJA` a `INACTIVO`. | Resuelto en `refactor/aplicar-decisiones-estado` |
| Matricula | `matricula` | Contrato frontend definía `estadoPago` con valores `AL_DIA`, `CON_DEUDA`, `EXENTO`, pero la BD no lo persistía ni el backend lo calculaba. | No guardar columna en BD. Calcular en backend y exponer en contrato como `AL_DIA`, `EN_MORA`, `PENDIENTE` según cuotas asociadas. | Resuelto en `refactor/aplicar-decisiones-estado` |

## 2. Decisión de Diseño: Asignaciones de Docentes

- **Problema:** En el contrato existe `Asignacion` con `rolDocente` (valores `TITULAR`, `ADJUNTO`, `JTP`), permitiendo que una misma materia en un curso cuente con múltiples docentes asignados en distintos roles. En el esquema original, `curso_materia` tenía una restricción `uk_curso_materia UNIQUE (id_curso, id_materia)` y no almacenaba el rol.
- **Decisión adoptada:** La solución adoptada incorpora la columna `rol_docente VARCHAR(20) NOT NULL DEFAULT 'TITULAR'` con CHECK `rol_docente IN ('TITULAR', 'ADJUNTO', 'JTP')` directamente en la tabla `curso_materia`, y actualiza la restricción de unicidad a `UNIQUE (id_curso, id_materia, id_docente)`. De esta forma se permite asignar varios docentes a la misma cátedra/comisión con roles diferenciados, sin duplicar la asignación de un mismo docente en la misma materia/curso.

## 3. Decisiones de Dominio Aplicadas

Conforme a los acuerdos de diseño y la homologación entre capas, los siguientes aspectos fueron definidos y aplicados en el repositorio:

1. **Estados de Alumno y Docente:** Se unificaron bajo los estados `ACTIVO` e `INACTIVO`. Se eliminó `REGULAR` del estado general del alumno (la regularidad es por materia y se calcula dinámicamente según notas y asistencias), y `BAJA` se consolidó en `INACTIVO`. Aplicado en base de datos, backend, contrato y frontend (`refactor/aplicar-decisiones-estado`).
2. **`Matricula.estadoPago` (Calculado):** No se persiste como columna en la tabla `matricula`. El backend lo calcula dinámicamente al consultar la matrícula a partir de sus cuotas asociadas: `EN_MORA` si posee al menos una cuota vencida impaga; `AL_DIA` si todas las cuotas vencidas (o la totalidad) están pagadas; y `PENDIENTE` en el resto de los casos. Los valores obsoletos (`AL_DIA`, `CON_DEUDA`, `EXENTO`) fueron corregidos y unificados a (`AL_DIA`, `EN_MORA`, `PENDIENTE`) en el contrato OpenAPI, entidades.json y guías de frontend.
3. **Comprobante de Pago:** Se estableció el formato `AAAA-NNNNNN` para la emisión de recibos oficiales. Se agregó la columna `comprobante VARCHAR(11) NOT NULL UNIQUE` en la tabla `pago`, con generación automática secuencial anual en el backend y visualización en el frontend.
