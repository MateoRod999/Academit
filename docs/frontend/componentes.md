# Catálogo de Componentes Compartidos - Academit

La carpeta `src/components/` contiene componentes funcionales reutilizables que estandarizan el diseño visual, la interacción y el flujo de trabajo en todas las páginas del sistema.

---

## 1. `PageHeader`

Encabezado estándar presente al inicio de cada pantalla. Muestra el título principal, subtítulo explicativo, ícono institucional y un área reservada para botones de acción.

### Props
| Prop | Tipo | Requerido | Descripción |
| :--- | :--- | :---: | :--- |
| `title` | `string` | Sí | Título de la pantalla. |
| `subtitle` | `string` | No | Descripción del propósito de la vista. |
| `icon` | `string` | No | Clase de Bootstrap Icons (ej. `'bi-people'`). |
| `actions` | `ReactNode` | No | Botones de acción principales (ej. "Nuevo Alumno"). |

### Ejemplo de Uso
```jsx
<PageHeader
  title="Gestión de Alumnos"
  subtitle="Listado general y administración del legajo estudiantil"
  icon="bi-people"
  actions={
    <Button variant="primary" size="sm" onClick={handleNuevo}>
      <i className="bi bi-plus-lg me-1" /> Nuevo Alumno
    </Button>
  }
/>
```

---

## 2. `DataTable`

Tabla interactiva que incluye barra de búsqueda reactiva en vivo, selector de registros por página, paginación simple y mensaje visual cuando no hay resultados coincidentes.

### Props
| Prop | Tipo | Requerido | Descripción |
| :--- | :--- | :---: | :--- |
| `columns` | `Array<Object>` | Sí | Definición de columnas (`key`, `label`, `width`, `align`, `render`). |
| `data` | `Array<Object>` | Sí | Colección de objetos a listar. |
| `keyField` | `string` | No | Campo identificador único de cada fila (default: `'id'`). |
| `searchPlaceholder` | `string` | No | Texto de ayuda en el campo de búsqueda. |
| `searchKeys` | `Array<string>` | No | Campos del objeto sobre los cuales filtrar el texto. |
| `initialPageSize` | `number` | No | Cantidad de registros por página (default: `10`). |

### Ejemplo de Uso
```jsx
const columns = [
  { key: 'legajo', label: 'Legajo', width: '120px' },
  { key: 'nombre', label: 'Estudiante', render: (row) => <strong>{row.apellido}, {row.nombre}</strong> },
  { key: 'estado', label: 'Estado', render: (row) => <StatusBadge status={row.estado} /> },
]

<DataTable
  columns={columns}
  data={alumnos}
  keyField="idAlumno"
  searchPlaceholder="Buscar por nombre, legajo o DNI..."
  searchKeys={['nombre', 'apellido', 'legajo', 'dni']}
/>
```

---

## 3. `StatusBadge`

Insignia de estado con colores predefinidos según el estado de matrículas, cuotas, asistencias o trámites.

### Props
| Prop | Tipo | Requerido | Descripción |
| :--- | :--- | :---: | :--- |
| `status` | `string` | Sí | Texto del estado (ej. `'ACTIVA'`, `'PAGADA'`, `'VENCIDA'`, `'PRESENTE'`). |

### Colores Asignados
- **Verde (`success`):** `ACTIVA`, `ACTIVO`, `PAGADA`, `CONFIRMADA`, `APROBADA`, `PRESENTE`, `VIGENTE`.
- **Amarillo (`warning`):** `PENDIENTE`, `REGULAR`, `EN_PROCESO`, `TARDANZA`.
- **Rojo (`danger`):** `CANCELADA`, `INACTIVO`, `VENCIDA`, `RECHAZADA`, `AUSENTE`.
- **Azul (`info`):** `JUSTIFICADO`, `ACREDITADO`.

### Ejemplo de Uso
```jsx
<StatusBadge status="ACTIVA" />
<StatusBadge status="VENCIDA" />
```

---

## 4. `FormModal`

Modal envolvente para formularios de alta y modificación con manejo de estado de envío (`loading`).

