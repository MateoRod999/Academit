# Contrato de API REST - Frontend a Backend

Este documento constituye la especificación formal del contrato de interfaz entre el frontend (React) y el backend (Spring Boot) de **Academit**. Describe cada endpoint consumido por el cliente web, los parámetros o payload enviados, la estructura de respuesta esperada y el código de estado HTTP correspondiente.

---

## 1. Módulo: Autenticación y Perfil

| Método | Endpoint URL | Datos que Envía (Payload / Params) | Datos que Espera (Response Body) | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/login` | `{ username, password }` | `{ idUsuario, usuario, nombre, rol, email, token }` | `200 OK` |
| `POST` | `/api/auth/logout` | Ninguno (Token en Header `Authorization`) | `{ success: true }` | `200 OK` |
| `POST` | `/api/auth/cambiar-password` | `{ actual, nueva }` | `{ success: true, message: string }` | `200 OK` |
| `GET` | `/api/usuarios/me` | Ninguno | `PerfilUsuarioDTO { username, nombre, email, telefono, domicilio, rol }` | `200 OK` |
| `PUT` | `/api/usuarios/me` | `{ nombre, email, telefono, domicilio }` | `PerfilUsuarioDTO` | `200 OK` |

---

## 2. Módulo: Alumnos

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/alumnos` | Query params: `?search=&idCarrera=&estado=` | `Array<Alumno>` | `200 OK` |
| `GET` | `/api/alumnos/{id}` | Parámetro de ruta `id` | `Alumno` | `200 OK` |
| `POST` | `/api/alumnos` | `{ nombre, apellido, dni, email, telefono, domicilio, fechaNacimiento, idCarrera, idPlan }` | `Alumno` (con `idAlumno` y `legajo`) | `201 Created` |
| `PUT` | `/api/alumnos/{id}` | `{ nombre, apellido, email, telefono, domicilio, estado, idPlan }` | `Alumno` actualizado | `200 OK` |
| `DELETE` | `/api/alumnos/{id}` | Parámetro de ruta `id` (baja lógica) | `{ success: true }` (estado -> `INACTIVO`) | `200 OK` |
| `GET` | `/api/alumnos/{id}/situacion-academica` | Parámetro de ruta `id` | `{ alumno, calificaciones: Array, materiasAprobadas: number }` | `200 OK` |
| `GET` | `/api/alumnos/{id}/situacion-administrativa` | Parámetro de ruta `id` | `{ alumno, matricula, cuotas: Array, pagos: Array, totalDeuda: number, totalAbonado: number }` | `200 OK` |

---

## 3. Módulo: Carreras y Planes de Estudio

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/carreras` | Query params: `?estado=` | `Array<Carrera>` | `200 OK` |
| `GET` | `/api/carreras/{id}` | Parámetro de ruta `id` | `Carrera` | `200 OK` |
| `POST` | `/api/carreras` | `{ codigo, nombre, tituloOtorgado, duracionAnios, resolucion }` | `Carrera` creada | `201 Created` |
| `PUT` | `/api/carreras/{id}` | `{ codigo, nombre, tituloOtorgado, duracionAnios, resolucion, estado }` | `Carrera` modificada | `200 OK` |
| `DELETE` | `/api/carreras/{id}` | Parámetro de ruta `id` | `{ success: true }` (estado -> `INACTIVA`) | `200 OK` |
| `GET` | `/api/carreras/{id}/planes` | Parámetro de ruta `id` | `Array<PlanEstudio>` de la carrera | `200 OK` |
| `GET` | `/api/carreras/{id}/cursos` | Parámetro de ruta `id` | `Array<Curso>` de la carrera | `200 OK` |
| `GET` | `/api/planes-estudio` | Query params: `?idCarrera=` | `Array<PlanEstudio>` | `200 OK` |
| `GET` | `/api/planes-estudio/{id}/materias` | Parámetro de ruta `id` | `Array<{ idMateria, nombre, anio, correlativas: [idMateria] }>` | `200 OK` |

---

## 4. Módulo: Cursos y Comisiones

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/cursos` | Query params: `?idCarrera=&turno=` | `Array<Curso>` | `200 OK` |
| `POST` | `/api/cursos` | `{ nombre, codigo, idCarrera, idPlan, turno, capacidadMaxima, aula, cicloLectivo }` | `Curso` creado con `cuposDisponibles` | `201 Created` |
| `PUT` | `/api/cursos/{id}` | `{ nombre, turno, aula, capacidadMaxima }` | `Curso` actualizado | `200 OK` |

