# Academit - Sistema Web de Gestión de Instituto Educativo

TP Integrador - Taller de Lenguajes de Programación III (Taller 3).

**Academit** es una plataforma web integral para la administración académica, operativa y arancelaria de un instituto educativo de nivel superior. Permite gestionar alumnos, docentes, carreras, planes de estudio, cursos, inscripciones, evaluaciones, asistencias, cobro de cuotas y emisión de constancias mediante perfiles diferenciados según el rol del usuario.

---

## Stack Tecnológico

- **Base de Datos**: PostgreSQL 16
- **Backend**: Java 21, Spring Boot 3, Gradle
- **Frontend**: React 18, Vite, JavaScript, react-bootstrap, react-router-dom, axios, bootstrap-icons
- **Entorno de Desarrollo Reproducible**: Nix (`shell.nix`)

---

## Estructura del Repositorio

```text
Academit/
├── backend/            # API REST desarrollada en Spring Boot + Gradle
├── frontend/           # Aplicación cliente SPA en React + Vite
├── database/           # Scripts SQL (01-schema.sql, 02-datos-iniciales.sql)
├── docs/               # Documentación general, entregables y frontend
│   ├── README.md       # Índice central de documentación
│   ├── flujo-de-trabajo.md # Reglas de Git, ramas y commits
│   ├── entregables/    # Entregables 1 (análisis) y 2 (modelos UML y DER)
│   ├── estado/         # Diagnósticos y desajustes de base de datos
│   └── frontend/       # Documentación técnica y contratos del frontend
├── .github/            # Plantillas de GitHub (pull_request_template.md)
├── .editorconfig       # Configuración estándar de formato de código
├── .gitignore          # Reglas de exclusión de Git
├── shell.nix           # Entorno de desarrollo reproducible Nix
└── README.md           # Descripción general del proyecto
```

---

## Cómo arrancar el proyecto paso a paso

### 1. Ingresar al entorno reproducible
Desde la raíz del repositorio, ejecutá:
```bash
nix-shell
```
Este comando cargará automáticamente OpenJDK 21, Gradle, Node.js 24, npm y las herramientas de PostgreSQL cliente y servidor local.

### 2. Inicializar la base de datos PostgreSQL
Dentro de la consola de `nix-shell`:
```bash
db-init
```
Este comando inicializa el cluster local en `.pgdata/`, arranca el servicio PostgreSQL y crea la base de datos `academit` ejecutando los scripts de `database/`.

*Comandos útiles de base de datos (dentro de nix-shell):*
- `db-start`: Inicia el servicio PostgreSQL.
- `db-stop`: Detiene el servicio PostgreSQL.
- `db-psql`: Abre la consola interactiva `psql` conectada a `academit`.
- `db-reset`: Restablece el esquema y los datos iniciales desde cero.

### 3. Ejecutar el Backend (Spring Boot)
En una terminal:
```bash
cd backend
./gradlew bootRun
```
El servidor backend se ejecutará en `http://localhost:8080`.

### 4. Ejecutar el Frontend (React + Vite)
En otra terminal (o pestaña dentro de `nix-shell`):
```bash
cd frontend
npm install
npm run dev
```
La aplicación web estará disponible en `http://localhost:5173`.

---

## Documentación

- [Índice General de Documentación](docs/README.md)
- [Flujo de Trabajo del Equipo (Git, Ramas y Commits)](docs/flujo-de-trabajo.md)
