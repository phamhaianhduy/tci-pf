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
import CustomCFormInput from '../../../components/CustomCFormInput/CustomCFormInput'
import CustomCFormSwitch from '../../../components/CustomCFormSwitch/CustomCFormSwitch'
import CustomCFormFileInput from '../../../components/CustomCFormFileInput/CustomCFormFileInput'
import { useNavigate } from 'react-router-dom'

const UserCreate = () => {
  const navigate = useNavigate()

  const userSchema = Yup.object().shape({
    employeeId: Yup.string()
      .required('Employee ID is required')
      .max(20, 'Employee ID is max exceed length'),
    firstName: Yup.string()
      .required('Firstname is required')
      .max(255, 'Firstname is max exceed length'),
    lastName: Yup.string().max(255, 'Lastname is max exceed length'),
    loginId: Yup.string()
      .email('Email is invalid')
      .required('Email is required')
      .max(111, 'Login ID is max exceed length'),
    isRealEmail: Yup.boolean(),
    contactEmail: Yup.string().when('isRealEmail', {
      is: false,
      then: (schema) => schema.email('Email is invalid').required('Contact email is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
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
    employeeId: '',
    firstName: '',
    lastName: '',
    loginId: '',
    avatar: null,
    isRealEmail: true,
    contactEmail: '',
  }

  const handleSubmit = async (values, { setErrors, setSubmitting }) => {
    try {
      const formData = new FormData()
      formData.append('employeeId', values.employeeId)
      formData.append('firstName', values.firstName)
      formData.append('lastName', values.lastName)
      formData.append('loginId', values.loginId)

      if (values.avatar) formData.append('avatar', values.avatar)
      if (!values.isRealEmail) {
        formData.append('isRealEmail', values.isRealEmail)
        formData.append('contactEmail', values.contactEmail)
      }

      await userStore.createUser(formData, navigate)
    } catch (error) {
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
                    />
                  </CCol>
                  <CCol md={8}>
                    <CRow>
                      <CCol md={6}>
                        <CFormLabel>Employee ID</CFormLabel>
                        <CustomCFormInput name="employeeId" type="text" maxLength="20" />
                      </CCol>
                      <CCol md={6} className="mb-4">
                        <CFormLabel>Login ID</CFormLabel>
                        <CustomCFormInput name="loginId" type="email" maxLength="255" />
                      </CCol>
                      <CCol md={6} className="mb-4">
                        <CFormLabel>First name</CFormLabel>
                        <CustomCFormInput name="firstName" type="text" maxLength="255" />
                      </CCol>
                      <CCol md={6} className="mb-4">
                        <CFormLabel>Last name</CFormLabel>
                        <CustomCFormInput name="lastName" type="text" maxLength="255" />
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
