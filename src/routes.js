import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const UserList = React.lazy(() => import('./views/pages/users/UserList'))
const UserDetail = React.lazy(() => import('./views/pages/users/UserDetail'))
const UserCreate = React.lazy(() => import('./views/pages/users/UserCreate'))
const LogList = React.lazy(() => import('./views/pages/logs/LogList'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const ChangePassword = React.lazy(() => import('./views/pages/changepwd/ChangePassword'))

const routes = [
  // { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, protected: true },
  { path: '/users', name: 'Users', element: UserList, protected: true },
  { path: '/users/me', name: 'UserByMe', element: UserDetail, protected: true },
  { path: '/users/:userCode/edit', name: 'UserByUserCode', element: UserDetail, protected: true },
  { path: '/users/create', name: 'UserByUserCode', element: UserCreate, protected: true },
  { path: '/login', name: 'Login', element: Login },
  { path: '/logs', name: 'Logs', element: LogList, protected: true },
  { path: '/change-password', name: 'ChangePassword', element: ChangePassword, protected: true },
]

export default routes
