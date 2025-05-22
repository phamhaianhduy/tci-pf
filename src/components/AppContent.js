import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import ValidateRoute from '../components/ValidateRoute/ValidateRoute'
// routes config
import routes from '../routes'

const AppContent = () => {
  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            const isProtected = route.protected
            const Component = route.element
            return (
              Component && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={
                    isProtected ? (
                      <ValidateRoute>
                        <Component />
                      </ValidateRoute>
                    ) : (
                      <Component />
                    )
                  }
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="admins/me" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
