import { CCard, CCardBody, CCol, CRow, CFormLabel, CButton, CContainer } from '@coreui/react'
import { Formik, Form, useField } from 'formik'
import * as Yup from 'yup'
import { userStore } from '../../stores/UserStore'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import encryptPassword from '../../utils/encryptPassword'
import { toast } from 'react-toastify'
import CustomCFormInput from '../CustomCFormInput/CustomCFormInput'
import { useNavigate } from 'react-router-dom'

const ChangePassword = () => {
  const navigate = useNavigate()
  const changePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old password is required'),
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

  useEffect(() => {
    const getProfile = async () => {
      await userStore.getUserByMe()
      if (userStore.userDetailByMe?.mustChangePassword) {
        toast.error('You must change your password because it is expired.')
      }
    }
    getProfile()
    return () => userStore.clearUserDetail()
  }, [])

  const handleSubmit = async (data, { setSubmitting, setFieldValue }) => {
    const payload = {
      oldPassword: encryptPassword(data.oldPassword),
      password: encryptPassword(data.password),
    }

    try {
      await userStore.updatePasswordUser(payload, navigate)
    } catch (error) {
      setFieldValue('oldPassword', '')
      setFieldValue('password', '')
      setFieldValue('confirmPassword', '')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Formik
      initialValues={{ oldPassword: '', password: '', confirmPassword: '' }}
      validationSchema={changePasswordSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <CCard className="mb-4 mt-4">
            <CCardBody>
              <CContainer>
                <CRow>
                  <CCol md={12}>
                    <CFormLabel htmlFor="email" className="mt-3 fw-bold">
                      Current Password
                    </CFormLabel>
                    <CustomCFormInput
                      name="oldPassword"
                      type="password"
                      label="Old Password"
                      placeholder="Enter your current password"
                    />
                  </CCol>
                  <CCol md={12}>
                    <CFormLabel htmlFor="email" className="mt-3 fw-bold">
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
                    <CFormLabel htmlFor="email" className="mt-3 fw-bold">
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
                      Change Password
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

export default observer(ChangePassword)
