# Entregables y Tareas Pendientes (No Código) - Academit

Documento de seguimiento de tareas documentales, modelos y entregables formales requeridos para la presentación final del TP Integrador (Taller de Lenguajes de Programación III).

---

## 1. Portada y Formalidades Institucionales
- [ ] Portada formal con:
  - Nombre de la institución y asignatura.
  - Título del proyecto (**Academit**).
  - Datos de los integrantes del grupo (Nombre, Apellido, DNI, Legajo).
  - Docente titular y ayudante a cargo de la comisión.
  - Fecha de entrega y versión del documento.

## 2. Análisis y Especificación de Requisitos (`docs/entregables/entregable-1-analisis.md`)
- [ ] Incorporar la especificación formal de Requisitos Funcionales (RF46 a RF58) y Reglas de Negocio (RN15 a RN27) para los módulos agregados en el contrato del frontend:
  - Trámites y Solicitudes de Alumnos (cancelación de matrícula, cambio de carrera, equivalencias, reincorporación).
  - Legajo Digital y Documentación respaldatoria (DNI, título secundario, constancia de trabajo, fotos).
  - Declaración Jurada anual de materias a cursar.
  - Pasantías y constancias emitidas.

## 3. Diagramas y Modelos UML Actualizados (`docs/entregables/entregable-2/`)
- [ ] **Diagrama Entidad-Relación (DER):**
  - Actualizar esquema gráfico con las tablas `solicitud`, `documentacion`, `rol_docente` en `curso_materia`, `asistencia.id_materia`, `turno` en cursos y mesas, y columna `pago.comprobante`.
- [ ] **Diagrama de Clases:**
  - Actualizar modelo de dominio con las nuevas entidades JPA, relaciones bidireccionales y ciclo de vida de persona con estado `ACTIVO`/`INACTIVO`.
- [ ] **Diagramas de Secuencia:**
  - Secuencia de pago y generación de comprobante correlativo `AAAA-NNNNNN`.
  - Secuencia de cancelación de matrícula y anulación de cuotas pendientes.
  - Secuencia de carga de calificaciones y validación de docente asignado.
  - Secuencia de toma de asistencias por materia y cálculo de regularidad.

## 4. Modelo Relacional y Diccionario de Datos
- [ ] Diccionario de datos exhaustivo con especificación de tipos de datos PostgreSQL, claves primarias compuestas/auto-incrementales, claves foráneas, índices de performance y restricciones `CHECK` / `UNIQUE`.

## 5. Preparación para la Defensa Oral
- [ ] Guión y demostración funcional completa (flujo institucional punta a punta):
  1. Configuración de ciclo lectivo, carreras, planes y materias.
  2. Alta y asignación de docentes a comisiones con roles.
  3. Matriculación de alumnos y generación del plan de 12 cuotas y 3 seguros.
  4. Cobro arancelario y emisión de comprobante oficial.
  5. Inscripción a cursada con control de cupo.
  6. Registro de asistencias y calificaciones por parte del docente asignado.
  7. Autogestión del alumno: consulta de situación integral, descarga de comprobantes y presentación de solicitudes.
