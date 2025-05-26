import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CContainer,
  CButton,
  CFormLabel
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { logStore } from '../../../stores/LogStore'
import dayjs from 'dayjs'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import CustomCFormInput from '../../../components/CustomCFormInput/CustomCFormInput'
import Pagination from '../../../components/Pagination/Pagination'
import ItemPerPage from '../../../components/ItemPerPage/ItemPerPage'

const LogList = () => {
  const searchSchema = Yup.object().shape({
    searchString: Yup.string(),
    fromDate: Yup.date().typeError('Invalid date'),
    toDate: Yup.date().typeError('Invalid date'),
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [searchString, setSearchString] = useState('')
  const [searchKeyword, setSearchKeyword] = useState(searchString)
  const [sortColumn, setSortColumn] = useState('timestamp')
  const [sortOrder, setSortOrder] = useState('desc')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [itemPerPage, setitemPerPage] = useState(5)

  useEffect(() => {
    logStore.getLogs(
      sortColumn,
      sortOrder,
      searchKeyword,
      currentPage,
      fromDate,
      toDate,
      itemPerPage,
    )
  }, [sortColumn, sortOrder, searchKeyword, currentPage, fromDate, toDate, itemPerPage])

  const handleItemPerPageChange = (e) => {
    const value = e.target.value
    setitemPerPage(value)
    setCurrentPage(1)
  }

  const handleSort = (field) => {
    if (field === sortColumn) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(field)
      setSortOrder('asc')
    }
  }

  // Reset
  const handleReset = (setFieldValue) => {
    setFieldValue('fromDate', '')
    setFieldValue('toDate', '')
    setFieldValue('searchString', '')
    setFromDate('')
    setToDate('')
    setSearchString('')
    setSearchKeyword('')
    setSortColumn('timestamp')
    setSortOrder('desc')
    setCurrentPage(1)
  }

  const handlePageChange = (page) => setCurrentPage(page)

  // Search
  const handleSubmitSearch = (values) => {
    setFromDate(values.fromDate ? dayjs(values.fromDate).format('YYYY-MM-DD 00:00:00') : null)

    setToDate(values.toDate ? dayjs(values.toDate).format('YYYY-MM-DD 23:59:59') : null)

    setSearchKeyword(searchString)
    setCurrentPage(1)
  }

  const totalPages = logStore.totalPages

  const renderSortIcon = (field) => {
    if (sortColumn !== field) return '⇅'
    return sortOrder === 'asc' ? '↑' : '↓'
  }

  const loglist = logStore.logs
  return (
    <CRow>
      <CCol xs={12}>
        <Formik
          initialValues={{
            searchString: '',
            fromDate: '',
            toDate: '',
          }}
          validationSchema={searchSchema}
          onSubmit={handleSubmitSearch}
        >
          {({ setFieldValue, resetForm, values }) => (
            <Form style={{ display: 'flex', gap: '10px' }}>
              <CContainer>
                <CRow>
                  <CCol md={4}>
                    <CFormLabel className="fw-bold">
                      String
                    </CFormLabel>
                    <CustomCFormInput
                      name="searchString"
                      placeholder="Search by action, Login ID, description"
                      autoComplete="searchString"
                      type="text"
                      value={values.searchString}
                      onChange={(e) => {
                        setFieldValue('searchString', e.target.value)
                        setSearchString(e.target.value)
                      }}
                      className="mb-4"
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel className="fw-bold">
                      From (Updated At)
                    </CFormLabel>
                    <CustomCFormInput name="fromDate" type="date" className="mb-4" />
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel className="fw-bold">
                      To (Updated At)
                    </CFormLabel>
                    <CustomCFormInput name="toDate" type="date" className="mb-4" />
                  </CCol>
                  <CCol md={12}>
                    <CButton
                      type="submit"
                      onClick={() => setSearchKeyword(searchString)}
                      color="primary"
                    >
                      Search
                    </CButton>
                    &nbsp;
                    <CButton
                      type="button"
                      onClick={() => handleReset(setFieldValue)}
                      color="primary"
                    >
                      Reset
                    </CButton>
                  </CCol>
                </CRow>
              </CContainer>
            </Form>
          )}
        </Formik>
        <CCard className="mb-4 mt-4">
          <CCardHeader>
            <strong>Log List</strong>
          </CCardHeader>
          <CCardBody>
            <CTable striped responsive style={{ tableLayout: 'fixed' }}>
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell
                    scope="col"
                    onClick={() => handleSort('loginId')}
                    role="button"
                    style={{ cursor: 'pointer', width: '30%' }}
                  >
                    Login ID {renderSortIcon('loginId')}
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    onClick={() => handleSort('action')}
                    role="button"
                    style={{ cursor: 'pointer', width: '15%' }}
                  >
                    Action {renderSortIcon('action')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    onClick={() => handleSort('timestamp')}
                    role="button"
                    style={{ cursor: 'pointer', width: '20%' }}
                  >
                    Timestamp {renderSortIcon('timestamp')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {loglist.length > 0 ? (
                  loglist.map((log) => (
                    <CTableRow key={log.id}>
                      <CTableDataCell>{log.user.loginId}</CTableDataCell>
                      <CTableDataCell>{log.action}</CTableDataCell>
                      <CTableDataCell>{log.description}</CTableDataCell>
                      <CTableDataCell>
                        {dayjs(log.timestamp).format('YYYY/MM/DD HH:mm:ss')}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={4} style={{ textAlign: 'center' }}>
                      No data.
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md={10}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          maxPagesToShow={5}
          onPageChange={handlePageChange}
        />
      </CCol>
      <CCol md={2}>
        <ItemPerPage onItemPerPageChange={handleItemPerPageChange} />
      </CCol>
    </CRow>
  )
}

export default observer(LogList)
