import React, { useState } from 'react'
import { CButton, CCard, CCardBody, CCardGroup, CCol, CContainer, CRow } from '@coreui/react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { authStore } from '../../../stores/AuthStore'
import { userStore } from '../../../stores/UserStore'
import { observer } from 'mobx-react-lite'
import CustomCFormInput from '../../../components/CustomCFormInput/CustomCFormInput'
import { emailRegex } from '../../../utils/emailRegex'

const Login = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('login')

  // For user logged in.
  if (userStore.userDetailByMe) {
    navigate('/profile-settings')
  }

  const loginSchema = Yup.object().shape({
    loginId: Yup.string()
      .required('Login ID is required')
      .test('is-valid-email', 'Login ID is email', (value) => {
        if (!value) return false
        return emailRegex.test(value)
      }),
    password: Yup.string().required('Password is required').min(6),
  })

  const forgotSchema = Yup.object().shape({
    loginId: Yup.string()
      .required('Email is required')
      .test('is-valid-email', 'Login ID is email', (value) => {
        if (!value) return false
        return emailRegex.test(value)
      }),
  })

  const handleLoginSubmit = async (values) => {
    try {
      await authStore.login(values, navigate)
    } catch (error) {}
  }

  const handleForgotSubmit = async (values, { setErrors }) => {
    try {
      await userStore.forgotPasswordUser(values.loginId, navigate)
    } catch (error) {}
  }

  const handleActiveSection = (section, { setFieldValue }) => {
    setActiveSection(section)
    setFieldValue('loginId', null)
    setFieldValue('password', null)
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  {activeSection === 'login' ? (
                    <Formik
                      initialValues={{ userName: '', password: '' }}
                      validationSchema={loginSchema}
                      onSubmit={handleLoginSubmit}
                    >
                      {({ isSubmitting, setFieldValue }) => (
                        <Form>
                          <h1>Login</h1>
                          <p className="text-body-secondary">Sign In to your account</p>
                          <div className="mb-3">
                            <CustomCFormInput
                              name="loginId"
                              placeholder="Login ID"
                              autoComplete="loginId"
                              type="text"
                            />
                          </div>
                          <div className="mb-3">
                            <CustomCFormInput
                              name="password"
                              placeholder="Password"
                              autoComplete="password"
                              type="password"
                            />
                          </div>

                          <CRow>
                            <CCol xs={6}>
                              <CButton
                                color="primary"
                                type="submit"
                                disabled={isSubmitting}
                                variant="outline"
                              >
                                Login
                              </CButton>
                            </CCol>
                            <CCol xs={6} className="text-end">
                              <CButton
                                color="link"
                                className="px-0"
                                type="button"
                                onClick={() => handleActiveSection('forgot', { setFieldValue })}
                              >
                                Forgot password?
                              </CButton>
                            </CCol>
                          </CRow>
                        </Form>
                      )}
                    </Formik>
                  ) : (
                    <Formik
                      initialValues={{ email: '' }}
                      validationSchema={forgotSchema}
                      onSubmit={handleForgotSubmit}
                    >
                      {({ isSubmitting, setFieldValue }) => (
                        <Form>
                          <h1>Forgot Password</h1>
                          <p className="text-body-secondary">
                            We'll send a link to your email to reset your password
                          </p>
                          <div className="mb-3">
                            <CustomCFormInput
                              name="loginId"
                              placeholder="Enter your Login Id"
                              type="email"
                            />
                          </div>
                          <CRow>
                            <CCol xs={6}>
                              <CButton
                                type="submit"
                                color="primary"
                                disabled={isSubmitting}
                                variant="outline"
                              >
                                Reset
                              </CButton>
                            </CCol>
                            <CCol xs={6} className="text-end">
                              <CButton
                                type="button"
                                color="link"
                                className="px-0"
                                onClick={() => handleActiveSection('login', { setFieldValue })}
                              >
                                Back to login
                              </CButton>
                            </CCol>
                          </CRow>
                        </Form>
                      )}
                    </Formik>
                  )}
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default observer(Login)
