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

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

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

  const handleQuickFill = (user) => {
    setUsername(user)
    setPassword('1234')
    setErrorMsg('')
    setErrorErrors([])
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 py-5" style={{ backgroundColor: 'var(--fondo)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={7} lg={5} xl={4}>
            <Card className="p-4 p-md-5" style={{ backgroundColor: 'var(--superficie)', border: '1px solid var(--borde)' }}>
              <div className="text-center mb-4">
                <h1 className="h2 mb-1 academic-serif" style={{ color: 'var(--texto)' }}>
                  Academit
                </h1>
                <p className="small text-muted mb-0" style={{ letterSpacing: '0.04em' }}>
                  Gestión Institucional
                </p>
              </div>

              {errorMsg && (
                <Alert variant="danger" transition={false} className="py-2 px-3 small mb-4">
                  <strong>{errorMsg}</strong>
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
                  <Form.Label>Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej. admin, docente, alumno..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    El nombre de usuario es obligatorio.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label>Contraseña</Form.Label>
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
                  className="w-100 py-2"
                  disabled={loading}
                >
                  {loading ? 'Cargando…' : 'Iniciar Sesión'}
                </Button>
              </Form>

              <hr className="my-4" style={{ borderColor: 'var(--borde)' }} />

              <div className="p-3" style={{ backgroundColor: 'var(--superficie-alt)', border: '1px solid var(--borde)' }}>
                <p className="small text-muted mb-2 fw-semibold">
                  Usuarios de prueba (Contraseña: <code>1234</code>):
                </p>
                <div className="d-flex flex-wrap gap-1">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="py-1 px-2"
                    onClick={() => handleQuickFill('admin')}
                  >
                    admin
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="py-1 px-2"
                    onClick={() => handleQuickFill('administrativo')}
                  >
                    administrativo
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="py-1 px-2"
                    onClick={() => handleQuickFill('docente')}
                  >
                    docente
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="py-1 px-2"
                    onClick={() => handleQuickFill('alumno')}
                  >
                    alumno
                  </Button>
                </div>
              </div>
            </Card>

            <div className="text-center mt-4">
              <small className="text-muted" style={{ fontSize: '0.78rem' }}>
                Este programa fue hecho como proyecto para Taller Integrador III y licenciado con BSD3.
              </small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login
