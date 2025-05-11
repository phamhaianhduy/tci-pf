import { useIdleTimer } from "react-idle-timer";
import logout from '../../utils/logout';

const IdleSessionHandler  = () => {

  useIdleTimer({
    timeout: 30 * 60 * 1000,
    onIdle: logout,
    debounce: 500,
  });

  return null;
};

export default IdleSessionHandler ;
