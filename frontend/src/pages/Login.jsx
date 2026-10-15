import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [validated, setValidated] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [errorErrors, setErrorErrors] = useState([])
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Ruta a la que intentaba acceder antes de ser redirigido
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    // Validación de campos obligatorios
    if (!username.trim() || !password.trim()) {
      setValidated(true)
      return
    }

    try {
      setLoading(true)
      await login(username.trim(), password.trim())
      navigate(from, { replace: true })
    } catch (err) {
      setErrorMsg(err.message || 'Error al iniciar sesión')
      setErrorErrors(err.errors || [])
    } finally {
      setLoading(false)
    }
  }

  // Atajo para autocompletar usuario de prueba y facilitar la corrección
  const handleQuickFill = (user) => {
    setUsername(user)
    setPassword('1234')
    setErrorMsg('')
    setErrorErrors([])
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={5}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <img
                  src="/avatar-graduado.svg"
                  alt="Academit Logo"
                  width="76"
                  height="76"
                  className="d-inline-block"
                />
              </div>

              {errorMsg && (
                <Alert variant="danger" className="py-2 small">
                  <div className="d-flex align-items-center gap-1">
                    <span className="nf-glyph"></span>
                    <strong>{errorMsg}</strong>
                  </div>
                  {errorErrors.length > 0 && (
                    <ul className="mb-0 ps-3 mt-1">
                      {errorErrors.map((e, idx) => (
                        <li key={idx}>
                          {e.campo && e.campo !== 'general' && <strong>{e.campo}: </strong>}
                          {e.mensaje}
                        </li>
                      ))}
                    </ul>
                  )}
                </Alert>
              )}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label className="fw-semibold small">Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej. admin, docente..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    El nombre de usuario es obligatorio.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label className="fw-semibold small">Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    La contraseña es obligatoria.
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2 fw-semibold"
                  disabled={loading}
                >
                  {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                </Button>
              </Form>

              <hr className="my-4 border-secondary border-opacity-25" />

              <div className="p-3 rounded" style={{ backgroundColor: 'var(--m-surface)', border: '1px solid var(--m-outline)' }}>
                <p className="small text-muted fw-bold mb-2">
                  <span className="nf-glyph me-1"></span>
                  Usuarios de prueba (Contraseña: <code>1234</code>):
                </p>
                <div className="d-flex flex-wrap gap-1">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="small"
                    onClick={() => handleQuickFill('admin')}
                  >
                    admin (Admin)
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="small"
                    onClick={() => handleQuickFill('administrativo')}
                  >
                    administrativo
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="small"
                    onClick={() => handleQuickFill('docente')}
                  >
                    docente
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="small"
                    onClick={() => handleQuickFill('alumno')}
                  >
                    alumno
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
          <div className="text-center mt-4">
            <small className="text-muted" style={{ fontSize: '0.78rem' }}>
              Este programa fue hecho como proyecto para Taller Integrador III y licenciado con BSD3.
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Login