---

## 5. Módulo: Docentes

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/docentes` | Query params: `?estado=` | `Array<Docente>` | `200 OK` |
| `POST` | `/api/docentes` | `{ legajo, nombre, apellido, dni, email, telefono, titulo }` | `Docente` registrado | `201 Created` |
| `PUT` | `/api/docentes/{id}` | `{ nombre, apellido, email, telefono, titulo, estado }` | `Docente` actualizado | `200 OK` |
| `DELETE` | `/api/docentes/{id}` | Parámetro de ruta `id` (baja lógica) | `{ success: true }` | `200 OK` |

---

## 6. Módulo: Materias y Malla Curricular

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/materias` | Query params: `?idCarrera=&idPlan=` | `Array<Materia>` | `200 OK` |
| `POST` | `/api/materias` | `{ codigo, nombre, idCarrera, idPlan, anio, regimen, horasSemanales, correlativas }` | `Materia` registrada | `201 Created` |
| `PUT` | `/api/materias/{id}` | `{ nombre, anio, regimen, horasSemanales, correlativas }` | `Materia` actualizada | `200 OK` |

---

## 7. Módulo: Ciclos Lectivos

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/ciclos-lectivos` | Ninguno | `Array<CicloLectivo>` | `200 OK` |
| `POST` | `/api/ciclos-lectivos` | `{ anio, nombre, fechaInicio, fechaFin, estado }` | `CicloLectivo` creado | `201 Created` |
| `PUT` | `/api/ciclos-lectivos/{id}` | `{ nombre, fechaInicio, fechaFin, estado }` | `CicloLectivo` actualizado | `200 OK` |

---

## 8. Módulo: Asignaciones Cátedra-Docente

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/asignaciones` | Query params: `?idDocente=&idCurso=` | `Array<Asignacion>` | `200 OK` |
| `POST` | `/api/asignaciones` | `{ idDocente, idMateria, idCurso, rolDocente }` | `Asignacion` creada | `201 Created` |
| `DELETE` | `/api/asignaciones/{id}` | Parámetro de ruta `id` | `{ success: true }` | `200 OK` |

---

## 9. Módulo: Inscripciones a Cursos

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/inscripciones` | Query params: `?idCurso=&idAlumno=` | `Array<Inscripcion>` | `200 OK` |
| `POST` | `/api/inscripciones` | `{ idAlumno, idCurso, cicloLectivo }` | `Inscripcion` confirmada | `201 Created` |
| `DELETE` | `/api/inscripciones/{id}` | Parámetro de ruta `id` | `{ success: true }` (libera cupo) | `200 OK` |

---

## 10. Módulo: Mesas de Examen

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/mesas-examen` | Query params: `?idMateria=` | `Array<MesaExamen>` | `200 OK` |
| `POST` | `/api/mesas-examen` | `{ idMateria, fecha, hora, turno, aula, tribunal, cupoMaximo }` | `MesaExamen` creada | `201 Created` |
| `PUT` | `/api/mesas-examen/{id}` | `{ fecha, hora, turno, aula, tribunal, cupoMaximo, estadoMesa }` | `MesaExamen` actualizada | `200 OK` |
| `POST` | `/api/mesas-examen/{id}/inscripciones` | Ninguno (usuario autenticado) | `InscripcionMesa` | `201 Created` |
| `DELETE` | `/api/mesas-examen/{id}/inscripciones/{idInscripcion}` | Parámetros de ruta `id`, `idInscripcion` | `204 No Content` | `200 OK` |

