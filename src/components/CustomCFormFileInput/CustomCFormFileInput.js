import React, { useEffect, useState } from 'react'
import { useField } from 'formik'
import { CFormLabel, CFormInput, CFormFeedback } from '@coreui/react'

const CustomCFormFileInput = ({ label, initialImageUrl = null, onDelete = null, ...props }) => {
  const [field, meta, helpers] = useField(props)
  const [previewUrl, setPreviewUrl] = useState(initialImageUrl)
  const [showPreview, setShowPreview] = useState(!!initialImageUrl)

  useEffect(() => {
    if (field.value instanceof File) {
      const objectUrl = URL.createObjectURL(field.value)
      setPreviewUrl(objectUrl)
      setShowPreview(true)
      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [field.value])

  const handleChange = (event) => {
    const file = event.currentTarget.files[0]
    if (file) {
      helpers.setValue(file)
      setShowPreview(true)
    }
  }

  const handleRemove = () => {
    helpers.setValue(null)
    setPreviewUrl(null)
    setShowPreview(false)
    if (onDelete) onDelete()
  }

  return (
    <div className="mb-3">
      {label && (
        <CFormLabel htmlFor={props.id || props.name} className="fw-bold">
          {label}
        </CFormLabel>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <CFormInput
          type="file"
          {...props}
          id={props.id || props.name}
          onChange={handleChange}
          invalid={meta.touched && !!meta.error}
        />

        {showPreview && previewUrl && (
          <div style={{ position: 'relative', display: 'inline-block', width: 'fit-content' }}>
            <img
              src={previewUrl}
              alt="preview"
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '8px',
                objectPosition: 'center'
              }}
            />
            <button
              type="button"
              onClick={handleRemove}
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                fontWeight: 'bold',
                lineHeight: '18px',
              }}
            >
              &times;
            </button>
          </div>
        )}
      </div>

      {meta.touched && meta.error && (
        <CFormFeedback className="d-block mt-1">{meta.error}</CFormFeedback>
      )}
    </div>
  )
}

export default CustomCFormFileInput
