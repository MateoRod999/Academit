import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MENU_GRUPOS, getModoParaRol } from '../config/menu'

/**
 * Hook para determinar el modo ('edicion' | 'lectura') de la pantalla actual
 * según el rol del usuario autenticado y la configuración de config/menu.js.
 */
export const useModo = () => {
  const location = useLocation()
  const { rol } = useAuth()
  const todosLosItems = MENU_GRUPOS.flatMap((grupo) => grupo.items)
  const itemActual = todosLosItems.find((item) => item.path === location.pathname)
  return getModoParaRol(itemActual, rol)
}

export default useModo
