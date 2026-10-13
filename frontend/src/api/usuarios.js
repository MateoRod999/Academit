import apiClient, { isMock } from './client'
import { mockDb } from './mocks/data'

/**
 * Obtiene el listado de cuentas de usuario y roles del sistema.
 * REST: GET /api/usuarios
 * @returns {Promise<Array<Object>>}
 */
export const getUsuarios = async () => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return [...mockDb.usuarios]
  }
  const response = await apiClient.get('/usuarios')
  return response.data
}

/**
 * Registra un nuevo usuario con credenciales y asignación de rol.
 * REST: POST /api/usuarios
 * @param {Object} data - Datos del usuario (username, nombre, email, rol)
 * @returns {Promise<Object>}
 */
export const createUsuario = async (data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const nuevoId = Math.max(...mockDb.usuarios.map((u) => u.idUsuario), 0) + 1
    const nuevo = {
      idUsuario: nuevoId,
      username: data.username.toLowerCase().trim(),
      nombre: data.nombre,
      email: data.email,
      rol: data.rol, // 'ADMINISTRADOR' | 'ADMINISTRATIVO' | 'DOCENTE' | 'ALUMNO'
      estado: 'ACTIVO',
      ultimoAcceso: 'Nunca',
    }
    mockDb.usuarios.push(nuevo)
    return { ...nuevo }
  }
  const response = await apiClient.post('/usuarios', data)
  return response.data
}

/**
 * Actualiza los datos de perfil o rol de un usuario existente.
 * REST: PUT /api/usuarios/{id}
 * @param {number|string} idUsuario - Identificador del usuario
 * @param {Object} data - Campos a modificar
 * @returns {Promise<Object>}
 */
export const updateUsuario = async (idUsuario, data) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const index = mockDb.usuarios.findIndex((u) => u.idUsuario === Number(idUsuario))
    if (index === -1) throw new Error('Usuario no encontrado')
    mockDb.usuarios[index] = { ...mockDb.usuarios[index], ...data }
    return { ...mockDb.usuarios[index] }
  }
  const response = await apiClient.put(`/usuarios/${idUsuario}`, data)
  return response.data
}

/**
 * Realiza la baja lógica de un usuario del sistema.
 * REST: DELETE /api/usuarios/{id}
 * @param {number|string} idUsuario - Identificador del usuario
 * @returns {Promise<Object>}
 */
export const deleteUsuario = async (idUsuario) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const index = mockDb.usuarios.findIndex((u) => u.idUsuario === Number(idUsuario))
    if (index === -1) throw new Error('Usuario no encontrado')
    mockDb.usuarios[index].estado = 'INACTIVO'
    return { success: true }
  }
  const response = await apiClient.delete(`/usuarios/${idUsuario}`)
  return response.data
}

/**
 * Obtiene los datos del perfil del usuario en sesión.
 * REST: GET /api/usuarios/me
 * @returns {Promise<Object>}
 */
export const getMiPerfil = async () => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 150))
    let currentUsername = 'alumno'
    try {
      const raw = sessionStorage.getItem('instituto_sesion')
      if (raw) {
        const ses = JSON.parse(raw)
        if (ses.usuario) currentUsername = ses.usuario
      }
    } catch {
      // Ignorar error de storage
    }

    const usuarioDb = mockDb.usuarios.find((u) => u.username === currentUsername)
    const alumnoDb = mockDb.alumnos.find(
      (a) => `${a.nombre} ${a.apellido}`.toLowerCase() === (usuarioDb?.nombre || '').toLowerCase()
    )

    if (!mockDb.perfilActual || mockDb.perfilActual.username !== currentUsername) {
      mockDb.perfilActual = {
        idUsuario: usuarioDb?.idUsuario || 4,
        username: currentUsername,
        nombre: usuarioDb?.nombre || (alumnoDb ? `${alumnoDb.nombre} ${alumnoDb.apellido}` : 'Lucía Benítez'),
        email: usuarioDb?.email || (alumnoDb ? alumnoDb.email : `${currentUsername}@instituto.edu.ar`),
        dni: alumnoDb?.dni || '42.111.222',
        telefono: alumnoDb?.telefono || '11-4567-8901',
        direccion: alumnoDb?.direccion || alumnoDb?.domicilio || 'Av. Corrientes 1234, CABA',
        domicilio: alumnoDb?.domicilio || alumnoDb?.direccion || 'Av. Corrientes 1234, CABA',
        fechaNacimiento: alumnoDb?.fechaNacimiento || '2001-04-18',
        carrera: alumnoDb?.carrera || 'Tecnicatura Superior en Desarrollo de Software',
        rol: usuarioDb?.rol || 'ALUMNO',
      }
    }

    return { ...mockDb.perfilActual }
  }

  const response = await apiClient.get('/usuarios/me')
  return response.data
}

/**
 * Actualiza los datos de contacto y filiación del perfil en sesión.
 * REST: PUT /api/usuarios/me
 * @param {Object} datos - Datos personales actualizados
 * @returns {Promise<Object>}
 */
export const actualizarMiPerfil = async (datos) => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    if (!mockDb.perfilActual) {
      await getMiPerfil()
    }

    mockDb.perfilActual = {
      ...mockDb.perfilActual,
      ...datos,
    }

    // Persistir cambios en mockDb.usuarios si corresponde
    const uIndex = mockDb.usuarios.findIndex((u) => u.username === mockDb.perfilActual.username)
    if (uIndex !== -1) {
      mockDb.usuarios[uIndex] = {
        ...mockDb.usuarios[uIndex],
        nombre: datos.nombre || mockDb.usuarios[uIndex].nombre,
        email: datos.email || mockDb.usuarios[uIndex].email,
      }
    }

    // Persistir en mockDb.alumnos si corresponde
    const alumnoIndex = mockDb.alumnos.findIndex((a) => a.idAlumno === 1)
    if (alumnoIndex !== -1 && mockDb.perfilActual.rol === 'ALUMNO') {
      mockDb.alumnos[alumnoIndex] = {
        ...mockDb.alumnos[alumnoIndex],
        ...datos,
      }
    }

    // Sincronizar nombre en sessionStorage para la sesión activa
    try {
      const raw = sessionStorage.getItem('instituto_sesion')
      if (raw) {
        const ses = JSON.parse(raw)
        if (datos.nombre) ses.nombre = datos.nombre
        sessionStorage.setItem('instituto_sesion', JSON.stringify(ses))
      }
    } catch {
      // Ignorar error de storage
    }

    return { ...mockDb.perfilActual }
  }

  const response = await apiClient.put('/usuarios/me', datos)
  return response.data
}

