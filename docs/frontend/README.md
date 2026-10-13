# Documentación de Frontend - Academit

Portal web de autogestión y administración académica para el instituto educativo **Academit**, desarrollado como parte del Trabajo Práctico Integrador de Taller 3.

## 1. Stack Tecnológico

- **Entorno de ejecución y empaquetador:** Node.js (v24), [Vite 8](https://vite.dev/)
- **Librería de interfaz:** [React 19](https://react.dev/) (Componentes funcionales y Hooks)
- **Enrutamiento:** [React Router DOM 7](https://reactrouter.com/) (Enrutamiento dinámico centralizado por configuración)
- **Diseño y Maquetación:** [React-Bootstrap 2.10](https://react-bootstrap.netlify.app/) / Bootstrap 5.3
- **Iconografía:** [Bootstrap Icons 1.13](https://icons.getbootstrap.com/)
- **Cliente HTTP:** [Axios 1.13](https://axios-http.com/)
- **Linter de código:** [ESLint 9](https://eslint.org/)

---

## 2. Variables de Entorno

La aplicación cuenta con soporte para alternar entre una maqueta con datos simulados y una API REST real mediante la variable de entorno:

| Variable | Tipo | Valor Predeterminado | Descripción |
| :--- | :--- | :--- | :--- |
| `VITE_USE_MOCK` | Booleano (`true`/`false`) | `true` | Cuando es `true`, las peticiones a la capa `src/api/` se resuelven contra el banco de memoria local `src/api/mocks/data.js` con latencia simulada. Cuando es `false`, se despachan mediante Axios a la URL base `/api`. |

El archivo `.env.development` en la raíz de `frontend/` define:
```env
VITE_USE_MOCK=true
```

---

## 3. Scripts Disponibles de npm

Dentro de la carpeta `frontend/`:

- `npm run dev`: Inicia el servidor de desarrollo local con Hot Module Replacement (HMR) en `http://localhost:5173`.
- `npm run build`: Compila y empaqueta la aplicación para producción en la carpeta `dist/`.
- `npm run lint`: Ejecuta el análisis estático de ESLint sobre todos los archivos `.js` y `.jsx`.
- `npm run preview`: Previsualiza localmente el paquete generado en `dist/`.

---

## 4. Cómo Correr el Proyecto en Local

### Opción recomendada (con Nix Flakes / nix-shell)
Desde la raíz del repositorio de Academit:
```bash
nix-shell
cd frontend
npm install
npm run dev
```

### Usuarios y Credenciales de Prueba
Para iniciar sesión en modo maqueta, la contraseña universal de prueba es **`1234`**:

| Usuario | Contraseña | Rol Asignado | Alcance de Navegación |
| :--- | :--- | :--- | :--- |
| `admin` | `1234` | `ADMINISTRADOR` | Acceso integral a Gestión Académica, Administrativo, Sistema y portal general. |
| `administrativo` | `1234` | `ADMINISTRATIVO` | Gestión de matrículas, cuotas, cobros, alumnos, inscripciones y lectura en catálogo de carreras, docentes y planes. |
| `docente` | `1234` | `DOCENTE` | Gestión de cursos a cargo, registro de evaluaciones, carga de notas 1 a 10 y toma de lista de asistencias. |
| `alumno` | `1234` | `ALUMNO` | Consulta de situación académica/arancelaria, inscripción a mesas de examen, solicitudes y trámites personales. |

---

## 5. Índice de Documentación Detallada

1. [Estructura del Proyecto](estructura.md): Organización del árbol de directorios de `src/`, responsabilidades y convenciones de nomenclatura.
2. [Guía para Agregar una Pantalla](agregar-una-pantalla.md): Tutorial paso a paso para dar de alta una nueva vista, su ruta en `menu.js`, servicio API y datos mock.
3. [Capa API y Datos Mock](api-y-mocks.md): Explicación del funcionamiento de `VITE_USE_MOCK`, desacoplamiento, manejo de errores y pasaje a producción.
4. [Roles y Permisos](roles-y-permisos.md): Matriz de permisos, control de acceso en la interfaz y directrices de seguridad para el backend.
5. [Catálogo de Componentes Compartidos](componentes.md): Documentación de props, funcionamiento y ejemplos de uso de los componentes en `src/components/`.
6. [Contrato de API REST](contrato-api.md): Especificación exhaustiva de endpoints HTTP, métodos, parámetros y respuestas para el equipo de backend.
7. [Mapa de Pantallas y Requisitos](mapa-de-pantallas.md): Listado completo de rutas, grupos, roles y trazabilidad con los RF01 a RF57.
