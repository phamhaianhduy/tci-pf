import React, { useEffect, useState } from 'react';
import classes from './Users.module.css';
import { observer } from 'mobx-react-lite';
import { userStore } from '../../../stores/UserStore';
import { Spinner } from 'react-bootstrap';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col } from 'react-bootstrap';
import { Pencil, Trash2 } from "lucide-react";

const UserList = observer(() => {
  const searchSchema = Yup.object().shape({
    searchString: Yup.string(),
    fromDate: Yup.date().typeError('Invalid date'),
    toDate: Yup.date().typeError('Invalid date'),
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchString, setSearchString] = useState('');
  const [searchKeyword, setSearchKeyword] = useState(searchString);
  const [sortColumn, setSortColumn] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    userStore.getUsers(
      sortColumn,
      sortOrder,
      searchKeyword,
      currentPage,
      fromDate,
      toDate
    );

  }, [sortColumn, sortOrder, searchKeyword, currentPage, fromDate, toDate]);

  useEffect(() => {
    // const dispose = autorun(() => {
      if (userStore.isReloadUsers) {
        userStore.getUsers();
        userStore.isReloadUsers = false;
      }
    // });
  
    // return () => dispose();
  }, []);

  const navigate = useNavigate();

  // Search
  const handleSubmitSearch = (values) => {
    setFromDate(values.fromDate
      ? dayjs(values.fromDate).format('YYYY-MM-DD 00:00:00')
      : null);

    setToDate(values.toDate
      ? dayjs(values.toDate).format('YYYY-MM-DD 23:59:59')
      : null);

    setSearchKeyword(searchString);
    setCurrentPage(1);
  };

  // Reset
  const handleReset = (setFieldValue) => {
    setFieldValue('fromDate', '');
    setFieldValue('toDate', '');
    setFieldValue('searchString', '');
    setFromDate('');
    setToDate('');
    setSearchString('');
    setSearchKeyword('');
    setSortColumn('updatedAt');
    setSortOrder('desc');
  }

  // Sort
  const handleSort = (field) => {
    if (field === sortColumn) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(field);
      setSortOrder('asc');
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchString(value);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  // const usersList = toJS(userStore.users);
  const totalPages = userStore.totalPages;

  const renderSortIcon = (field) => {
    if (sortColumn !== field) return '⇅';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const handleDelete = async (e) => {
    const confirmDelete = window.confirm('Are you sure delete this use?');
    if (!confirmDelete) {
      return;
    }

    const id = e.target.value;
    await userStore.deleteUser(id, navigate);
    await userStore.getUsers();
  };

  const pagination = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          className={currentPage === i ? classes['active'] : ''}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className={classes['table-container']}>
      <h2>User List</h2>
      <Formik
        initialValues={{
          searchString: '',
          fromDate: '',
          toDate: '',
        }}
        validationSchema={searchSchema}
        onSubmit={handleSubmitSearch}
      >
        {({setFieldValue, resetForm}) => (
          <Form style={{ display: 'flex', gap: '10px' }}>
            <Container className='mb-4'>
              <Row>
                <Col md={4}>
                  <Field
                    name='searchString'
                    type='text'
                    placeholder='Search by fullname or email...'
                    className={classes['search-input']}
                    onChange={handleSearchChange}
                    value={searchString}
                  />
                  <ErrorMessage
                    name='searchString'
                    component='div'
                    style={{ color: 'red' }}
                  />
                </Col>
                <Col md={4}>
                  {' '}
                  <Field type='date' name='fromDate' placeholder='From date' />
                  <ErrorMessage
                    name='fromDate'
                    component='div'
                    style={{ color: 'red' }}
                  />
                </Col>
                <Col md={4}>
                  {' '}
                  <Field type='date' name='toDate' placeholder='To date' />
                  <ErrorMessage
                    name='toDate'
                    component='div'
                    style={{ color: 'red' }}
                  />
                </Col>
                <Col md={12}>
                  <Button
                    className={`${classes['btn-submit']} + ' mt-4 mb-4'`}
                    type='submit'
                    onClick={() => setSearchKeyword(searchString)}
                  >
                    Search
                  </Button>&nbsp;
                  <Button
                    className={`${classes['btn-submit']} + ' mt-4 mb-4'`}
                    type='button'
                    onClick={() => handleReset(setFieldValue)}
                  >
                    Reset
                  </Button>
                </Col>
              </Row>
            </Container>
          </Form>
        )}
      </Formik>

      <table>
        <thead>
          <tr>
            <th
              onClick={() => handleSort('fullName')}
              style={{ cursor: 'pointer' }}
              className={classes['col-25']}
            >
              Fullname {renderSortIcon('fullName')}
            </th>
            <th
              onClick={() => handleSort('email')}
              style={{ cursor: 'pointer' }}
              className={classes['col-25']}
            >
              Email {renderSortIcon('email')}
            </th>
            <th
              onClick={() => handleSort('updatedAt')}
              style={{ cursor: 'pointer' }}
              className={classes['col-25']}
            >
              Updated at {renderSortIcon('updatedAt')}
            </th>
            <th className={classes['col-25']}>Action</th>
          </tr>
        </thead>
        <tbody>
          {userStore.isLoading && (
            <tr>
              <td colSpan='4' style={{ textAlign: 'center', padding: '20px' }}>
                <Spinner animation='border' variant='primary' />
                <div>Loading data...</div>
              </td>
            </tr>
          )}
          {!userStore.isLoading && userStore.users.length === 0 && (
            <tr>
              <td colSpan='4' style={{ textAlign: 'center', padding: '20px' }}>
                No users found.
              </td>
            </tr>
          )}
          {!userStore.isLoading &&
            userStore.users.length > 0 &&
            userStore.users.map((user) => (
              <tr key={user.id}>
                <td className={classes['col-25']}>{user.fullName}</td>
                <td className={classes['col-25']}>{user.email}</td>
                <td className={classes['col-25']}>
                  {dayjs(user.createdAt).format('YYYY/MM/DD HH:mm:ss')}
                </td>
                <td className={classes['col-25']}>
                  <Button
                    href={`/users/${user.userCode}/edit`}
                    className={classes['edit-btn']}
                  >
                    <Pencil strokeWidth={0.75} />
                  </Button>
                  <Button
                    className={classes['delete-btn']}
                    onClick={handleDelete}
                    value={user.id}
                    variant='danger'
                  >
                    <Trash2 strokeWidth={0.75} />
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className={classes['pagination']}>{pagination()}</div>
    </div>
  );
});

export default UserList;
