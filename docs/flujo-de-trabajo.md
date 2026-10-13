# Flujo de trabajo del equipo - Academit

Este documento define cómo trabajamos con Git en el proyecto: qué ramas usamos, cómo nombramos los commits y cómo integramos el trabajo de todos. Lo seguimos todos los integrantes, sin excepciones, para que el historial sea claro y no se pisen los cambios.

## 1. Ramas

### 1.1 Ramas principales

| Rama | Para qué sirve | Quién escribe en ella |
| --- | --- | --- |
| `main` | Versión estable. Solo contiene lo que se entrega. | Nadie directamente. Solo recibe merges de `develop` al cerrar un entregable. |
| `develop` | Rama de integración. Acá se junta el trabajo de todos. | Nadie directamente. Solo recibe merges mediante Pull Request. |

Regla de oro: **nunca se hace commit ni push directo a `main` ni a `develop`.** Todo cambio entra por una rama de trabajo y un Pull Request.

### 1.2 Ramas de trabajo

Siempre se crean a partir de `develop` (salvo `hotfix`, que sale de `main`).

| Prefijo | Para qué se usa | Ejemplo |
| --- | --- | --- |
| `feature/` | Algo nuevo que se agrega: una pantalla, un endpoint, una tabla. | `feature/back-crud-alumnos` |
| `bugfix/` | Reparar un error encontrado durante el desarrollo. | `bugfix/front-validacion-email` |
| `hotfix/` | Reparar un error urgente que ya está en `main`. | `hotfix/back-login-roles` |
| `docs/` | Cambios solo de documentación o diagramas. | `docs/diagrama-secuencia-pago` |
| `refactor/` | Reorganizar código sin cambiar lo que hace. | `refactor/back-capa-service` |
| `test/` | Agregar o corregir pruebas. | `test/back-reglas-inscripcion` |
| `chore/` | Tareas de mantenimiento: dependencias, configuración, entorno. | `chore/shell-nix-postgres` |

### 1.3 Cómo se nombran

Formato: `prefijo/area-descripcion-corta`

- **Área:** `front`, `back`, `db` o `docs`.
- Todo en minúsculas, palabras separadas con guiones, sin tildes ni espacios.
- Descripción corta y concreta: qué hace la rama, no quién la hace.
- Una rama, un objetivo. Si hay dos cosas distintas, son dos ramas.

Bien: `feature/back-registrar-pago`, `bugfix/db-restriccion-cuota`
Mal: `mi-rama`, `cambios`, `Feature/Pago nuevo`, `feature/todo-el-backend`

## 2. Commits

### 2.1 Formato

```
tipo(alcance): descripción corta en imperativo

Cuerpo opcional: qué se hizo y por qué.

Refs: RF32, RN09
```

**Tipos permitidos**

| Tipo | Cuándo se usa |
| --- | --- |
| `feat` | Se agrega una funcionalidad nueva. |
| `fix` | Se repara un error. |
| `docs` | Cambios solo en documentación. |
| `style` | Formato, espacios o punto y coma, sin cambiar la lógica. |
| `refactor` | Se reorganiza el código sin cambiar su comportamiento. |
| `test` | Se agregan o corrigen pruebas. |
| `chore` | Mantenimiento: dependencias, configuración, scripts. |

**Alcances (entre paréntesis):** `front`, `back`, `db`, `docs` o `config`. También se puede usar el nombre del módulo cuando ayuda: `feat(back-pagos): ...`.

### 2.2 Reglas

1. **Primera línea de hasta 72 caracteres**, sin punto final.
2. **En imperativo y en español:** "agrega", "corrige", "valida". No "agregué" ni "agregando".
3. **Un commit, un cambio lógico.** Si el commit necesita la palabra "y" para explicarse, probablemente son dos commits.
4. **Commits chicos y frecuentes.** Es mejor diez commits claros que uno gigante al final del día.
5. **El cuerpo explica el porqué**, no repite el código. Es opcional para cambios chicos.
6. **Se referencia el requisito o la regla** (`RF32`, `RN09`) cuando el commit lo implementa. Así se ve la relación entre requisito, código y prueba, que es lo que pide el enunciado.
7. **Nunca se commitea** código que no compila, contraseñas, archivos `.env`, `.pgdata/`, `node_modules/`, `build/` ni el `.zip` de Spring.

### 2.3 Ejemplos

Buenos:

```
feat(back): agrega endpoint para registrar pagos
fix(front): corrige validación del email en el formulario de alumnos
feat(db): crea tablas cuota y pago con sus restricciones
docs: agrega diagrama de secuencia de la inscripción
refactor(back): mueve la validación de cupo al InscripcionService
test(back): prueba que no se inscriba a un curso sin cupo
chore: actualiza el shell.nix para usar PostgreSQL
```

Con cuerpo y referencia:

```
feat(back): valida que el pago sea por el importe completo de la cuota

Los pagos parciales no están permitidos. Si el importe no coincide con
el de la cuota, el servicio lanza ImporteInvalidoException y el
controller responde 400.

Refs: RF32, RN09
```

