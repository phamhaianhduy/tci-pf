import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';

const endpoint = process.env.REACT_APP_RDS_END_POINT;

class LogStore {
  logs = [];
  isLoading = false;
  page = 1;
  totalPages = 1;

  constructor() {
    makeAutoObservable(this);
  }

  getLogs = async (
    sortColumn = 'timestamp',
    sortOrder = 'desc',
    searchString = '',
    page = 1,
    fromDate = '',
    toDate = '',
    itemPerPage = 5,
  ) => {
    this.isLoading = true;
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.warn('Access denied');
        return;
      }

      const res = await axios.post(
        `${endpoint}/logs/list`,
        { sortColumn, sortOrder, searchString, page, fromDate, toDate, itemPerPage, token },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      runInAction(() => {
        this.logs = res.data.data.listLogs;
        this.currentPage = res.data.data.currentPage;
        this.totalPages = res.data.data.totalPages;
      });
    } catch (error) {
      console.error('Fetch failed', error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  setPage = (page) => {
    this.page = page;
    this.getLogs();
  };

  createLog = async (data, navigate) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'https://t78tx3ksfj.execute-api.ap-southeast-1.amazonaws.com/dev/logs/create',
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Created Successfully!');
      if (!token) {
        navigate('/login');
      } else {
        navigate('/logs');
      }
    } catch (error) {
      console.error('Create failed', error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  clearLogDetail = () => {
    this.userDetail = null;
  };
}

export const logStore = new LogStore();
