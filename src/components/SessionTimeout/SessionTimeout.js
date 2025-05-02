import { useIdleTimer } from "react-idle-timer";
import { useEffect } from "react";
import logout from '../../utils/logout';
import refreshToken from "../../utils/refreshToken";

const SessionTimeout = () => {

  useIdleTimer({
    timeout: 30 * 60 * 1000,
    onIdle: logout,
    debounce: 500,
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      const expiryToken = localStorage.getItem('expiryToken');
      if (expiryToken && Date.now() > parseInt(expiryToken)) {
        refreshToken();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return null;
};

export default SessionTimeout;
