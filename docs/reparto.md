# Reparto de Tareas Pendientes - Academit

> Rama `docs/reparto-tareas` desde `develop`. Cifras de [docs/estado-del-proyecto.md](estado-del-proyecto.md) (62 endpoints pendientes) y [docs/frontend/endpoints.csv](frontend/endpoints.csv). Fichas por módulo en [docs/backend/guia-de-modulos.md](backend/guia-de-modulos.md).

## 1. Reparto por Persona

| Persona | Bloque | Módulos (endpoints) | Total | Reglas pesadas | Ramas sugeridas | Olas |
| --- | --- | --- | :---: | --- | --- | :---: |
| Alfredo E. Zarate | Maestros académicos | ciclos-lectivos (3), carreras (7), planes-estudio (2), materias (3), cursos (3) | **18** | Ninguna (CRUD de maestros) | `feature/back-<modulo>` | 1 y 3 |
| Santiago | Personas e inscripciones | alumnos (7), docentes (4), asignaciones (3), inscripciones (3) | **17** | Insc. única por ciclo (RN02), cupo del curso (RN03) | `feature/back-<modulo>` | 2, 3 y 4 |
| Matias | Dinero y trámites | matriculas (4), cuotas (2), pagos (2), documentacion (2), solicitudes (3) + tarea cuotas vencidas | **13** + tarea | Generación de 12+3 cuotas (RN18), pago completo (RN09), cuotas vencidas (RN07), `estadoPago` y comprobante | `feature/back-<modulo>` | 5, 6 y 8 |
| Mateo | Académico | asistencias (2), evaluaciones (3), calificaciones (2), mesas-examen (5), declaraciones-juradas (2) | **14** | Notas 1-10 y aprobado ≥ 4 (RN14/RN21), carga solo por docente asignado (RN11/RN12) | `feature/back-<modulo>` | 7 y 8 |

Total pendiente: 62 endpoints + 1 tarea programada. Peso: 18 / 17 / 13 / 14, reparto parejo; cada módulo una rama propia.

## 2. Orden de Integración por Olas

| Ola | Quién | Módulos | Desbloquea a |
| :---: | --- | --- | --- |
| 1 | Alfredo | ciclos-lectivos, carreras, planes-estudio, materias | a Santiago (alumnos/docentes) y a Mateo (declaraciones) |
| 2 | Santiago | alumnos, docentes | a Matias (matrículas, pagos) y a Mateo (asistencias/calificaciones) |
| 3 | Alfredo + Santiago | cursos (Alfredo), asignaciones (Santiago) | Alfredo desbloquea a Santiago para inscripciones; Santiago desbloquea a Matias y a Mateo (ola 7) |
| 4 | Santiago | inscripciones | cierre del bloque "Personas" |
| 5 | Matias | matriculas, cuotas | — |
| 6 | Matias | pagos + tarea cuotas vencidas | — |
| 7 | Mateo | asistencias, evaluaciones, calificaciones, mesas-examen | — |
| 8 | Matias + Mateo | solicitudes, documentacion (Matias), declaraciones-juradas (Mateo) | cierre |

- Dependencia crítica: Santiago puede escribir `inscripciones` recién después del merge de `feature/back-cursos` de Alfredo (ola 3 → 4).
- Todo el resto avanza en paralelo desde el día 0: las tablas, dependencias y datos de prueba de `database/02-datos-iniciales.sql` ya están en `develop`, así que cada quien puede desarrollar su Service/Controller/tests contra sus entidades sin esperar al otro; solo el merge respeta las olas.

## 3. Tareas sin Código (repartidas)

| Tarea | Dueño | Criterio |
| --- | --- | --- |
| Portada institucional | Alfredo | rápida, cero dependencias |
| RF y RN de Solicitudes y Documentación (entregable 1) | Matias | dueño de esos módulos |
| DER actualizado | Santiago | luego arma los diagramas desde el DER |
| Diagramas UML (clases/secuencia) y renderizado | Santiago | continuidad con el DER |
| Modelo relacional | Mateo | afinidad con entidades que consume |
| Diccionario de datos | Mateo | junto al modelo relacional |
| Matriz de trazabilidad | Matias | dueño del módulo con más reglas (RN07/09/18) |
| Manual de instalación y uso | Alfredo | balancea su carga de 18 endpoints |
| Pruebas con `VITE_USE_MOCK=false` | Mateo | pantalla por pantalla, grupito por grupito |
| Revisión del enunciado y cobertura | Todos | cruz antes de la entrega |
| Defensa (roles, guión y demo, banco de preguntas) | Todos | un tema por integrante |

Criterio general: repartidas por afinidad con el bloque propio para no duplicar aprendizaje, compensando peso (quien lleva más endpoints lleva menos doc y viceversa).

## 4. Línea Copiable por Persona

- **Alfredo:** `Implementá los módulos ciclos-lectivos, carreras, planes-estudio, materias y cursos siguiendo docs/backend/guia-de-modulos.md, un módulo por rama feature/back-<modulo>, en este orden: ciclos-lectivos, carreras, planes-estudio, materias, cursos. Sin push ni merge.`
- **Santiago:** `Implementá los módulos alumnos, docentes, asignaciones e inscripciones siguiendo docs/backend/guia-de-modulos.md, un módulo por rama feature/back-<modulo>, en este orden: alumnos, docentes, asignaciones, inscripciones. Sin push ni merge.`
- **Matias:** `Implementá los módulos matriculas, cuotas, pagos y solicitudes siguiendo docs/backend/guia-de-modulos.md, un módulo por rama feature/back-<modulo>, en este orden: matriculas, cuotas, pagos, cuotas-vencidas (tarea), documentacion, solicitudes. Sin push ni merge.`
- **Mateo:** `Implementá los módulos asistencias, evaluaciones, calificaciones, mesas-examen y declaraciones-juradas siguiendo docs/backend/guia-de-modulos.md, un módulo por rama feature/back-<modulo>, en este orden: asistencias, evaluaciones, calificaciones, mesas-examen, declaraciones-juradas. Sin push ni merge.`

## 5. Reglas de Convivencia

- Avisar antes de tocar archivos compartidos: `database/01-schema.sql`, `build.gradle`, `application.properties`, `SecurityConfig` y `GlobalExceptionHandler`.
- PR chicos: un PR por módulo (nunca varios módulos juntos), con `git add` de archivos concretos.
- Un integrante revisa el PR de otro, en rotación: Alfredo↔Santiago y Matias↔Mateo, alternando por ola.
- Al integrar un PR, actualizar la fila del módulo en [docs/estado-del-proyecto.md](estado-del-proyecto.md) y tildar la tarea en [docs/pendientes.md](pendientes.md).
- Traer `develop` actualizado a la rama propia antes de abrir el PR para evitar conflictos.
