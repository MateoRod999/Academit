import { Container, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export const NotFound = () => {
  return (
    <Container className="py-5 text-center">
      <Card className="p-5  border-0 mx-auto" style={{ maxWidth: '540px' }}>
        <h1 className="display-1 fw-bold text-primary mb-2">404</h1>
        <h3 className="fw-bold mb-3">Página no encontrada</h3>
        <p className="text-muted mb-4">
          La ruta a la que intentás acceder no existe o fue modificada.
        </p>
        <div>
          <Button as={Link} to="/" variant="primary" className="px-4">
            Volver al inicio
          </Button>
        </div>
      </Card>
    </Container>
  )
}

export default NotFound
