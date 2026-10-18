import { useState, useMemo } from 'react'
import { Table, Form, InputGroup, Button, Pagination } from 'react-bootstrap'
import EmptyState from './EmptyState'

export const DataTable = ({
  columns = [],
  data = [],
  keyField = 'id',
  searchable = true,
  searchPlaceholder = 'Buscar en los registros...',
  searchKeys = [],
  pageSize = 10,
  actions = null,
  emptyTitle = 'Sin registros',
  emptyDescription = 'No hay registros disponibles para mostrar.',
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Filtrado por buscador
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data

    const query = searchTerm.toLowerCase().trim()
    return data.filter((row) => {
      if (searchKeys.length > 0) {
        return searchKeys.some((k) => {
          const val = row[k]
          return val !== undefined && val !== null && String(val).toLowerCase().includes(query)
        })
      }
      return Object.values(row).some((val) => {
        if (typeof val === 'string' || typeof val === 'number') {
          return String(val).toLowerCase().includes(query)
        }
        return false
      })
    })
  }, [data, searchTerm, searchKeys])

  // Paginación simple
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1
  const validCurrentPage = Math.min(currentPage, totalPages)

  const paginatedData = useMemo(() => {
    const start = (validCurrentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, validCurrentPage, pageSize])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    setCurrentPage(1)
  }

  return (
    <div className="card" style={{ backgroundColor: 'var(--superficie)', border: '1px solid var(--borde)' }}>
      {/* Barra superior de la tabla: Buscador + Acciones */}
      {(searchable || actions) && (
        <div className="p-3 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3" style={{ borderColor: 'var(--borde)' }}>
          {searchable ? (
            <div className="flex-grow-1" style={{ maxWidth: '380px' }}>
              <InputGroup size="sm">
                <InputGroup.Text style={{ backgroundColor: 'var(--superficie-alt)', borderColor: 'var(--borde)' }}>
                  <i className="bi bi-search" />
                </InputGroup.Text>
                <Form.Control
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{
                    backgroundColor: 'var(--superficie)',
                    borderColor: 'var(--borde)',
                  }}
                />
                {searchTerm && (
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleClearSearch}
                    style={{ borderColor: 'var(--borde)' }}
                  >
                    Limpiar
                  </Button>
                )}
              </InputGroup>
            </div>
          ) : <div />}

          {actions && <div className="d-flex align-items-center gap-2 flex-wrap">{actions}</div>}
        </div>
      )}

      {/* Tabla con scroll horizontal responsivo */}
      <div className="table-responsive">
        {filteredData.length === 0 ? (
          <div className="p-3">
            <EmptyState
              title={searchTerm ? 'No se encontraron resultados' : emptyTitle}
              description={
                searchTerm
                  ? `No se encontró ningún registro que coincida con "${searchTerm}".`
                  : emptyDescription
              }
              actionLabel={searchTerm ? 'Limpiar búsqueda' : undefined}
              onAction={searchTerm ? handleClearSearch : undefined}
            />
          </div>
        ) : (
          <Table hover align="middle" className="mb-0 text-nowrap">
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={col.key || idx}
                    style={{
                      width: col.width || 'auto',
                      textAlign: col.align || 'left',
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rIdx) => {
                const rowKey = row[keyField] || row.idAlumno || row.idDocente || row.idCurso || row.idMateria || row.idCuota || row.idPago || row.idSolicitud || row.idMesa || rIdx
                return (
                  <tr key={rowKey}>
                    {columns.map((col, cIdx) => (
                      <td
                        key={col.key || cIdx}
                        style={{
                          textAlign: col.align || 'left',
                        }}
                      >
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </Table>
        )}
      </div>

      {/* Paginador simple y contador */}
      {filteredData.length > 0 && (
        <div className="p-3 border-top d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2" style={{ borderColor: 'var(--borde)', backgroundColor: 'var(--superficie-alt)' }}>
          <small className="text-muted">
            Mostrando <strong>{(validCurrentPage - 1) * pageSize + 1}</strong> a{' '}
            <strong>{Math.min(validCurrentPage * pageSize, filteredData.length)}</strong> de{' '}
            <strong>{filteredData.length}</strong> registros
          </small>

          {totalPages > 1 && (
            <Pagination size="sm" className="mb-0">
              <Pagination.Prev
                disabled={validCurrentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                Anterior
              </Pagination.Prev>
              <Pagination.Item active>
                {validCurrentPage} / {totalPages}
              </Pagination.Item>
              <Pagination.Next
                disabled={validCurrentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              >
                Siguiente
              </Pagination.Next>
            </Pagination>
          )}
        </div>
      )}
    </div>
  )
}

export default DataTable
