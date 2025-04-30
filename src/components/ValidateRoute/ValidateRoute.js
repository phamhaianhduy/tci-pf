import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { userStore } from '../../stores/UserStore';

const ValidateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  const [mustChangePassword, setMustChangePassword] = useState(false);

  useEffect(() => {
    const checkExpiredPassword = async () => {
      await userStore.getUserByMe();
      if (userStore.userDetailByMe) {
        const dateNow = new Date();
        const dateLastePasswordChange = new Date(
          userStore.userDetailByMe.lastPasswordChange
        );
        
        const compareMonth =
          (dateNow.getFullYear() - dateLastePasswordChange.getFullYear()) * 12 +
          dateNow.getMonth() -
          dateLastePasswordChange.getMonth();

        if (compareMonth >= 3) {
         setMustChangePassword(true);
        }
      }
    };
    checkExpiredPassword();
    return () => userStore.clearUserDetail();
  }, []);

  if (!token) {
    return <Navigate to='/login' replace />;
  }

  if (mustChangePassword && location.pathname !== '/users/change-password') {
    return <Navigate to='/users/change-password' replace />;
  }

  return children;
};

export default ValidateRoute;
