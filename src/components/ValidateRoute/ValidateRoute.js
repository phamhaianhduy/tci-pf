import { Navigate, useLocation } from 'react-router-dom'
import { userStore } from '../../stores/UserStore'
import { observer } from 'mobx-react-lite'

const ValidateRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  const userData = userStore.userDetailByMe

  if (
    userData &&
    (userData.mustChangePassword || userData.requiredChangePassword) &&
    location.pathname !== '/change-password'
  ) {
    return <Navigate to="/change-password" replace />
  }

  return children
}

export default observer(ValidateRoute)
