import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const AdminList = React.lazy(() => import('./views/pages/admins/AdminList'))
const AdminDetail = React.lazy(() => import('./views/pages/admins/AdminDetail'))
const AdminCreate = React.lazy(() => import('./views/pages/admins/AdminCreate'))
const LogList = React.lazy(() => import('./views/pages/logs/LogList'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const ChangePassword = React.lazy(() => import('./views/pages/changepwd/ChangePassword'))
const ResetPassword = React.lazy(() => import('./views/pages/resetpwd/ResetPassword'))

const routes = [
  // { path: '/', exact: true, name: 'Home' },
  { path: '/admins', name: 'Admins', element: AdminList, protected: true },
  { path: '/profile-settings', name: 'Me', element: AdminDetail, protected: true },
  { path: '/admins/:userCode/edit', name: 'Admin Detail', element: AdminDetail, protected: true },
  { path: '/admins/create', name: 'Create', element: AdminCreate, protected: true },
  { path: '/login', name: 'Login', element: Login },
  { path: '/logs', name: 'Logs', element: LogList, protected: true },
  { path: '/change-password', name: 'Change Password', element: ChangePassword, protected: true },
  { path: '/admins/reset-password', name: 'Reset Password', element: ResetPassword },
]

export default routes
