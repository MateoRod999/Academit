import { useState, useEffect } from 'react'
import { Button, Form, Row, Col, Badge } from 'react-bootstrap'
import PageHeader from '../../components/PageHeader'
import DataTable from '../../components/DataTable'
import FormModal from '../../components/FormModal'
import { useToast } from '../../context/ToastContext'
import { getPagos, registrarPago } from '../../api/pagos'
import { getAlumnos } from '../../api/alumnos'
import { getCuotas } from '../../api/cuotas'

export const AdminPagosPage = () => {
  const { showToast } = useToast()
  const [pagos, setPagos] = useState([])
  const [alumnos, setAlumnos] = useState([])
  const [cuotas, setCuotas] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [form, setForm] = useState({
    idAlumno: 1,
    idCuota: '',
    concepto: '',
    monto: 28000,
    medioPago: 'TRANSFERENCIA',
    fechaPago: new Date().toISOString().split('T')[0],
  })

  const cargar = async () => {
    try {
      const data = await getPagos()
      setPagos(data)
    } catch {
      showToast('Error al cargar pagos', 'danger')
    }
  }

  useEffect(() => {
    cargar()
    getAlumnos().then(setAlumnos).catch(() => {})
    getCuotas().then(setCuotas).catch(() => {})
  }, [])

  // Cuotas pendientes del alumno seleccionado
  const cuotasPendientesAlumno = cuotas.filter(
    (c) => c.idAlumno === Number(form.idAlumno) && (c.estado === 'PENDIENTE' || c.estado === 'VENCIDA')
  )

  const handleAlumnoChange = (idAlu) => {
    const id = Number(idAlu)
    const cuotasDelAlu = cuotas.filter((c) => c.idAlumno === id && (c.estado === 'PENDIENTE' || c.estado === 'VENCIDA'))
    const primera = cuotasDelAlu[0]

    setForm({
      ...form,
      idAlumno: id,
      idCuota: primera ? primera.idCuota : '',
      concepto: primera ? primera.concepto : 'Arancel / Cuota General',
      monto: primera ? primera.monto : 28000,
    })
  }

  const handleCuotaChange = (idCuota) => {
    const cuota = cuotas.find((c) => c.idCuota === Number(idCuota))
    if (cuota) {
      setForm({
        ...form,
        idCuota: cuota.idCuota,
        concepto: cuota.concepto,
        monto: cuota.monto, // Pago SIEMPRE por el importe completo
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await registrarPago(form)
      showToast('Pago registrado y acreditado por el importe completo de la cuota', 'success')
      setShowModal(false)
      cargar()
      getCuotas().then(setCuotas)
    } catch (err) {
      showToast(err.message || 'Error al registrar pago', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'comprobante', label: 'Comprobante', width: '130px', render: (row) => <span className="font-monospace fw-bold">{row.comprobante}</span> },
    {
      key: 'alumnoNombre',
      label: 'Estudiante',
      render: (row) => <strong style={{ color: 'var(--m-onSurface)' }}>{row.alumnoNombre}</strong>,
    },
    { key: 'concepto', label: 'Concepto Abonado' },
    {
      key: 'monto',
      label: 'Monto Pagado',
      render: (row) => <span className="fw-bold text-success">${row.monto.toLocaleString('es-AR')}</span>,
    },
    { key: 'fechaPago', label: 'Fecha de Pago' },
    {
      key: 'medioPago',
      label: 'Medio de Pago',
      render: (row) => <Badge bg="secondary">{row.medioPago}</Badge>,
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (row) => <Badge bg="success">{row.estado}</Badge>,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Registro de Pagos y Cobranzas"
        subtitle="Cobro de aranceles por importe completo de cuota (EFECTIVO, TRANSFERENCIA, TARJETA, OTRO)"
        icon="bi-cash-coin"
        actions={
          <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-lg me-1" /> Registrar Nuevo Pago
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={pagos}
        keyField="idPago"
        searchPlaceholder="Buscar por alumno, concepto o comprobante..."
        searchKeys={['alumnoNombre', 'concepto', 'comprobante', 'medioPago']}
      />

      <FormModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        title="Registrar Cobro de Cuota"
        submitText="Confirmar Pago Completo"
        loading={loading}
      >
        <Row className="g-3">
          <Col md={12}>
            <Form.Group controlId="pagoAlumno">
              <Form.Label className="small fw-semibold">Estudiante <span className="text-danger">*</span></Form.Label>
              <Form.Select
                value={form.idAlumno}
                onChange={(e) => handleAlumnoChange(e.target.value)}
                style={{ backgroundColor: 'var(--m-surfaceVariant)', color: 'var(--m-onSurface)' }}
              >
                {alumnos.map((a) => (
                  <option key={a.idAlumno} value={a.idAlumno}>
                    {a.apellido}, {a.nombre} (DNI: {a.dni})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group controlId="pagoCuota">
              <Form.Label className="small fw-semibold">Cuota o Seguro Pendiente a Cancelar <span className="text-danger">*</span></Form.Label>
              {cuotasPendientesAlumno.length > 0 ? (
                <Form.Select
                  value={form.idCuota}
                  onChange={(e) => handleCuotaChange(e.target.value)}
                  style={{ backgroundColor: 'var(--m-surfaceVariant)', color: 'var(--m-onSurface)' }}
                >
                  {cuotasPendientesAlumno.map((c) => (
                    <option key={c.idCuota} value={c.idCuota}>
                      {c.concepto} - ${c.monto.toLocaleString('es-AR')} (Vto: {c.fechaVencimiento} - {c.estado})
                    </option>
                  ))}
                </Form.Select>
              ) : (
                <Form.Control
                  type="text"
                  value={form.concepto}
                  onChange={(e) => setForm({ ...form, concepto: e.target.value })}
                  placeholder="Concepto de pago general"
                  style={{ backgroundColor: 'var(--m-surfaceVariant)', color: 'var(--m-onSurface)' }}
                />
              )}
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="pagoMonto">
              <Form.Label className="small fw-semibold">
                Importe Total Obligatorio (Sin pagos parciales)
              </Form.Label>
              <Form.Control
                type="text"
                value={`$${form.monto.toLocaleString('es-AR')}`}
                readOnly
                className="fw-bold"
                style={{ backgroundColor: 'var(--m-surface)', color: 'var(--m-primary)' }}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="pagoMedio">
              <Form.Label className="small fw-semibold">Medio de Pago <span className="text-danger">*</span></Form.Label>
              <Form.Select
                value={form.medioPago}
                onChange={(e) => setForm({ ...form, medioPago: e.target.value })}
                style={{ backgroundColor: 'var(--m-surfaceVariant)', color: 'var(--m-onSurface)' }}
              >
                <option value="EFECTIVO">EFECTIVO</option>
                <option value="TRANSFERENCIA">TRANSFERENCIA BANCARIA</option>
                <option value="TARJETA">TARJETA DE DÉBITO / CRÉDITO</option>
                <option value="OTRO">OTRO</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="pagoFecha">
              <Form.Label className="small fw-semibold">Fecha de Operación</Form.Label>
              <Form.Control
                type="date"
                value={form.fechaPago}
                onChange={(e) => setForm({ ...form, fechaPago: e.target.value })}
                style={{ backgroundColor: 'var(--m-surfaceVariant)', color: 'var(--m-onSurface)' }}
              />
            </Form.Group>
          </Col>
        </Row>
      </FormModal>
    </div>
  )
}

export default AdminPagosPage
