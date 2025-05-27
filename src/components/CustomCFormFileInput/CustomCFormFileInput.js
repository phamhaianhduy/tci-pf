import React, { useEffect, useRef, useState } from 'react'
import { useField } from 'formik'
import { CFormLabel, CFormFeedback } from '@coreui/react'

const CustomCFormFileInput = ({ label, initialImageUrl = null, onDelete = null, ...props }) => {
  const [field, meta, helpers] = useField(props)
  const [previewUrl, setPreviewUrl] = useState(initialImageUrl)
  const [showPreview, setShowPreview] = useState(!!initialImageUrl)
  const fileInputRef = useRef(null)

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

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="mb-3">
      {label && (
        <CFormLabel htmlFor={props.id || props.name} className="fw-bold">
          {label}
        </CFormLabel>
      )}

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleChange}
      />

      <div
        onClick={handleClick}
        style={{
          width: '150px',
          height: '150px',
          border: '2px dashed #aaa',
          borderRadius: '8px',
          cursor: 'pointer',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          backgroundImage: showPreview && previewUrl ? `url(${previewUrl})` : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#888',
        }}
      >
        {!showPreview && <span>Choose Image</span>}

        {showPreview && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleRemove()
            }}
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
        )}
      </div>

      {meta.touched && meta.error && (
        <CFormFeedback className="d-block mt-1">{meta.error}</CFormFeedback>
      )}
    </div>
  )
}

export default CustomCFormFileInput