---

## 11. Módulo: Evaluaciones y Calificaciones

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/evaluaciones` | Query params: `?idMateria=&idCurso=` | `Array<Evaluacion>` | `200 OK` |
| `POST` | `/api/evaluaciones` | `{ idMateria, idCurso, tipo, descripcion, fecha, ponderacion }` | `Evaluacion` creada | `201 Created` |
| `GET` | `/api/calificaciones` | Query params: `?idAlumno=&tipo=&idMateria=` | `Array<Calificacion>` | `200 OK` |
| `POST` | `/api/calificaciones` | `{ idAlumno, idMateria, evaluacionNombre, tipo, nota, observacion }` | `Calificacion` (nota de 1 a 10) | `200 OK` |
| `POST` | `/api/evaluaciones/{id}/calificaciones` | `Array<{ idAlumno, nota }>` (lote atómico) | `{ guardadas: number }` | `200 OK` |

---

## 12. Módulo: Asistencias

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/asistencias` | Query params: `?idCurso=&idMateria=&idAlumno=&fecha=` | `Array<Asistencia>` | `200 OK` |
| `POST` | `/api/asistencias/lote` | `Array<{ idAlumno, idCurso, idMateria, fecha, estado }>` | `Array<Asistencia>` | `200 OK` |

---

## 13. Módulo: Matrículas, Cuotas y Pagos

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/matriculas` | Query params: `?cicloLectivo=&estado=` | `Array<Matricula>` | `200 OK` |
| `PUT` | `/api/matriculas/{id}` | `{ estado, estadoPago }` | `Matricula` actualizada | `200 OK` |
| `PATCH` | `/api/matriculas/{id}` | `{ estado: 'CANCELADA' }` | `Matricula` cancelada | `200 OK` |
| `POST` | `/api/matriculas/{id}/cuotas` | Parámetro de ruta `id` | `Array<Cuota>` (12 cuotas + 3 seguros) | `201 Created` |
| `GET` | `/api/cuotas` | Query params: `?idAlumno=&estado=` | `Array<Cuota>` (mensuales y seguros) | `200 OK` |
| `GET` | `/api/pagos` | Query params: `?idAlumno=` | `Array<Pago>` | `200 OK` |
| `POST` | `/api/pagos` | `{ idCuota, importe, medioPago }` (RN09: sin pagos parciales) | `Pago` acreditado | `201 Created` |

---

## 14. Módulo: Solicitudes y Documentación

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/solicitudes` | Query params: `?idAlumno=&tipo=&estado=` | `Array<Solicitud>` | `200 OK` |
| `POST` | `/api/solicitudes` | `{ idAlumno, tipo, motivo, observaciones }` | `Solicitud` en estado `PENDIENTE` | `201 Created` |
| `PATCH` | `/api/solicitudes/{id}` | `{ estado: 'APROBADA' | 'RECHAZADA', observacion }` | `Solicitud` resuelta | `200 OK` |
| `GET` | `/api/documentacion` | Query params: `?idAlumno=` | `Array<Documento>` | `200 OK` |
| `PUT` | `/api/documentacion/{id}` | `{ estado, observaciones }` | `Documento` actualizado | `200 OK` |

---

## 15. Módulo: Usuarios y Roles

| Método | Endpoint URL | Datos que Envía | Datos que Espera | Código HTTP |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/usuarios` | Query params: `?rol=&estado=` | `Array<Usuario>` | `200 OK` |
| `POST` | `/api/usuarios` | `{ username, nombre, email, rol, estado }` | `Usuario` creado | `201 Created` |
| `PUT` | `/api/usuarios/{id}` | `{ nombre, email, rol, estado }` | `Usuario` modificado | `200 OK` |
| `DELETE` | `/api/usuarios/{id}` | Parámetro de ruta `id` | `{ success: true }` | `200 OK` |
