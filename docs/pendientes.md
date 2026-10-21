# Lista de Tareas Pendientes del Proyecto - Academit

> Tildá la casilla al integrar el PR; la tabla de estado por módulo se actualiza en [docs/estado-del-proyecto.md](estado-del-proyecto.md). Detalle técnico en [docs/backend/guia-de-modulos.md](backend/guia-de-modulos.md).

## 1. Base de Datos
| [ ] | Tarea | Depende de | Dueño | Referencia |
| :---: | :--- | :--- | :--- | :--- |
| [ ] | Crear tablas `solicitud` y `documentacion` con claves foráneas e índices | Ninguna | | [desajustes-db.md](estado/desajustes-db.md) |
| [ ] | Incorporar `rol_docente` en `curso_materia`, `asistencia.id_materia` y `turno` en curso/mesa | Ninguna | | [desajustes-db.md](estado/desajustes-db.md) |
| [ ] | Cargar datos de prueba consistentes para nuevas tablas en `database/02-datos-iniciales.sql` | Tablas nuevas | | [02-datos-iniciales.sql](../database/02-datos-iniciales.sql) |

## 2. Backend
| [ ] | Tarea | Depende de | Dueño | Referencia |
| :---: | :--- | :--- | :--- | :--- |
| [ ] | Módulo Ciclos Lectivos (3 de 3 endpoints pendientes) | `auth`, `usuarios` | | [Ficha](backend/guia-de-modulos.md#54-módulo-ciclos-lectivos-ciclos-lectivos) |
| [ ] | Módulo Carreras (7 de 7 endpoints pendientes) | `auth`, `usuarios` | | [Ficha](backend/guia-de-modulos.md#53-módulo-carreras-carreras) |
| [ ] | Módulo Planes de Estudio (2 de 2 endpoints pendientes) | `carreras` | | [Ficha](backend/guia-de-modulos.md#56-módulo-planes-de-estudio-planes-estudio) |
| [ ] | Módulo Materias (3 de 3 endpoints pendientes) | `planes-estudio` | | [Ficha](backend/guia-de-modulos.md#55-módulo-materias-materias) |
| [ ] | Módulo Alumnos (7 de 7 endpoints pendientes) | `ciclos-lectivos`, `planes-estudio` | | [Ficha](backend/guia-de-modulos.md#57-módulo-alumnos-alumnos) |
| [ ] | Módulo Docentes (4 de 4 endpoints pendientes) | `auth`, `usuarios` | | [Ficha](backend/guia-de-modulos.md#58-módulo-docentes-docentes) |
| [ ] | Módulo Cursos (3 de 3 endpoints pendientes) | `ciclos-lectivos`, `carreras` | | [Ficha](backend/guia-de-modulos.md#510-módulo-cursos-comisiones-cursos) |
| [ ] | Módulo Asignaciones Docentes (3 de 3 endpoints pendientes) | `cursos`, `materias`, `docentes` | | [Ficha](backend/guia-de-modulos.md#59-módulo-asignaciones-docentes-asignaciones) |
| [ ] | Módulo Inscripciones a Cursos (3 de 3 endpoints pendientes) | `alumnos`, `cursos`, `ciclos-lectivos` | | [Ficha](backend/guia-de-modulos.md#511-módulo-inscripciones-a-cursos-inscripciones) |
| [ ] | Módulo Matrículas Anuales (4 de 4 endpoints pendientes) | `alumnos`, `ciclos-lectivos` | | [Ficha](backend/guia-de-modulos.md#513-módulo-matrículas-anuales-matriculas) |
| [ ] | Módulo Cuotas y Aranceles (2 de 2 endpoints pendientes) | `matriculas` | | [Ficha](backend/guia-de-modulos.md#512-módulo-cuotas-y-aranceles-cuotas) |
| [ ] | Módulo Pagos y Comprobantes (2 de 2 endpoints pendientes) | `matriculas`, `cuotas`, `alumnos` | | [Ficha](backend/guia-de-modulos.md#514-módulo-pagos-y-comprobantes-pagos) |
| [ ] | Módulo Evaluaciones (3 de 3 endpoints pendientes) | `cursos`, `materias`, `docentes` | | [Ficha](backend/guia-de-modulos.md#517-módulo-evaluaciones-evaluaciones) |
| [ ] | Módulo Calificaciones (2 de 2 endpoints pendientes) | `evaluaciones`, `alumnos`, `docentes` | | [Ficha](backend/guia-de-modulos.md#516-módulo-calificaciones-calificaciones) |
| [ ] | Módulo Asistencias (2 de 2 endpoints pendientes) | `cursos`, `materias`, `alumnos` | | [Ficha](backend/guia-de-modulos.md#515-módulo-asistencias-asistencias) |
| [ ] | Módulo Mesas de Examen (5 de 5 endpoints pendientes) | `materias`, `ciclos-lectivos`, `docentes` | | [Ficha](backend/guia-de-modulos.md#518-módulo-mesas-de-examen-mesas-examen) |
| [ ] | Módulo Declaraciones Juradas (2 de 2 endpoints pendientes) | `alumnos`, `ciclos-lectivos`, `materias` | | [Ficha](backend/guia-de-modulos.md#519-módulo-declaraciones-juradas-declaraciones-juradas) |
| [ ] | Módulo Documentación y Legajos (2 de 2 endpoints pendientes) | `alumnos` | | [Ficha](backend/guia-de-modulos.md#520-módulo-documentación-y-legajos-documentacion) |
| [ ] | Módulo Solicitudes y Trámites (3 de 3 endpoints pendientes) | `alumnos`, `usuarios` | | [Ficha](backend/guia-de-modulos.md#521-módulo-solicitudes-y-trámites-solicitudes) |
| [ ] | Tarea programada para marcar cuotas impagas como vencidas | `matriculas`, `cuotas` | | RN07, RF30 |
| [ ] | Verificar permisos por rol (`x-roles`) y tests Mockito/WebMvc en cada controller | Módulos respectivos | | [guia-de-modulos.md](backend/guia-de-modulos.md#3-plantilla-de-un-módulo-pasos-de-desarrollo) |

## 3. Integración con el Frontend
| [ ] | Tarea | Depende de | Dueño | Referencia |
| :---: | :--- | :--- | :--- | :--- |
| [ ] | Probar pantallas de grupo Inicio con `VITE_USE_MOCK=false` | `auth`, `usuarios` | | [menu.js](../frontend/src/config/menu.js) |
| [ ] | Probar pantallas de grupo Gestión Académica con API real | `alumnos`, `docentes`, `cursos` | | [menu.js](../frontend/src/config/menu.js) |
| [ ] | Probar pantallas de grupo Administrativo con API real | `matriculas`, `cuotas`, `pagos` | | [menu.js](../frontend/src/config/menu.js) |
| [ ] | Probar pantallas de grupo Docencia con API real | `evaluaciones`, `calificaciones`, `asistencias` | | [menu.js](../frontend/src/config/menu.js) |
| [ ] | Probar pantallas de grupo Académico (alumno) con API real | `mesas-examen`, `asistencias` | | [menu.js](../frontend/src/config/menu.js) |
| [ ] | Probar pantallas de grupo Solicitudes con API real | `solicitudes`, `declaraciones-juradas` | | [menu.js](../frontend/src/config/menu.js) |
| [ ] | Probar pantallas de grupo Otros y Perfil con API real | `auth`, `usuarios`, `documentacion` | | [menu.js](../frontend/src/config/menu.js) |
| [ ] | Comparar schemas de `openapi.yaml` con payloads implementados | Endpoints backend | | [openapi.yaml](frontend/openapi.yaml) |
| [ ] | Incorporar endpoints extra del backend al contrato (`/api/auth/me`, `/api/usuarios/me`) | Controllers implementados | | [contrato-api.md](frontend/contrato-api.md) |

## 4. Documentación de la Entrega
| [ ] | Tarea | Depende de | Dueño | Referencia |
| :---: | :--- | :--- | :--- | :--- |
| [ ] | Portada con integrantes, docente, ayudante, asignatura y fecha de entrega | Ninguna | | Portada formal |
| [ ] | Incorporar RF y RN de Solicitudes y Documentación en el análisis | Ninguna | | [entregable-1-analisis.md](entregables/entregable-1-analisis.md) |
| [ ] | Actualizar DER con `solicitud`, `documentacion`, `rol_docente` y `pago.comprobante` | Base de datos | | [der.md](entregables/entregable-2/der.md) |
| [ ] | Actualizar y renderizar diagramas UML (Clases, Secuencia de pagos, inscripciones y notas) | DER y servicios | | [entregables/README.md](entregables/README.md) |
| [ ] | Documentar modelo relacional y diccionario de datos completo | Base de datos | | [01-schema.sql](../database/01-schema.sql) |
| [ ] | Generar matriz de trazabilidad requisito, código y prueba a partir de git log y tests | Tests y commits | | [flujo-de-trabajo.md](flujo-de-trabajo.md) |
| [ ] | Elaborar manual breve de instalación y uso del sistema | Integración completa | | [README.md](../README.md) |
| [ ] | Revisar el enunciado y completar esta lista con requisitos no cubiertos | Ninguna | | Enunciado de cátedra |

## 5. Calidad y Cierre
| [ ] | Tarea | Depende de | Dueño | Referencia |
| :---: | :--- | :--- | :--- | :--- |
| [ ] | Completar README de raíz con guía de despliegue (`nix-shell`) y usuarios de prueba | Sistema integrado | | [README.md](../README.md) |
| [ ] | Revisión de código y aprobación de Pull Requests pendientes | Ramas de trabajo | | [flujo-de-trabajo.md](flujo-de-trabajo.md) |
| [ ] | Prueba integral punta a punta de la suite en rama `develop` | Merge de módulos | | [flujo-de-trabajo.md](flujo-de-trabajo.md) |
| [ ] | Pull Request de `develop` hacia `main` y creación del tag del entregable | Verificación en develop | | [flujo-de-trabajo.md](flujo-de-trabajo.md#31-cierre-de-un-entregable) |

## 6. Defensa
| [ ] | Tarea | Depende de | Dueño | Referencia |
| :---: | :--- | :--- | :--- | :--- |
| [ ] | Definir roles y reparto de temas de exposición entre integrantes | Integrantes | | Defensa oral |
| [ ] | Preparar guión y demo de navegación completa por rol (Admin, Administrativo, Docente, Alumno) | Sistema integrado | | [GUIA-PARA-BACKEND.md](frontend/GUIA-PARA-BACKEND.md) |
| [ ] | Elaborar banco de preguntas esperables sobre reglas de negocio y arquitectura en capas | Casos de uso | | [entregable-1-analisis.md](entregables/entregable-1-analisis.md) |
