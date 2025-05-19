import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormLabel,
  CContainer,
  CButton,
  CNav,
  CNavItem,
  CNavLink,
  CTabPane,
  CTabContent,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { userStore } from '../../../stores/UserStore'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import CustomCFormInput from '../../../components/CustomCFormInput/CustomCFormInput'
import CustomCFormSwitch from '../../../components/CustomCFormSwitch/CustomCFormSwitch'
import CustomCFormFileInput from '../../../components/CustomCFormFileInput/CustomCFormFileInput'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import ChangePassword from '../../../components/ChangePassword/ChangePassword'
import CustomRequiredInput from '../../../components/CustomRequiredInput/CustomRequiredInput'

const UserDetail = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const userSchema = Yup.object().shape({
    firstName: Yup.string().required('Firstname is required').max(255),
    lastName: Yup.string().max(255),
    avatar: Yup.mixed()
      .nullable(true)
      .test('fileSize', 'Size limit 5MB', (image) => {
        if (!image) {
          return true
        }
        return image.size <= 5 * 1024 * 1024
      })
      .test('fileFormat', 'The type is not allow', (image) => {
        if (!image) {
          return true
        }
        return ['image/jpg', 'image/jpeg', 'image/png'].includes(image.type)
      }),
    isRealEmail: Yup.boolean(),
    contactEmail: Yup.string().when('isRealEmail', {
      is: false,
      then: (schema) => schema.email('Email is invalid').required('Contact email is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  })

  const [activeTab, setActiveTab] = useState('profile')
  let { userCode } = useParams()
  const userData = userCode ? userStore.userDetail : userStore.userDetailByMe

  useEffect(() => {
    const getProfile = async () => {
      if (userCode && !userStore.userDetail) {
        await userStore.getUserByUserCode(userCode)
      }
    }
    getProfile()

    return () => userStore.clearUserDetail()
  }, [userCode])

  const isShowTabChangePwd = !userCode ? true : false

  const [isDeleteAvatar, setIsDeleteAvatar] = useState(false)

  // Set state for form data.
  const [formData, setFormData] = useState({
    loginId: userData ? userData.loginId : '',
    employeeId: userData ? userData.employeeId : '',
    firstName: '',
    lastName: '',
    avatar: null,
    isRealEmail: true,
    contactEmail: '',
  })

  // Sync after call API data.
  useEffect(() => {
    if (userData) {
      setFormData({
        loginId: userData.loginId,
        employeeId: userData.employeeId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: null,
        isRealEmail: userData.isRealEmail,
        contactEmail: userData.contactEmail,
      })
    }
  }, [userData])

  // Handle delete image.
  const handleDeleteImage = (setFieldValue) => {
    setFieldValue('avatar', null)
    userData.avatarUrl = null
    setIsDeleteAvatar(true)
  }

  // Handle block btn.
  const isShowBlockbtn =
    location.pathname == '/users/me' ||
      (userStore.userDetailByMe && userCode == userStore.userDetailByMe.id)
      ? false
      : true

  // Submit form.
  const handleSubmit = async (values, { setSubmitting, setFieldValue }) => {
    try {
      // Handle form dât.
      const formData = new FormData()
      formData.append('firstName', values.firstName)
      formData.append('lastName', values.lastName)
      formData.append('id', userData.id)

      if (values.avatar) {
        formData.append('avatar', values.avatar)
      }
      formData.append('isDeletedAvatar', isDeleteAvatar)

      formData.append('isRealEmail', values.isRealEmail)

      formData.append('contactEmail', values.contactEmail)

      await userStore.updateUser(formData, navigate)
    } catch (error) {
    } finally {
      setSubmitting(false)
    }
  }

  // Handle block.
  const handleBlock = async () => {
    const confirm = window.confirm('Are you sure this action?')
    if (!confirm) {
      return
    }

    try {
      await userStore.blockUser(userCode, navigate)
    } catch (error) { }
  }

  return (
    <CNav variant="pills" role="tablist">
      <CNavItem>
        <CNavLink
          active={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
          role="button"
        >
          Profile
        </CNavLink>
      </CNavItem>
      {isShowTabChangePwd && (
        <CNavItem>
          <CNavLink
            active={activeTab === 'password'}
            onClick={() => setActiveTab('password')}
            role="button"
          >
            Change Password
          </CNavLink>
        </CNavItem>
      )}

      <CTabContent>
        <CTabPane visible={activeTab === 'profile'}>
          <CRow>
            <CCol xs={12}>
              {userData && (
                <Formik
                  initialValues={formData}
                  enableReinitialize
                  validationSchema={userSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, setFieldValue, values }) => (
                    <Form>
                      <CCard className="mb-4 mt-4">
                        <CCardBody>
                          <CContainer>
                            <CRow>
                              <CCol md={3}>
                                <CustomCFormFileInput
                                  name="avatar"
                                  label="Upload Avatar"
                                  accept="image/*"
                                  initialImageUrl={userData?.avatarUrl}
                                  onDelete={() => handleDeleteImage(setFieldValue)}
                                />
                              </CCol>

                              <CCol md={9}>
                                <CRow>
                                  <CCol md={4}>
                                    <CFormLabel htmlFor="employeeId" className="fw-bold">
                                      Employee ID<CustomRequiredInput/>
                                    </CFormLabel>
                                    <CustomCFormInput
                                      name="employeeId"
                                      type="text"
                                      className="mb-4"
                                      disabled
                                    />
                                  </CCol>
                                  <CCol md={4}>
                                    <CFormLabel htmlFor="loginId" className="fw-bold">
                                      Login ID<CustomRequiredInput/>
                                    </CFormLabel>
                                    <CustomCFormInput
                                      name="loginId"
                                      type="text"
                                      className="mb-4"
                                      disabled
                                    />
                                  </CCol>
                                  <CCol md={4}>
                                    <CFormLabel htmlFor="firstName" className="fw-bold">
                                      First name<CustomRequiredInput/>
                                    </CFormLabel>
                                    <CustomCFormInput
                                      name="firstName"
                                      type="text"
                                      className="mb-4"
                                    />
                                  </CCol>
                                  <CCol md={4}>
                                    <CFormLabel htmlFor="lastName" className="fw-bold">
                                      Last name
                                    </CFormLabel>
                                    <CustomCFormInput
                                      name="lastName"
                                      type="text"
                                      className="mb-4"
                                    />
                                  </CCol>
                                  <CCol md={2}>
                                    <CFormLabel htmlFor="email" className="fw-bold">
                                      Real email
                                    </CFormLabel>
                                    <CustomCFormSwitch
                                      id="formSwitchCheckChecked"
                                      name="isRealEmail"
                                    />
                                  </CCol>
                                  <CCol md={6}>
                                    {!values.isRealEmail && (
                                      <>
                                        <CFormLabel htmlFor="contactEmail" className="fw-bold">
                                          Contact Email
                                        </CFormLabel>
                                        <CustomCFormInput
                                          name="contactEmail"
                                          type="text"
                                          className="mb-4"
                                        />
                                      </>
                                    )}
                                  </CCol>
                                </CRow>

                                <CRow className="mt-3">
                                  <CCol md={12}>
                                    <CButton
                                      type="submit"
                                      color="primary"
                                      variant="outline"
                                      disabled={isSubmitting}
                                    >
                                      Update
                                    </CButton>
                                    {isShowBlockbtn && (
                                      <>
                                        &nbsp;
                                        <CButton
                                          color="danger"
                                          variant="outline"
                                          onClick={handleBlock}
                                        >
                                          {userData.isBlock ? 'Unblock' : 'Block'}
                                        </CButton>
                                      </>
                                    )}
                                  </CCol>
                                </CRow>
                              </CCol>
                            </CRow>
                          </CContainer>
                        </CCardBody>
                      </CCard>
                    </Form>
                  )}
                </Formik>
              )}
            </CCol>
          </CRow>
        </CTabPane>
        {isShowTabChangePwd && (
          <CTabPane visible={activeTab === 'password'}>
            <CRow className="mt-5">
              <CCol xs={12}>
                <ChangePassword />
              </CCol>
            </CRow>
          </CTabPane>
        )}
      </CTabContent>
    </CNav>
  )
}

export default observer(UserDetail)