### Props
| Prop | Tipo | Requerido | Descripción |
| :--- | :--- | :---: | :--- |
| `show` | `boolean` | Sí | Visibilidad del diálogo modal. |
| `onHide` | `function` | Sí | Callback ejecutado al cerrar el modal. |
| `onSubmit` | `function` | Sí | Callback de envío del formulario (`event.preventDefault()`). |
| `title` | `string` | Sí | Título del diálogo. |
| `submitText` | `string` | No | Texto del botón de confirmación (default: `'Guardar'`). |
| `loading` | `boolean` | No | Deshabilita los botones y muestra un spinner mientras se procesa. |
| `size` | `string` | No | Tamaño del modal (`'sm'`, `'lg'`, `'xl'`). |
| `children` | `ReactNode` | Sí | Campos del formulario (`Form.Group`, `Row`, `Col`). |

### Ejemplo de Uso
```jsx
<FormModal
  show={showModal}
  onHide={() => setShowModal(false)}
  onSubmit={handleSubmit}
  title="Registrar Alumno"
  submitText="Guardar Alumno"
  loading={loading}
>
  <Form.Group controlId="nombre">
    <Form.Label>Nombre</Form.Label>
    <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
  </Form.Group>
</FormModal>
```

---

## 5. `ConfirmModal`

Diálogo modal de confirmación utilizado habitualmente para bajas lógicas y desvinculaciones irreversibles.

### Props
| Prop | Tipo | Requerido | Descripción |
| :--- | :--- | :---: | :--- |
| `show` | `boolean` | Sí | Visibilidad del modal. |
| `onHide` | `function` | Sí | Callback de cancelación. |
| `onConfirm` | `function` | Sí | Callback al confirmar la acción. |
| `title` | `string` | Sí | Título de advertencia. |
| `message` | `string` | Sí | Mensaje explicativo del impacto de la acción. |
| `confirmText` | `string` | No | Texto del botón confirmador (default: `'Confirmar'`). |
| `variant` | `string` | No | Variante visual de Bootstrap (`'danger'`, `'warning'`). |
| `loading` | `boolean` | No | Muestra spinner durante la ejecución. |

### Ejemplo de Uso
```jsx
<ConfirmModal
  show={Boolean(itemToDelete)}
  onHide={() => setItemToDelete(null)}
  onConfirm={handleConfirmBaja}
  title="Confirmar Baja Lógica"
  message={`¿Está seguro de dar de baja a ${itemToDelete?.nombre}? Su condición pasará a INACTIVO.`}
  confirmText="Confirmar Baja"
  variant="danger"
  loading={loading}
/>
```

---

## 6. `AppToast` y `useToast`

Sistema global de notificaciones emergentes administrado a través de `ToastContext`.

### Uso
```jsx
import { useToast } from '../../context/ToastContext'

const MyComponent = () => {
  const { showToast } = useToast()

  const handleAction = () => {
    showToast('Operación ejecutada con éxito', 'success')
  }

  return <Button onClick={handleAction}>Ejecutar</Button>
}
```

---

## 7. `EmptyState`

Componente visual para indicar ausencia de registros en tablas o vistas de consulta.

### Props
| Prop | Tipo | Requerido | Descripción |
| :--- | :--- | :---: | :--- |
| `icon` | `string` | No | Ícono ilustrativo (default: `'bi-inbox'`). |
| `title` | `string` | No | Título principal (default: `'Sin registros'`). |
| `message` | `string` | No | Mensaje descriptivo opcional. |
| `action` | `ReactNode` | No | Botón opcional de restablecimiento o reintento. |

---

## 8. `SolicitudForm`

Formulario genérico para la presentación de trámites estudiantiles (constancias, pasantías, títulos, etc.).

### Props
| Prop | Tipo | Requerido | Descripción |
| :--- | :--- | :---: | :--- |
| `tipoPredefinido` | `string` | No | Tipo preseleccionado para la solicitud. |
| `onSubmit` | `function` | Sí | Callback con `{ tipo, motivo, observaciones }`. |
| `loading` | `boolean` | No | Estado de procesamiento del botón de envío. |
| `extraFields` | `ReactNode` | No | Campos complementarios (ej. selector de carrera destino). |
