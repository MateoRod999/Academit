# Guía de Integración Frontend - Backend

Documento técnico de referencia para el equipo de backend de **Academit**. Detalla cómo interactuar con la maqueta, convenciones de comunicación, contratos de datos y reglas de negocio para conectar la API REST real.

---

## 1. Puesta en Marcha de la Maqueta y Usuarios de Prueba

Para ejecutar el frontend en entorno local:
```bash
cd frontend && npm install && npm run dev # Disponible en http://localhost:5173
```
La maqueta opera con datos en memoria (`src/api/mocks/data.js`). Contraseña universal de prueba: **`1234`**.

| Usuario | Contraseña | Rol | Alcance en la Maqueta |
| :--- | :--- | :--- | :--- |
| `admin` | `1234` | `ADMINISTRADOR` | Acceso total a configuración, catálogos, finanzas y sistema. |
| `administrativo` | `1234` | `ADMINISTRATIVO` | Gestión de matrículas, cobro de cuotas, alumnos e inscripciones. |
| `docente` | `1234` | `DOCENTE` | Cursos asignados, toma de asistencias y registro de evaluaciones. |
| `alumno` | `1234` | `ALUMNO` | Consulta de situación académica/arancelaria, trámites y mesas. |

---

## 2. Conexión con la API Real (Backend)

1. **Modo Real:** En `frontend/.env.development` cambiar a `VITE_USE_MOCK=false`.
2. **Proxy de Desarrollo:** Vite redirige automáticamente todas las peticiones a `/api/*` hacia `http://localhost:8080/api/*` (`frontend/vite.config.js`). El backend Spring Boot debe correr en el puerto 8080.
3. **Orden sugerido de conexión por fases:**
   - **Fase 1 (Auth):** `Login.jsx` (`POST /api/auth/login`, `POST /api/auth/logout`).
   - **Fase 2 (Catálogos y Usuarios):** Carreras, Planes de Estudio, Materias, Ciclos Lectivos, Usuarios, Docentes y Alumnos.
   - **Fase 3 (Gestión Académica):** Cursos, Asignaciones docentes, Inscripciones y Mesas de Examen.
   - **Fase 4 (Cursada):** Evaluaciones, Calificaciones y Asistencias de cursos.
   - **Fase 5 (Gestión Arancelaria):** Matrículas, Emisión de Cuotas, Cobro de Pagos y Consulta de Deudas.
   - **Fase 6 (Autogestión de Alumnos):** Solicitudes académicas, Trámites, DDJJ y Situación integral.

---

## 3. Mapa de Documentos del Contrato

Ubicados en `docs/frontend/`:
- `endpoints.csv`: Catálogo tabular de 71 endpoints con método HTTP, ruta, roles autorizados, pantallas y estado.
- `entidades.json`: Definición de 22 entidades separando estrictamente `camposPersistidos` de `camposCalculados`, tipos, enums y relaciones.
- `entidades-y-endpoints.md`: Tablas de especificación de entidades y endpoints con notas de dominio para backend.
- `openapi.yaml`: Especificación OpenAPI 3.0 estándar sin ejemplos, para generar interfaces y validar endpoints (`redocly lint`).

---

## 4. Convenciones de Comunicación y API

- **Formato de Errores:** Respuestas 4xx y 5xx deben devolver JSON con estructura:
  `{ "status": 400, "message": "Mensaje legible", "errors": ["Detalle 1", "Detalle 2"] }`
- **Fechas:** Formato estándar ISO `YYYY-MM-DD` (ej. `2026-03-15`).
- **Identificadores e Importes:** IDs numéricos enteros (`idAlumno`, `idCuota`) e importes en números con decimales (`monto`, `saldo`). No usar strings.
- **Listados sin paginación:** La API debe retornar colecciones completas (`Array` JSON directo); filtrado y ordenamiento se resuelven en cliente.
- **Flujo de Autenticación:**
  - `POST /api/auth/login`: Recibe `{ username, password }`. Responde `{ usuario: { idUsuario, username, nombre, rol }, token }` (token opcional si usa cookies).
  - `POST /api/auth/logout`: Invalida la sesión activa en el servidor.
  - **Aislamiento de Sesión:** Centralizado exclusivamente en `frontend/src/context/AuthContext.jsx`. Ningún componente maneja almacenamiento de sesión fuera de este archivo.

---

## 5. Reglas de Negocio a Implementar en Backend

