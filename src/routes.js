import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const UserList = React.lazy(() => import('./views/pages/users/UserList'))
const UserDetail = React.lazy(() => import('./views/pages/users/UserDetail'))
const UserCreate = React.lazy(() => import('./views/pages/users/UserCreate'))
const LogList = React.lazy(() => import('./views/pages/logs/LogList'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const ChangePassword = React.lazy(() => import('./views/pages/changepwd/ChangePassword'))
const ResetPassword = React.lazy(() => import('./views/pages/resetpwd/ResetPassword'))

const routes = [
  // { path: '/', exact: true, name: 'Home' },
  { path: '/users', name: 'Users', element: UserList, protected: true },
  { path: '/users/me', name: 'Me', element: UserDetail, protected: true },
  { path: '/users/:userCode/edit', name: 'User Detail', element: UserDetail, protected: true },
  { path: '/users/create', name: 'Create', element: UserCreate, protected: true },
  { path: '/login', name: 'Login', element: Login },
  { path: '/logs', name: 'Logs', element: LogList, protected: true },
  { path: '/change-password', name: 'Change Password', element: ChangePassword, protected: true },
  { path: '/users/reset-password', name: 'Reset Password', element: ResetPassword },
]

export default routes
