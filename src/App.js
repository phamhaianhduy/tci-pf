import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import './scss/examples.scss'
import { ToastContainer } from 'react-toastify'
import { loadingStore } from './stores/LoadingStore'
import classes from './assets/loading/loading.module.css'
import { observer } from 'mobx-react-lite'
import { userStore } from './stores/UserStore'
import IdleSessionHandler from './components/IdleSessionHandler/IdleSessionHandler'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)
  useEffect(() => {
    const getUserByMe = async () => {
      if (!userStore.userDetailByMe) {
        await userStore.getUserByMe()
      }
    }
    getUserByMe()
  }, [])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      <IdleSessionHandler />
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        {loadingStore.isLoading && (
          <div className={classes['loading-overlay']}>
            <CSpinner animation="border" role="status" className={classes['loading-spinner']}>
              <span className={classes['visually-hidden']}>Loading...</span>
            </CSpinner>
          </div>
        )}
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={1000} />
      </Suspense>
    </BrowserRouter>
  )
}

export default observer(App)
