import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormLabel,
  CButton,
  CContainer,
} from '@coreui/react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { userStore } from '../../../stores/UserStore'
import { observer } from 'mobx-react-lite'
import encryptPassword from '../../../utils/encryptPassword'
import CustomCFormInput from '../../../components/CustomCFormInput/CustomCFormInput'
import { useLocation, useNavigate } from 'react-router-dom'

const ResetPassword = () => {
  const resetPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .test('isStrong', 'Password is not secure.', (value) => {
        if (!value) return false
        const hasUpper = /[A-Z]/.test(value)
        const hasLower = /[a-z]/.test(value)
        const hasNumber = /[0-9]/.test(value)
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)
        return hasUpper && hasLower && hasNumber && hasSpecialChar
      }),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  })

  // Get token.
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const token = searchParams.get('token')

  const navigate = useNavigate()

  const handleSubmit = async ({ password }) => {
    try {
      const encryptedPassword = encryptPassword(password)
      await userStore.resetPasswordUser(encryptedPassword, token, navigate)
    } catch (error) {
      toast.warn(error.response.data.message)
    }
  }

  return (
    <Formik
      initialValues={{ password: '', confirmPassword: '' }}
      validationSchema={resetPasswordSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <CCard className="mb-4 mt-4">
            <CCardHeader>
              <strong>Change Password</strong>
            </CCardHeader>
            <CCardBody>
              <CContainer>
                <CRow>
                  <CCol md={12}>
                    <CFormLabel htmlFor="email" className="mt-3">
                      New Password
                    </CFormLabel>
                    <CustomCFormInput
                      name="password"
                      type="password"
                      label="New Password"
                      placeholder="Enter your new password"
                    />
                  </CCol>
                  <CCol md={12}>
                    <CFormLabel htmlFor="email" className="mt-3">
                      Confirm Password
                    </CFormLabel>
                    <CustomCFormInput
                      name="confirmPassword"
                      type="password"
                      label="Confirm Password"
                      placeholder="Confirm your new password"
                    />
                  </CCol>
                </CRow>

                <CRow className="mt-3">
                  <CCol>
                    <CButton
                      type="submit"
                      color="primary"
                      disabled={isSubmitting}
                      variant="outline"
                    >
                      Update Password
                    </CButton>
                  </CCol>
                </CRow>
              </CContainer>
            </CCardBody>
          </CCard>
        </Form>
      )}
    </Formik>
  )
}

export default observer(ResetPassword)
