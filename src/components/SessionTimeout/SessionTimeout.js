import { useIdleTimer } from "react-idle-timer";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SessionTimeout = () => {
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiryToken");
    navigate("/login");
  }, [navigate]);

  useIdleTimer({
    timeout: 30 * 60 * 1000,
    onIdle: logout,
    debounce: 500,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const expiryToken = localStorage.getItem('expiryToken');
      if (expiryToken && Date.now() > parseInt(expiryToken)) {
        logout();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [logout]);

  return null;
};

export default SessionTimeout;
