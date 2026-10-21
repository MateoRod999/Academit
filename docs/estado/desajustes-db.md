# Informe de Desajustes entre Base de Datos y Contrato del Frontend

Este informe compara las especificaciones del contrato (`docs/frontend/entidades.json` y `endpoints.csv`) con el esquema de base de datos (`database/01-schema.sql` y `02-datos-iniciales.sql`). Fue generado automáticamente mediante `tools/comparar-db-contrato.py`.

## 1. Tabla de Desajustes Detectados

| Entidad del Contrato | Tabla del Esquema | Campos o Enums que Faltan o Difieren | Acción Requerida |
| --- | --- | --- | --- |
| Solicitud | `solicitud` (inexistente) | Tabla ausente en el esquema. Requiere creación con campos: idSolicitud, idAlumno, tipo, fechaSolicitud, motivo, observaciones, estado, fechaResolucion, respuesta y sus restricciones CHECK. | Crear tabla nueva |
| Documentacion | `documentacion` (inexistente) | Tabla ausente en el esquema. Requiere creación con campos: idDocumento, idAlumno, tipo, obligatorio, estado, fechaEntrega, observaciones y sus restricciones CHECK. | Crear tabla nueva |
| Asignacion | `curso_materia` | Falta columna `rol_docente` (TITULAR, ADJUNTO, JTP). `uk_curso_materia` impide más de un docente por curso y materia. | Agregar `rol_docente VARCHAR(20) NOT NULL` y cambiar unicidad a `(id_curso, id_materia, id_docente)`. |
| MesaExamen | `mesa_examen` | Falta columna `tribunal` (nombres del tribunal evaluador) y turno (MANANA/TARDE/NOCHE). | Agregar `tribunal VARCHAR(150)` y `turno VARCHAR(10)`. |
| Asistencia | `asistencia` | Falta columna `id_materia`. La restricción `uk_asistencia` es sobre `(id_alumno, id_curso, fecha)` en vez de incluir materia. | Agregar `id_materia INTEGER NOT NULL REFERENCES materia` y unicidad `(id_alumno, id_curso, id_materia, fecha)`. |
| Curso | `curso` | Falta columna `turno` con valores sin tildes ni espacios (MANANA, TARDE, NOCHE). | Agregar `turno VARCHAR(10) NOT NULL` con CHECK `('MANANA', 'TARDE', 'NOCHE')`. |
| Cuota | `cuota` / `tipo_cuota` | Valores en `tipo_cuota` eran 'MENSUAL' y 'SEGURO' en lugar de 'CUOTA_MENSUAL' y 'SEGURO_CUATRIMESTRAL' (rangos 1-12 y 1-3, RN18). | Actualizar catálogo a `CUOTA_MENSUAL` y `SEGURO_CUATRIMESTRAL`. Verificar rango de número (RN18) y estado `ANULADA`. |
| Pago | `pago` / `medio_pago` | El catálogo `medio_pago` incluye OTRO. La tabla `pago` tiene `id_cuota` (alineado). | Mantener `OTRO` en catálogo y validar coherencia de tipos. |

## 2. Decisión de Diseño: Asignaciones de Docentes

- **Problema:** En el contrato existe `Asignacion` con `rolDocente` (valores `TITULAR`, `ADJUNTO`, `JTP`), permitiendo que una misma materia en un curso cuente con múltiples docentes asignados en distintos roles. En el esquema original, `curso_materia` tenía una restricción `uk_curso_materia UNIQUE (id_curso, id_materia)` y no almacenaba el rol.
- **Decisión adoptada:** La solución más simple y de menor impacto que preserva la compatibilidad con las claves foráneas existentes (ej. `evaluacion.id_curso_materia`) es incorporar la columna `rol_docente VARCHAR(20) NOT NULL DEFAULT 'TITULAR'` con CHECK `rol_docente IN ('TITULAR', 'ADJUNTO', 'JTP')` directamente en la tabla `curso_materia`, y actualizar la restricción de unicidad a `UNIQUE (id_curso, id_materia, id_docente)`. De esta forma se permite asignar varios docentes a la misma cátedra/comisión con roles diferenciados, sin duplicar la asignación de un mismo docente en la misma materia/curso.

## 3. Decisiones Pendientes del Equipo (No Modificadas)

Conforme a las indicaciones del proyecto, los siguientes aspectos no se alteran y quedan como decisiones pendientes para el equipo:

1. **Estados de Alumno:** El contrato frontend contempla los estados `REGULAR`, `ACTIVO` e `INACTIVO`, mientras que la base de datos utiliza la tabla catálogo `estado_persona` con `ACTIVO` e `INACTIVO` (y en el dominio se discutió `ACTIVO`/`BAJA`). Se mantiene el esquema existente sin cambios.
2. **`Matricula.estado_pago`:** El contrato define `estadoPago` (`AL_DIA`, `CON_DEUDA`, `EXENTO`), pero ningún flujo actual del backend ni de la base de datos lo persiste o actualiza (es un concepto calculado a partir del estado de las cuotas asociadas). Se mantiene sin columna en `matricula`.
