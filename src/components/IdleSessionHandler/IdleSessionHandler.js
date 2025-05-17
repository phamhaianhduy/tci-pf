import { useIdleTimer } from 'react-idle-timer'
import logout from '../../utils/logout'

const IdleSessionHandler = () => {
  const minutes = 30;
  useIdleTimer({
    timeout: minutes * 60 * 1000,
    onIdle: logout,
    debounce: 500,
  })

  return null
}

export default IdleSessionHandler
