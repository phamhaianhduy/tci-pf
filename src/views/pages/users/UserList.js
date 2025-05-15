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
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { userStore } from '../../../stores/UserStore'
import dayjs from 'dayjs'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { UserRoundPen, UserRoundPlus, UserRoundMinus } from 'lucide-react'
import CustomCFormInput from '../../../components/CustomCFormInput/CustomCFormInput'
import Pagination from '../../../components/Pagination/Pagination'

const UserList = () => {
  const searchSchema = Yup.object().shape({
    searchString: Yup.string(),
    fromDate: Yup.date().typeError('Invalid date'),
    toDate: Yup.date().typeError('Invalid date'),
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [searchString, setSearchString] = useState('')
  const [searchKeyword, setSearchKeyword] = useState(searchString)
  const [sortColumn, setSortColumn] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  useEffect(() => {
    userStore.getUsers(sortColumn, sortOrder, searchKeyword, currentPage, fromDate, toDate)
  }, [sortColumn, sortOrder, searchKeyword, currentPage, fromDate, toDate])

  // Search
  const handleSubmitSearch = (values) => {
    setFromDate(values.fromDate ? dayjs(values.fromDate).format('YYYY-MM-DD 00:00:00') : null)

    setToDate(values.toDate ? dayjs(values.toDate).format('YYYY-MM-DD 23:59:59') : null)

    setSearchKeyword(searchString)
    setCurrentPage(1)
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
    setSortColumn('updatedAt')
    setSortOrder('desc')
  }

  // Sort
  const handleSort = (field) => {
    if (field === sortColumn) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(field)
      setSortOrder('asc')
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase()
    setSearchString(value)
  }

  const handlePageChange = (page) => setCurrentPage(page)

  const totalPages = userStore.totalPages

  const renderSortIcon = (field) => {
    if (sortColumn !== field) return '⇅'
    return sortOrder === 'asc' ? '↑' : '↓'
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure delete this use?')
    if (!confirmDelete) {
      return
    }
    await userStore.deleteUser(id)

    // Call api to refresh the user list.
    await userStore.getUsers(sortColumn, sortOrder, searchKeyword, currentPage, fromDate, toDate)
  }

  const userList = userStore.users
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
          {({ setFieldValue, resetForm }) => (
            <Form style={{ display: 'flex', gap: '10px' }}>
              <CContainer>
                <CRow>
                  <CCol md={4}>
                    <CustomCFormInput
                      name="searchString"
                      placeholder="Input search string"
                      autoComplete="searchString"
                      type="text"
                      onChange={handleSearchChange}
                      value={searchString}
                      className="mb-4"
                    />
                  </CCol>
                  <CCol md={4}>
                    <CustomCFormInput name="fromDate" type="date" className="mb-4" />
                  </CCol>
                  <CCol md={4}>
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
            <strong>User List</strong>
            <CButton
              className="float-end"
              type="button"
              href="/users/create"
              color="success"
              variant="outline"
            >
              <UserRoundPlus strokeWidth={1.5} />
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable striped>
              <CTableBody>
                <CTableHeaderCell colSpan={4}>
                  <CTable>
                    <CTableHead color="dark">
                      <CTableRow>
                        <CTableHeaderCell
                          scope="col"
                          onClick={() => handleSort('fullName')}
                          role="button"
                        >
                          Fullname {renderSortIcon('fullName')}
                        </CTableHeaderCell>
                        <CTableHeaderCell
                          scope="col"
                          onClick={() => handleSort('email')}
                          role="button"
                        >
                          Email {renderSortIcon('email')}
                        </CTableHeaderCell>
                        <CTableHeaderCell
                          scope="col"
                          onClick={() => handleSort('updatedAt')}
                          role="button"
                        >
                          Updated At {renderSortIcon('updatedAt')}
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {userList.length > 0 &&
                        userList.map((user) => {
                          return (
                            <>
                              <CTableRow>
                                <CTableHeaderCell scope="row">{user.fullName}</CTableHeaderCell>
                                <CTableDataCell>{user.email}</CTableDataCell>
                                <CTableDataCell>
                                  {dayjs(user.updatedAt).format('YYYY/MM/DD HH:mm:ss')}
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CButton
                                    href={`/users/${user.userCode}/edit`}
                                    color="primary"
                                    variant="outline"
                                  >
                                    <UserRoundPen strokeWidth={1.5} />
                                  </CButton>
                                  &nbsp;
                                  <CButton
                                    onClick={() => handleDelete(user.id)}
                                    value={user.id}
                                    color="danger"
                                    variant="outline"
                                  >
                                    <UserRoundMinus strokeWidth={1.5} />
                                  </CButton>
                                </CTableDataCell>
                              </CTableRow>
                            </>
                          )
                        })}
                    </CTableBody>
                  </CTable>
                </CTableHeaderCell>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        maxPagesToShow={5}
        onPageChange={handlePageChange}
      />
    </CRow>
  )
}

export default observer(UserList)
