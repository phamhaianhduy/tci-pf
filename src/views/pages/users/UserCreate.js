import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormLabel,
  CContainer,
  CButton,
} from '@coreui/react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { userStore } from '../../../stores/UserStore'
import encryptPassword from '../../../utils/encryptPassword'
import CustomCFormInput from '../../../components/CustomCFormInput/CustomCFormInput'
import CustomCFormSwitch from '../../../components/CustomCFormSwitch/CustomCFormSwitch'
import CustomCFormFileInput from '../../../components/CustomCFormFileInput/CustomCFormFileInput'

const UserCreate = () => {
  const userSchema = Yup.object().shape({
    userName: Yup.string().required('Username is required').max(100),
    fullName: Yup.string().required('Fullname is required').max(100),
    email: Yup.string().email('Email is invalid').required('Email is required'),
    isRealEmail: Yup.boolean(),
    contactEmail: Yup.string().when('isRealEmail', {
      is: false,
      then: (schema) => schema.email('Email is invalid').required('Contact email is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .test('isStrong', 'Password is not secure', (value) => {
        if (!value) return false
        return (
          /[A-Z]/.test(value) &&
          /[a-z]/.test(value) &&
          /[0-9]/.test(value) &&
          /[!@#$%^&*(),.?':{}|<>]/.test(value)
        )
      }),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password'), null], 'Confirm password must match password'),
    avatar: Yup.mixed()
      .nullable(true)
      .test('fileSize', 'Size limit 5MB', (image) => !image || image.size <= 5 * 1024 * 1024)
      .test(
        'fileFormat',
        'File type is not allowed',
        (image) => !image || ['image/jpg', 'image/jpeg', 'image/png'].includes(image.type),
      ),
  })

  const initialFormData = {
    userName: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: null,
    isRealEmail: true,
    contactEmail: '',
  }

  // Handle delete image.
  const handleDeleteImage = (setFieldValue) => {
    setFieldValue('avatar', null)
    userData.avatarUrl = null
    setIsDeleteAvatar(true)
  }

  const handleSubmit = async (values, { setErrors, setSubmitting }) => {
    try {
      const formData = new FormData()
      formData.append('userName', values.userName)
      formData.append('fullName', values.fullName)
      formData.append('email', values.email)
      formData.append('password', encryptPassword(values.password))

      if (values.avatar) formData.append('avatar', values.avatar)
      if (!values.isRealEmail) {
        formData.append('isRealEmail', values.isRealEmail)
        formData.append('contactEmail', values.contactEmail)
      }

      await userStore.createUser(formData)
    } catch (error) {
      const res = error.response?.data
      if (res?.error?.code === 'USERNAME_EXIST') setErrors({ userName: res.error.message })
      if (res?.error?.code === 'EMAIL_EXIST') setErrors({ email: res.error.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <CContainer className="mt-4">
      <CCard>
        <CCardHeader>
          <strong>Create New User</strong>
        </CCardHeader>
        <CCardBody>
          <Formik
            initialValues={initialFormData}
            validationSchema={userSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form>
                <CRow>
                  <CCol md={4}>
                    <CustomCFormFileInput
                      name="avatar"
                      label="Upload Avatar"
                      accept="image/*"
                      initialImageUrl=""
                      onDelete={handleDeleteImage}
                    />
                  </CCol>
                  <CCol md={8}>
                    <CRow>
                      <CCol md={6} className="mb-4">
                        <CFormLabel>Fullname</CFormLabel>
                        <CustomCFormInput name="fullName" type="text" />
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel>Username</CFormLabel>
                        <CustomCFormInput name="userName" type="text" />
                      </CCol>
                      <CCol md={6} className="mb-4">
                        <CFormLabel>Email</CFormLabel>
                        <CustomCFormInput name="email" type="email" />
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel htmlFor="email">Real email</CFormLabel>
                        <CustomCFormSwitch
                          id="realEmailSwitch"
                          label="Real Email"
                          name="isRealEmail"
                        />
                      </CCol>
                      {!values.isRealEmail && (
                        <CCol md={12} className="mb-4">
                          <CFormLabel>Contact Email</CFormLabel>
                          <CustomCFormInput name="contactEmail" type="text" />
                        </CCol>
                      )}
                      <CCol md={6}>
                        <CFormLabel>Password</CFormLabel>
                        <CustomCFormInput name="password" type="password" />
                        <small className="text-muted">
                          Password must include upper, lower, number, and special character
                        </small>
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel>Confirm Password</CFormLabel>
                        <CustomCFormInput name="confirmPassword" type="password" />
                      </CCol>
                      <CCol md={12} className="mt-4">
                        <CButton
                          type="submit"
                          color="primary"
                          disabled={isSubmitting}
                          variant="outline"
                        >
                          Create User
                        </CButton>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
              </Form>
            )}
          </Formik>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default UserCreate
