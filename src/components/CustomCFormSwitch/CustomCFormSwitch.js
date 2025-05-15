import React from 'react'
import { useField } from 'formik'
import { CFormSwitch, CFormLabel, CFormFeedback } from '@coreui/react'

const CustomCFormSwitch = ({ label, ...props }) => {
  const [field, meta, helpers] = useField({ ...props, type: 'checkbox' })

  return (
    <div className="mb-3">
      <CFormSwitch
        {...field}
        {...props}
        id={props.id || props.name}
        checked={field.value}
        onChange={(e) => helpers.setValue(e.target.checked)}
        invalid={meta.touched && !!meta.error}
      />
      {meta.touched && meta.error && (
        <CFormFeedback className="d-block">{meta.error}</CFormFeedback>
      )}
    </div>
  )
}

export default CustomCFormSwitch