1. **Cupo del Curso:** Rechazar inscripciones si `inscriptos >= cupo` asignado al curso.
2. **Pago Completo de Cuota:** El registro de pago debe cancelar el monto total de la cuota (no admite pagos parciales).
3. **Escala de Calificaciones:** Valores enteros de 1 a 10. Aprobación con nota mayor o igual a 4.
4. **Esquema de Cuotas:** Cada ciclo lectivo contempla 12 cuotas mensuales regulares más 3 seguros cuatrimestrales.
5. **Inscripción Única:** Máximo una inscripción activa por alumno por ciclo lectivo.
6. **Permisos de Carga Docente:** Solo el docente formalmente asignado al curso puede asentar calificaciones y asistencias.

---

## 6. Seguridad y Autorización

- El frontend únicamente oculta botones y opciones de navegación en el menú según el rol activo del usuario.
- El backend debe validar autenticación y autorización en cada petición: `401 Unauthorized` si no hay sesión válida y `403 Forbidden` si el rol no tiene permisos para el endpoint.

---

## 7. Checklist de Conexión por Pantalla

Tabla generada a partir de `endpoints.csv` para auditar la integración:

| Pantalla | Endpoints Asociados | Estado |
| :--- | :--- | :---: |
| `AdminCuotasPage.jsx` | `GET /api/cuotas`, `PATCH /api/cuotas/{id}/anular` | Maqueta |
| `AdminDeudasPage.jsx` | `GET /api/alumnos`, `GET /api/cuotas` | Maqueta |
| `AdminMatriculasPage.jsx` | `GET /api/matriculas`, `PUT /api/matriculas/{id}`, `POST /api/matriculas/{id}/cuotas` | Maqueta |
| `AdminPagosPage.jsx` | `GET /api/alumnos`, `GET /api/cuotas`, `GET /api/pagos`, `POST /api/pagos` | Maqueta |
| `AdminSituacionAlumnoPage.jsx` | `GET /api/alumnos`, `GET /api/alumnos/{id}/situacion-administrativa` | Maqueta |
| `AsistenciasAlumnoPage.jsx` | `GET /api/asistencias` | Maqueta |
| `AsistenciasDocentePage.jsx` | `GET /api/alumnos`, `GET /api/materias`, `GET /api/cursos`, `GET /api/asistencias`, `POST /api/asistencias/lote` | Maqueta |
| `BandejaSolicitudesPage.jsx` | `GET /api/solicitudes`, `PATCH /api/solicitudes/{id}` | Maqueta |
| `CalificacionesAlumnoPage.jsx` | `GET /api/calificaciones` | Maqueta |
| `CalificacionesDocentePage.jsx` | `GET /api/alumnos`, `GET /api/materias`, `GET /api/cursos`, `GET /api/evaluaciones`, `POST /api/evaluaciones/{idEvaluacion}/calificaciones`, `GET /api/calificaciones`, `POST /api/calificaciones` | Maqueta |
| `CambiarPasswordPage.jsx` | `POST /api/auth/cambiar-password` | Maqueta |
| `CambioCarreraPage.jsx` | `GET /api/solicitudes`, `POST /api/solicitudes` | Maqueta |
| `CancelarMatriculaPage.jsx` | `GET /api/matriculas`, `PATCH /api/matriculas/{id}` | Maqueta |
| `ConstanciasPage.jsx` | `GET /api/solicitudes`, `POST /api/solicitudes` | Maqueta |
| `DeclaracionJuradaPage.jsx` | `GET /api/materias`, `GET /api/declaraciones-juradas`, `POST /api/declaraciones-juradas` | Maqueta |
| `DocumentacionPage.jsx` | `GET /api/documentacion`, `PUT /api/documentacion/{id}` | Maqueta |
| `EvaluacionesDocentePage.jsx` | `GET /api/materias`, `GET /api/cursos`, `GET /api/evaluaciones`, `POST /api/evaluaciones` | Maqueta |
| `GestionAlumnosPage.jsx` | `GET /api/alumnos`, `GET /api/alumnos/{id}`, `POST /api/alumnos`, `PUT /api/alumnos/{id}`, `DELETE /api/alumnos/{id}`, `GET /api/carreras`, `GET /api/planes-estudio` | Maqueta |
| `GestionAsignacionesPage.jsx` | `GET /api/docentes`, `GET /api/materias`, `GET /api/cursos`, `GET /api/asignaciones`, `POST /api/asignaciones`, `DELETE /api/asignaciones/{id}` | Maqueta |
| `GestionCarrerasPage.jsx` | `GET /api/carreras`, `GET /api/carreras/{id}`, `POST /api/carreras`, `PUT /api/carreras/{id}`, `DELETE /api/carreras/{id}`, `GET /api/carreras/{id}/planes`, `GET /api/carreras/{id}/cursos` | Maqueta |
| `GestionCiclosLectivosPage.jsx` | `GET /api/ciclos-lectivos`, `POST /api/ciclos-lectivos`, `PUT /api/ciclos-lectivos/{id}` | Maqueta |
| `GestionCursosPage.jsx` | `GET /api/carreras`, `GET /api/cursos`, `POST /api/cursos`, `PUT /api/cursos/{id}` | Maqueta |
| `GestionDocentesPage.jsx` | `GET /api/docentes`, `POST /api/docentes`, `PUT /api/docentes/{id}`, `DELETE /api/docentes/{id}` | Maqueta |
| `GestionInscripcionesPage.jsx` | `GET /api/alumnos`, `GET /api/cursos`, `GET /api/ciclos-lectivos`, `GET /api/inscripciones`, `POST /api/inscripciones`, `DELETE /api/inscripciones/{id}` | Maqueta |
| `GestionMateriasPage.jsx` | `GET /api/materias`, `POST /api/materias`, `PUT /api/materias/{id}` | Maqueta |
| `GestionMesasPage.jsx` | `GET /api/materias`, `GET /api/mesas-examen`, `POST /api/mesas-examen`, `PUT /api/mesas-examen/{id}` | Maqueta |
| `GestionPlanEstudiosPage.jsx` | `GET /api/carreras`, `GET /api/planes-estudio`, `GET /api/planes-estudio/{id}/materias`, `GET /api/materias`, `PUT /api/materias/{id}` | Maqueta |
| `GestionUsuariosPage.jsx` | `GET /api/usuarios`, `POST /api/usuarios`, `PUT /api/usuarios/{id}`, `DELETE /api/usuarios/{id}` | Maqueta |
| `InicioPage.jsx` | `GET /api/alumnos`, `GET /api/solicitudes` | Maqueta |
| `InscripcionMesasPage.jsx` | `GET /api/mesas-examen`, `POST /api/mesas-examen/{id}/inscripciones`, `DELETE /api/mesas-examen/{id}/inscripciones/{idInscripcion}` | Maqueta |
| `Login.jsx` | `POST /api/auth/login` | Maqueta |
| `MesasExamenPage.jsx` | `GET /api/mesas-examen` | Maqueta |
| `MisCursosPage.jsx` | `GET /api/cursos` | Maqueta |
| `MisDatosPage.jsx` | `GET /api/usuarios/me`, `PUT /api/usuarios/me` | Maqueta |
| `PasantiasPage.jsx` | `GET /api/solicitudes`, `POST /api/solicitudes` | Maqueta |
| `PlanEstudiosAlumnoPage.jsx` | `GET /api/planes-estudio/{id}/materias`, `GET /api/materias` | Maqueta |
| `ReincorporacionPage.jsx` | `GET /api/solicitudes`, `POST /api/solicitudes` | Maqueta |
| `SituacionAcademicaArancelariaPage.jsx` | `GET /api/alumnos/{id}/situacion-academica`, `GET /api/alumnos/{id}/situacion-administrativa`, `GET /api/cuotas`, `GET /api/pagos`, `GET /api/calificaciones` | Maqueta |
| `SolicitudTituloPage.jsx` | `GET /api/solicitudes`, `POST /api/solicitudes` | Maqueta |
| `SolicitudesAcademicasPage.jsx` | `GET /api/solicitudes`, `POST /api/solicitudes` | Maqueta |
| `Topbar.jsx` | `POST /api/auth/logout` | Maqueta |

---

## 8. Preguntas Abiertas y Definiciones Pendientes

1. **`Matricula.estadoPago`:** Campo actualmente estático en mocks (`AL_DIA`, `CON_DEUDA`, `EXENTO`). Pendiente de definir cómo el backend recalcula este estado según cuotas vencidas e impagas.
2. **Estrategia de Sesión (Cookie vs Token):** Definir si se usará Bearer Token JWT en cabecera `Authorization` o cookies de sesión HttpOnly gestionadas por el navegador.
3. **Paginación en Endpoints Masivos:** Evaluar si `/api/alumnos`, `/api/pagos` y `/api/cuotas` mantendrán colecciones completas o requerirán parámetros `page` y `size`.
4. **Numeración de Comprobantes:** Confirmar si el número de comprobante (`REC-YYYY-XXXX`) se genera de forma secuencial en base de datos al confirmar el pago.
5. **Políticas de Baja:** Determinar si los endpoints `DELETE` ejecutan baja lógica (`activo = false`) o eliminación física.
