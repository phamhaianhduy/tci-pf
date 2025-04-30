import { useIdleTimer } from "react-idle-timer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SessionTimeout = () => {
  const navigate = useNavigate();
  const [tokenExpiryTime, setTokenExpiryTime] = useState(null);
  useEffect(() => {
    const tokenExpiry = 15 * 60 * 1000;
    setTokenExpiryTime(Date.now() + tokenExpiry);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useIdleTimer({
    timeout: 15 * 60 * 1000,
    onIdle: logout,
    debounce: 500,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (tokenExpiryTime && Date.now() > tokenExpiryTime) {
        logout();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [tokenExpiryTime, navigate]);

  return null;
};

export default SessionTimeout;
