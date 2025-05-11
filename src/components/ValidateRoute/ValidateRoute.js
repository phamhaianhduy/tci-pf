import { Navigate, useLocation } from 'react-router-dom';
import { userStore } from '../../stores/UserStore';
import { observer } from 'mobx-react-lite';

const ValidateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to='/login' replace />;
  }

  const userData = userStore.userDetailByMe;

  if (userData && userData.mustChangePassword === true && location.pathname !== '/users/change-password') {
    return <Navigate to='/users/change-password' replace />;
  }

  return children;
};

export default observer(ValidateRoute);
