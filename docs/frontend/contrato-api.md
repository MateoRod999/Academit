# Contrato de API REST - Frontend a Backend

Este documento constituye la especificación formal del contrato de interfaz entre el frontend (React) y el backend (Spring Boot) de **Academit**. Describe cada endpoint consumido por el cliente web, los parámetros o payload enviados, la estructura de respuesta esperada y el código de estado HTTP correspondiente.

---

## 1. Módulo: Autenticación y Perfil

| Método | Endpoint URL | Datos que Envía (Payload / Params) | Datos que Espera (Response Body) | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/login` | `{ username, password }` | `{ idUsuario, usuario, nombre, rol, email, token }` | `200 OK` |
| `POST` | `/api/auth/logout` | Ninguno (Token en Header `Authorization`) | `{ success: true }` | `200 OK` |
| `POST` | `/api/auth/cambiar-password` | `{ actual, nueva }` | `{ success: true, message: string }` | `200 OK` |

---

## 2. Módulo: Alumnos

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/alumnos` | Ninguno | `Array<Alumno>` | `200 OK` |
| `GET` | `/api/alumnos/{id}` | Parámetro de ruta `id` | `Alumno` | `200 OK` |
| `POST` | `/api/alumnos` | `{ nombre, apellido, dni, email, telefono, direccion, fechaNacimiento, idCarrera, idPlan }` | `Alumno` (con `idAlumno` y `legajo` asignado) | `201 Created` |
| `PUT` | `/api/alumnos/{id}` | `{ nombre, apellido, dni, email, telefono, direccion, fechaNacimiento, idCarrera, idPlan }` | `Alumno` actualizado | `200 OK` |
| `DELETE` | `/api/alumnos/{id}` | Parámetro de ruta `id` (baja lógica) | `{ success: true }` (estado -> `INACTIVO`) | `200 OK` |
| `GET` | `/api/alumnos/{id}/situacion-academica` | Parámetro de ruta `id` | `{ alumno, calificaciones: Array, materiasAprobadas: number }` | `200 OK` |
| `GET` | `/api/alumnos/{id}/situacion-administrativa` | Parámetro de ruta `id` | `{ alumno, matricula, cuotas: Array, pagos: Array, deudaTotal: number, totalAbonado: number }` | `200 OK` |

---

## 3. Módulo: Carreras y Planes de Estudio

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/carreras` | Ninguno | `Array<Carrera>` | `200 OK` |
| `GET` | `/api/carreras/{id}` | Parámetro de ruta `id` | `Carrera` | `200 OK` |
| `POST` | `/api/carreras` | `{ codigo, nombre, tituloOtorgado, duracion, resolucion }` | `Carrera` creada | `201 Created` |
| `PUT` | `/api/carreras/{id}` | `{ codigo, nombre, tituloOtorgado, duracion, resolucion }` | `Carrera` modificada | `200 OK` |
| `DELETE` | `/api/carreras/{id}` | Parámetro de ruta `id` | `{ success: true }` (estado -> `INACTIVA`) | `200 OK` |
| `GET` | `/api/carreras/{id}/planes` | Parámetro de ruta `id` | `Array<PlanEstudio>` de la carrera | `200 OK` |
| `GET` | `/api/carreras/{id}/cursos` | Parámetro de ruta `id` | `Array<Curso>` de la carrera | `200 OK` |
| `GET` | `/api/planes-estudio` | Ninguno | `Array<PlanEstudio>` | `200 OK` |

---

## 4. Módulo: Cursos y Comisiones

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/cursos` | Ninguno | `Array<Curso>` | `200 OK` |
| `POST` | `/api/cursos` | `{ nombre, codigo, idCarrera, turno, capacidadMaxima, aula, cicloLectivo }` | `Curso` creado con `cuposDisponibles` | `201 Created` |
| `PUT` | `/api/cursos/{id}` | `{ nombre, codigo, idCarrera, turno, capacidadMaxima, aula, cicloLectivo }` | `Curso` actualizado | `200 OK` |

---

## 5. Módulo: Docentes

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/docentes` | Ninguno | `Array<Docente>` | `200 OK` |
| `POST` | `/api/docentes` | `{ nombre, apellido, dni, email, especialidad, telefono }` | `Docente` registrado | `201 Created` |
| `PUT` | `/api/docentes/{id}` | `{ nombre, apellido, dni, email, especialidad, telefono }` | `Docente` actualizado | `200 OK` |
| `DELETE` | `/api/docentes/{id}` | Parámetro de ruta `id` (baja lógica) | `{ success: true }` | `200 OK` |

---

## 6. Módulo: Materias y Malla Curricular

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/materias` | Query params: `?idCarrera=&idPlan=` | `Array<Materia>` | `200 OK` |
| `POST` | `/api/materias` | `{ codigo, nombre, anio, regimen, horasSemanales, idCarrera, idPlan, correlativas: [] }` | `Materia` registrada | `201 Created` |
| `PUT` | `/api/materias/{id}` | `{ correlativas: Array<string> }` o datos de materia | `Materia` actualizada | `200 OK` |

---

