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
import ItemPerPage from '../../../components/ItemPerPage/ItemPerPage'
import { useNavigate } from 'react-router-dom'

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
  const [itemPerPage, setitemPerPage] = useState(5)

  const navigate = useNavigate()

  useEffect(() => {
    userStore.getUsers(
      sortColumn,
      sortOrder,
      searchKeyword,
      currentPage,
      fromDate,
      toDate,
      itemPerPage,
    )
  }, [sortColumn, sortOrder, searchKeyword, currentPage, fromDate, toDate, itemPerPage])

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

  const handleItemPerPageChange = (e) => {
    const value = e.target.value
    setitemPerPage(value)
    setCurrentPage(1)
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
    await userStore.getUsers(
      sortColumn,
      sortOrder,
      searchKeyword,
      currentPage,
      fromDate,
      toDate,
      itemPerPage,
    )
  }

  const handleDetailUser = async (id) => {
    navigate(`/users/${id}/edit`)
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
          {({ setFieldValue, values }) => (
            <Form style={{ display: 'flex', gap: '10px' }}>
              <CContainer>
                <CRow>
                  <CCol md={4}>
                    <CustomCFormInput
                      name="searchString"
                      placeholder="Input search string"
                      autoComplete="searchString"
                      type="text"
                      value={values.searchString}
                      onChange={(e) => {
                        setFieldValue('searchString', e.target.value.toLowerCase())
                        setSearchString(e.target.value.toLowerCase())
                      }}
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
            <strong>Admin List</strong>
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
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell
                    scope="col"
                    onClick={() => handleSort('firstName')}
                    role="button"
                  >
                    Fist name {renderSortIcon('firstName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    onClick={() => handleSort('lastName')}
                    role="button"
                  >
                    Last name {renderSortIcon('lastName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('loginId')} role="button">
                    Login ID {renderSortIcon('loginId')}
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    scope="col"
                    onClick={() => handleSort('employeeId')}
                    role="button"
                  >
                    Employee ID {renderSortIcon('employeeId')}
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
                      <CTableRow key={user.id}>
                        <CTableDataCell>{user.firstName}</CTableDataCell>
                        <CTableDataCell>{user.lastName}</CTableDataCell>
                        <CTableDataCell>{user.loginId}</CTableDataCell>
                        <CTableDataCell>{user.employeeId}</CTableDataCell>
                        <CTableDataCell>
                          {dayjs(user.updatedAt).format('YYYY/MM/DD HH:mm:ss')}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="primary"
                            variant="outline"
                            onClick={() => handleDetailUser(user.id)}
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
                    )
                  })}
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

export default observer(UserList)