Malos (y por qué):

```
cambios                      -> no dice qué cambió
arreglé el bug               -> no dice cuál, y está en pasado
feat: pagos y alumnos y login -> son tres cambios distintos
WIP                          -> no describe nada
```

## 3. Flujo de trabajo paso a paso

1. **Actualizá `develop`:**
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. **Creá tu rama** a partir de `develop`:
   ```bash
   git checkout -b feature/back-registrar-pago
   ```
3. **Trabajá y commiteá** seguido, siguiendo las reglas de la sección 2:
   ```bash
   git add <archivos>
   git commit -m "feat(back): agrega endpoint para registrar pagos"
   ```
   Preferí `git add` con los archivos concretos antes que `git add .`, para no subir cosas por accidente. Revisá siempre con `git status`.
4. **Subí tu rama** (hacelo al menos al terminar el día, para no perder trabajo):
   ```bash
   git push -u origin feature/back-registrar-pago
   ```
5. **Antes de abrir el Pull Request, traé lo último de `develop`** y resolvé los conflictos en tu rama, no en `develop`:
   ```bash
   git fetch origin
   git merge origin/develop
   ```
   Probá que todo siga funcionando después del merge.
6. **Abrí un Pull Request** hacia `develop` en GitHub (ver sección 4).
7. **Otro integrante lo revisa.** Si pide cambios, los hacés en la misma rama y volvés a hacer push; el Pull Request se actualiza solo.
8. **Con la aprobación, se hace el merge** y se borra la rama de trabajo.
9. **Volvé a empezar** desde el paso 1 para la siguiente tarea.

### 3.1 Cierre de un entregable

Cuando el grupo decide que `develop` está listo para entregar:

1. Se prueba todo en `develop` entre todos.
2. Se abre un Pull Request de `develop` hacia `main`.
3. Tras el merge, se marca la versión con una etiqueta:
   ```bash
   git checkout main
   git pull origin main
   git tag entregable-2
   git push origin entregable-2
   ```

### 3.2 Errores urgentes en `main`

Si hay un error grave en lo ya entregado: se crea `hotfix/...` desde `main`, se repara, se hace Pull Request hacia `main` y **después se integra también en `develop`** para que no se pierda la corrección.

## 4. Pull Requests

**Título:** con el mismo formato que un commit. Ejemplo: `feat(back): registrar pago de una cuota`.

**Descripción**, con estas tres partes:

```
## Qué hace
Explicación breve del cambio.

## Requisitos relacionados
RF32, RN08, RN09

## Cómo se probó
Pasos o casos probados. Si es de frontend, adjuntar una captura.
```

**Lista de control antes de pedir revisión:**

- [ ] El proyecto compila (`./gradlew build` en `backend/`, `npm run build` en `frontend/`).
- [ ] Pasa el lint del frontend (`npm run lint`).
- [ ] Probé manualmente lo que cambié.
- [ ] Si cambié entidades o tablas, actualicé `database/01-schema.sql`.
- [ ] No subir secreto / contraseñas, `.env`, ni archivos generados.
- [ ] Los nombres de ramas y commits siguen este documento.

**Revisión:**

- Cada Pull Request necesita al menos **una aprobación de otro integrante**. Nadie aprueba su propio Pull Request.
- Quien revisa mira que se entienda el código, que cumpla el requisito y que respete las capas del backend (Controller, Service, Repository).
- Los comentarios se hacen con respeto y sobre el código, no sobre la persona.
- Forma de merge: **"Create a merge commit"**, para conservar los commits individuales con sus mensajes.

## 5. Convenciones generales

- **Un integrante, una configuración propia de Git.** Cada uno configura su nombre y email reales en el repo:
  ```bash
  git config user.name "Nombre Apellido"
  git config user.email "email@ejemplo.com"
  ```
  Así el historial muestra quién hizo cada cosa.
- **Avisar antes de tocar archivos compartidos** (`shell.nix`, `build.gradle`, `application.properties`, `database/01-schema.sql`, `package.json`). Son los que más conflictos generan.
- **No reescribir el historial compartido:** nada de `git push --force` en `main`, `develop` ni en ramas que otro esté usando.
- **Si hay un conflicto que no entendés, preguntá** antes de resolverlo a ciegas.
- **Todos deben entender el flujo.** En la defensa se puede preguntar por las decisiones del equipo, y este documento es parte de ellas.

## 6. Resumen rápido

```
develop ──► feature/back-xxx ──► commits (feat/fix/...) ──► Pull Request ──► revisión ──► develop
develop ──► main  (solo al cerrar un entregable, con tag)
```

| Quiero... | Rama | Ejemplo de commit |
| --- | --- | --- |
| Agregar algo nuevo | `feature/...` | `feat(front): agrega pantalla de cuotas` |
| Reparar un error | `bugfix/...` | `fix(back): corrige el cálculo de la deuda` |
| Reparar algo urgente en `main` | `hotfix/...` | `fix(back): corrige el login de docentes` |
| Documentar | `docs/...` | `docs: agrega el diccionario de datos` |