## 7. Módulo: Ciclos Lectivos

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/ciclos-lectivos` | Ninguno | `Array<CicloLectivo>` | `200 OK` |
| `POST` | `/api/ciclos-lectivos` | `{ anio, nombre, fechaInicio, fechaFin, estado }` | `CicloLectivo` creado | `201 Created` |
| `PUT` | `/api/ciclos-lectivos/{id}` | `{ anio, nombre, fechaInicio, fechaFin, estado }` | `CicloLectivo` actualizado | `200 OK` |

---

## 8. Módulo: Asignaciones Cátedra-Docente

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/asignaciones` | Ninguno | `Array<Asignacion>` | `200 OK` |
| `POST` | `/api/asignaciones` | `{ idDocente, idMateria, idCurso, rolDocente }` | `Asignacion` creada | `201 Created` |
| `DELETE` | `/api/asignaciones/{id}` | Parámetro de ruta `id` | `{ success: true }` | `200 OK` |

---

## 9. Módulo: Inscripciones a Cursos

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/inscripciones` | Ninguno | `Array<Inscripcion>` | `200 OK` |
| `POST` | `/api/inscripciones` | `{ idAlumno, idCurso, cicloLectivo }` | `Inscripcion` confirmada | `201 Created` |
| `DELETE` | `/api/inscripciones/{id}` | Parámetro de ruta `id` | `{ success: true }` (libera cupo) | `200 OK` |

---

## 10. Módulo: Mesas de Examen

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/mesas-examen` | Ninguno | `Array<MesaExamen>` | `200 OK` |
| `POST` | `/api/mesas-examen` | `{ idMateria, fecha, hora, turno, tribunal, aula, cupoMaximo }` | `MesaExamen` creada | `201 Created` |
| `PUT` | `/api/mesas-examen/{id}` | `{ fecha, hora, tribunal, aula, estadoMesa }` | `MesaExamen` actualizada | `200 OK` |
| `POST` | `/api/mesas-examen/{id}/inscribir` | `{ idAlumno }` | `MesaExamen` actualizada con inscripción | `200 OK` |
| `POST` | `/api/mesas-examen/{id}/baja` | `{ idAlumno }` | `MesaExamen` con baja procesada | `200 OK` |

---

## 11. Módulo: Evaluaciones y Calificaciones

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/evaluaciones` | Query params: `?tipo=&idCurso=` | `Array<Evaluacion>` | `200 OK` |
| `POST` | `/api/evaluaciones` | `{ idMateria, idCurso, fecha, tipo, descripcion, ponderacion }` | `Evaluacion` creada | `201 Created` |
| `GET` | `/api/calificaciones` | Query params: `?idAlumno=&tipo=&idMateria=` | `Array<Calificacion>` | `200 OK` |
| `POST` | `/api/calificaciones` | `{ idAlumno, idMateria, evaluacionNombre, tipo, nota, fecha, observacion }` | `Calificacion` (nota de 1 a 10) | `200 OK` |

---

## 12. Módulo: Asistencias

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/asistencias` | Query params: `?idAlumno=&idCurso=&fecha=` | `Array<Asistencia>` | `200 OK` |
| `POST` | `/api/asistencias/lote` | `Array<{ idAlumno, idCurso, fecha, estado }>` | `{ success: true, count: number }` | `200 OK` |

---

## 13. Módulo: Matrículas, Cuotas y Pagos

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/matriculas` | Ninguno | `Array<Matricula>` | `200 OK` |
| `PUT` | `/api/matriculas/{id}` | `{ estado: 'ACTIVA' | 'CANCELADA' }` | `Matricula` actualizada | `200 OK` |
| `POST` | `/api/matriculas/cancelar` | `{ idAlumno, motivo }` (RF27) | `{ success: true, matricula }` | `200 OK` |
| `GET` | `/api/cuotas` | Query param opcional: `?idAlumno=` | `Array<Cuota>` (mensuales y seguros) | `200 OK` |
| `POST` | `/api/cuotas/{id}/pagar` | `{ medioPago }` | `Cuota` en estado `PAGADA` | `200 OK` |
| `GET` | `/api/pagos` | Query param opcional: `?idAlumno=` | `Array<Pago>` | `200 OK` |
| `POST` | `/api/pagos` | `{ idAlumno, concepto, monto, medioPago, fechaPago, idCuota }` | `Pago` registrado | `201 Created` |

---

## 14. Módulo: Solicitudes y Documentación

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/solicitudes` | Query params: `?idAlumno=&tipo=&estado=` | `Array<Solicitud>` | `200 OK` |
| `POST` | `/api/solicitudes` | `{ idAlumno, tipo, motivo, observaciones }` | `Solicitud` en estado `PENDIENTE` | `201 Created` |
| `PUT` | `/api/solicitudes/{id}/resolver` | `{ estado: 'APROBADA' | 'RECHAZADA', respuesta }` | `Solicitud` resuelta | `200 OK` |
| `GET` | `/api/documentacion` | Query param opcional: `?idAlumno=` | `Array<Documento>` | `200 OK` |
| `PUT` | `/api/documentacion/{id}` | `{ estado, observaciones, fechaEntrega }` | `Documento` actualizado | `200 OK` |

---

## 15. Módulo: Usuarios y Roles

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/usuarios` | Ninguno | `Array<Usuario>` | `200 OK` |
| `POST` | `/api/usuarios` | `{ username, nombre, email, rol }` | `Usuario` creado | `201 Created` |
| `PUT` | `/api/usuarios/{id}` | `{ nombre, email, rol, estado }` | `Usuario` modificado | `200 OK` |
| `DELETE` | `/api/usuarios/{id}` | Parámetro de ruta `id` | `{ success: true }` | `200 OK` |
