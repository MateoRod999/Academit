# Guía Paso a Paso: Cómo Agregar una Nueva Pantalla en Academit

En **Academit**, agregar una nueva funcionalidad o pantalla sigue una arquitectura modular y desacoplada. Toda la navegación, rutas protegidas y permisos se derivan de `src/config/menu.js`.

A continuación se detalla el procedimiento completo tomando como ejemplo una pantalla de **Gestión de Convenios de Pasantías** en el grupo `GESTIÓN ACADÉMICA`.

---

## Paso 1: Definir la Entidad y los Datos Simulados en `src/api/mocks/data.js`

Si la pantalla requiere datos de prueba en modo mock, agregá la colección correspondiente dentro del objeto `mockDb`:

```javascript
// En src/api/mocks/data.js
export const mockDb = {
  // ... otras entidades
  convenios: [
    {
      idConvenio: 1,
      empresa: 'Tech Solutions S.A.',
      cuit: '30-71234567-8',
      vacantes: 5,
      estado: 'ACTIVO',
      fechaFirma: '2026-03-01',
    },
    {
      idConvenio: 2,
      empresa: 'Innovar Software',
      cuit: '30-79876543-1',
      vacantes: 2,
      estado: 'ACTIVO',
      fechaFirma: '2026-04-10',
    },
  ],
}
```

---

## Paso 2: Crear el Módulo de Servicio en `src/api/`

Creá el archivo `src/api/convenios.js`. Cada función debe verificar el flag `isMock` y documentar formalmente el método HTTP y la ruta REST que espera del backend:

```javascript
// En src/api/convenios.js
import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

/**
 * Obtiene el listado de convenios vigentes de pasantías.
 * REST: GET /api/convenios
 * @returns {Promise<Array<Object>>}
 */
export const getConvenios = async () => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150)) // Latencia simulada
    return [...mockDb.convenios]
  }

  const response = await apiClient.get('/convenios')
  return response.data
}

/**
 * Registra un nuevo convenio empresarial.
 * REST: POST /api/convenios
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const createConvenio = async (data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const nuevoId = Math.max(...mockDb.convenios.map((c) => c.idConvenio), 0) + 1
    const nuevo = {
      idConvenio: nuevoId,
      empresa: data.empresa,
      cuit: data.cuit,
      vacantes: Number(data.vacantes) || 1,
      estado: 'ACTIVO',
      fechaFirma: new Date().toISOString().split('T')[0],
    }
    mockDb.convenios.push(nuevo)
    return { ...nuevo }
  }

  const response = await apiClient.post('/convenios', data)
  return response.data
}
```

---

## Paso 3: Crear el Componente de Página en `src/pages/<grupo>/`

Creá la vista en la subcarpeta correspondiente a su grupo (por ejemplo `src/pages/gestion/GestionConveniosPage.jsx`). Utilizá los componentes compartidos (`PageHeader`, `DataTable`, `StatusBadge`, `FormModal`) y el hook `useModo`:

```jsx
// En src/pages/gestion/GestionConveniosPage.jsx
import { useState, useEffect } from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap'
import PageHeader from '../../components/PageHeader'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import FormModal from '../../components/FormModal'
import { useToast } from '../../context/ToastContext'
import { useModo } from '../../hooks/useModo'
import { getConvenios, createConvenio } from '../../api/convenios'

export const GestionConveniosPage = () => {
  const { showToast } = useToast()
  const modo = useModo()
  const esLectura = modo === 'lectura'

  const [convenios, setConvenios] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ empresa: '', cuit: '', vacantes: 1 })

  const cargar = async () => {
    try {
      const data = await getConvenios()
      setConvenios(data)
    } catch {
      showToast('Error al cargar convenios', 'danger')
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createConvenio(form)
      showToast('Convenio registrado con éxito', 'success')
      setShowModal(false)
      cargar()
    } catch (err) {
      showToast(err.message || 'Error al guardar', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'empresa', label: 'Empresa / Institución' },
    { key: 'cuit', label: 'CUIT' },
    { key: 'vacantes', label: 'Vacantes Disponibles' },
    {
      key: 'estado',
      label: 'Condición',
      render: (row) => <StatusBadge status={row.estado} />,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Gestión de Convenios de Pasantías"
        subtitle="Empresas y organizaciones con convenios formativos vigentes"
        icon="bi-building-check"
        actions={
          !esLectura && (
            <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
              <i className="bi bi-plus-lg me-1" /> Nuevo Convenio
            </Button>
          )
        }
      />

      <DataTable
        columns={columns}
        data={convenios}
        keyField="idConvenio"
        searchPlaceholder="Buscar por empresa o CUIT..."
        searchKeys={['empresa', 'cuit']}
      />

      {!esLectura && (
        <FormModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onSubmit={handleSubmit}
          title="Registrar Nuevo Convenio"
          submitText="Guardar Convenio"
          loading={loading}
        >
          <Row className="g-3">
            <Col md={12}>
              <Form.Group controlId="convEmpresa">
                <Form.Label className="small fw-semibold">Razón Social</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={form.empresa}
                  onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="convCuit">
                <Form.Label className="small fw-semibold">CUIT</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={form.cuit}
                  onChange={(e) => setForm({ ...form, cuit: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="convVacantes">
                <Form.Label className="small fw-semibold">Vacantes Iniciales</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  required
                  value={form.vacantes}
                  onChange={(e) => setForm({ ...form, vacantes: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>
        </FormModal>
      )}
    </div>
  )
}

export default GestionConveniosPage
```

---

## Paso 4: Registrar la Entrada en `src/config/menu.js`

Importá el nuevo componente y agregá el objeto de configuración dentro del grupo correspondiente (`gestion`):

```javascript
// En src/config/menu.js
import GestionConveniosPage from '../pages/gestion/GestionConveniosPage'

// Dentro de MENU_GRUPOS en el grupo 'gestion':
{
  path: '/gestion/convenios',
  label: 'Convenios de pasantías',
  icon: 'bi-building-check',
  roles: ['ADMINISTRADOR', 'ADMINISTRATIVO'],
  modo: 'edicion',
  modoPorRol: {
    ADMINISTRADOR: 'edicion',
    ADMINISTRATIVO: 'lectura', // Administrativo solo consulta
  },
  component: GestionConveniosPage,
  rf: 'Adicional (fuera del análisis)',
}
```

---

## Paso 5: ¡Listo! No es necesario tocar `routes.jsx`

Debido a que `routes.jsx` y `Layout.jsx` leen directamente de `MENU_GRUPOS`:
1. La ruta `/gestion/convenios` queda automáticamente generada con su correspondiente `ProtectedRoute`.
2. El ítem aparece automáticamente en el menú lateral para los roles autorizados (`ADMINISTRADOR` y `ADMINISTRATIVO`).
3. Para el `ADMINISTRATIVO`, el botón `Nuevo Convenio` se oculta automáticamente porque su modo es `'lectura'`.
