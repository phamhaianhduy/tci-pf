import React, { useEffect, useState } from 'react';
import classes from './Log.module.css';
import { observer } from 'mobx-react-lite';
import { logStore } from '../../../stores/LogStore';
import dayjs from 'dayjs';
import Button from 'react-bootstrap/esm/Button';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col } from 'react-bootstrap';

const LogList = () => {
  const searchSchema = Yup.object().shape({
    searchString: Yup.string(),
    fromDate: Yup.date().typeError('Invalid date'),
    toDate: Yup.date().typeError('Invalid date'),
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchString, setSearchString] = useState('');
  const [searchKeyword, setSearchKeyword] = useState(searchString);
  const [sortColumn, setSortColumn] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    logStore.getLogs(
      sortColumn,
      sortOrder,
      searchKeyword,
      currentPage,
      fromDate,
      toDate,
    );
  }, [sortColumn, sortOrder, searchKeyword, currentPage, fromDate, toDate]);

  const handleSearchChange = (e) => {
    setSearchString(e.target.value.toLowerCase());
  };

  const handleSort = (field) => {
    if (field === sortColumn) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(field);
      setSortOrder('asc');
    }
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
    setSortColumn('timestamp');
    setSortOrder('desc');
    setCurrentPage(1);
  }

  const handlePageChange = (page) => setCurrentPage(page);

  // Search
  const handleSubmitSearch = (values) => {
    setFromDate(
      values.fromDate
        ? dayjs(values.fromDate).format('YYYY-MM-DD 00:00:00')
        : null
    );

    setToDate(
      values.toDate ? dayjs(values.toDate).format('YYYY-MM-DD 23:59:59') : null
    );

    setSearchKeyword(searchString);
    setCurrentPage(1);
  };

  const currentLogs = logStore.logs;
  const totalPages = logStore.totalPages;

  const renderSortIcon = (field) => {
    if (sortColumn !== field) return '⇅';
    return sortOrder === 'asc' ? '↑' : '↓';
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
      <h2>Log List</h2>
      <Formik
        initialValues={{
          searchString: '',
          fromDate: '',
          toDate: '',
        }}
        validationSchema={searchSchema}
        onSubmit={handleSubmitSearch}
      >
        {({ setFieldValue }) => (
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
                    variant='secondary'
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
              className={classes['col-20']}
            >
              Fullname {renderSortIcon('fullName')}
            </th>
            <th
              onClick={() => handleSort('email')}
              style={{ cursor: 'pointer' }}
              className={classes['col-20']}
            >
              Email {renderSortIcon('email')}
            </th>
            <th className={classes['col-20']}>Action</th>
            <th className={classes['col-20']}>Description</th>
            <th
              onClick={() => handleSort('timestamp')}
              style={{ cursor: 'pointer' }}
              className={classes['col-20']}
            >
              Timestamp {renderSortIcon('timestamp')}
            </th>
          </tr>
        </thead>
        <tbody>
          {!logStore.isLoading && currentLogs.length === 0 && (
            <tr>
              <td colSpan='5' style={{ textAlign: 'center', padding: '20px' }}>
                No logs found.
              </td>
            </tr>
          )}
          {!logStore.isLoading &&
            currentLogs.length > 0 &&
            currentLogs.map((log) => (
              <tr key={log.id}>
                <td className={classes['col-20']}>{log.user.fullName}</td>
                <td className={classes['col-20']}>{log.user.email}</td>
                <td className={classes['col-20']}>{log.action}</td>
                <td className={classes['col-20']}>{log.description}</td>
                <td className={classes['col-20']}>
                  {dayjs(log.timestamp).format('YYYY/MM/DD HH:mm:ss')}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className={classes['pagination']}>{pagination()}</div>
    </div>
  );
};

export default observer(LogList);
