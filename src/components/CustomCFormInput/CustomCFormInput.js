import React from 'react'
import { useField } from 'formik'
import { CFormInput, CFormFeedback } from '@coreui/react'
const CustomCFormInput = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  return (
    <div>
      <CFormInput {...field} {...props} invalid={meta.touched && !!meta.error} />
      {meta.touched && meta.error && (
        <CFormFeedback
          className="d-block"
          style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}
        >
          {meta.error}
        </CFormFeedback>
      )}
    </div>
  )
}
export default CustomCFormInput
