import React from 'react'
import { CFormSelect } from '@coreui/react'
const ItemPerPage = ({ onItemPerPageChange }) => {
  return (
    <CFormSelect
      aria-label="Default select example"
      options={[
        { label: `5 items/page`, value: 5 },
        { label: `10 items/page`, value: 10 },
        { label: `20 items/page`, value: 20 },
        { label: `25 items/page`, value: 25 },
        { label: `50 items/page`, value: 50 },
        { label: `100 items/page`, value: 100 },
      ]}
      onChange={onItemPerPageChange}
    />
  )
}

export default ItemPerPage
