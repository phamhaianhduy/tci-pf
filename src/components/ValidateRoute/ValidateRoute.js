import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { userStore } from '../../stores/UserStore'
import { observer } from 'mobx-react-lite'
import logout from '../../utils/logout'

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

  // If user was blocked then logout.
  if (userData && userData.isBlock) {
    logout()
  }

  return children
}

export default observer(ValidateRoute)
