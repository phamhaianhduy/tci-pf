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
import dayjs from 'dayjs'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { UserRoundPen, UserRoundPlus, UserRoundMinus } from 'lucide-react'
import CustomCFormInput from '../../../components/CustomCFormInput/CustomCFormInput'
import CustomCFormSwitch from '../../../components/CustomCFormSwitch/CustomCFormSwitch'
import CustomCFormFileInput from '../../../components/CustomCFormFileInput/CustomCFormFileInput'
import { useParams } from 'react-router-dom'
import ChangePassword from '../../../components/ChangePassword/ChangePassword'

const UserDetail = () => {
  const userSchema = Yup.object().shape({
    fullName: Yup.string().required('Fullname is required').max(100),
    email: Yup.string().email('Email is invalid').required('Email is required'),
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

  const [activeTab, setActiveTab] = useState('detail')

  let { userCode } = useParams()

  useEffect(() => {
    const getProfile = async () => {
      if (userCode) {
        await userStore.getUserByUserCode(userCode)
      }
    }
    getProfile()

    return () => userStore.clearUserDetail()
  }, [userCode])

  let userData = userCode ? userStore.userDetail : userStore.userDetailByMe

  const isShowTabChangePwd = !userCode ? true : false

  const [isDeleteAvatar, setIsDeleteAvatar] = useState(false)

  // Set state for form data.
  const [formData, setFormData] = useState({
    userName: userData ? userData.userName : '',
    fullName: '',
    email: '',
    avatar: null,
    isRealEmail: true,
    contactEmail: '',
  })

  // Sync after call API data.
  useEffect(() => {
    if (userData) {
      setFormData({
        userName: userData.userName,
        fullName: userData.fullName,
        email: userData.email,
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

  // Submit form.
  const handleSubmit = async (values, { setSubmitting, setFieldValue }) => {
    try {
      // Handle form dât.
      const formData = new FormData()
      formData.append('fullName', values.fullName)
      formData.append('email', values.email)
      formData.append('id', userData.id)

      if (values.avatar) {
        formData.append('avatar', values.avatar)
      }
      formData.append('isDeletedAvatar', isDeleteAvatar)

      if (!values.isRealEmail || !userData.isRealEmail) {
        formData.append('isRealEmail', values.isRealEmail)
        formData.append('contactEmail', values.contactEmail)
      }

      await userStore.updateUser(formData)
    } catch (error) {
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <CNav variant="tabs" role="tablist">
      <CNavItem>
        <CNavLink
          active={activeTab === 'detail'}
          onClick={() => setActiveTab('detail')}
          role="button"
        >
          User Detail
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
        <CTabPane visible={activeTab === 'detail'}>
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
                                  onDelete={handleDeleteImage}
                                />
                              </CCol>

                              <CCol md={9}>
                                <CRow>
                                  <CCol md={6}>
                                    <CFormLabel htmlFor="userName">Username</CFormLabel>
                                    <CustomCFormInput
                                      name="userName"
                                      type="text"
                                      className="mb-4"
                                      disabled
                                    />
                                  </CCol>
                                  <CCol md={6}>
                                    <CFormLabel htmlFor="fullName">Fullname</CFormLabel>
                                    <CustomCFormInput
                                      name="fullName"
                                      type="text"
                                      className="mb-4"
                                    />
                                  </CCol>
                                  <CCol md={6}>
                                    <CFormLabel htmlFor="email">Email</CFormLabel>
                                    <CustomCFormInput name="email" type="text" className="mb-4" />
                                  </CCol>
                                  <CCol md={6}>
                                    {!values.isRealEmail && (
                                      <>
                                        <CFormLabel htmlFor="contactEmail">
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
                                  <CCol md={6}>
                                    <CFormLabel htmlFor="email">Real email</CFormLabel>
                                    <CustomCFormSwitch
                                      id="formSwitchCheckChecked"
                                      defaultChecked
                                      name="isRealEmail"
                                    />
                                  </CCol>
                                </CRow>

                                <CRow className="mt-3">
                                  <CCol>
                                    <CButton
                                      type="submit"
                                      color="primary"
                                      variant="outline"
                                      className="float-end"
                                      disabled={isSubmitting}
                                    >
                                      Update
                                    </CButton>
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
