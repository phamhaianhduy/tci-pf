import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import { toast } from 'react-toastify';
import verifyTokenExpiry from '../utils/verifyTokenExpiry';

const endpoint = process.env.REACT_APP_RDS_END_POINT;

class UserStore {
  users = [];
  isLoading = false;
  userDetail = null;
  userDetailByMe = null;
  page = 1;
  totalPages = 1;
  constructor() {
    makeAutoObservable(this);
  }

  getUsers = async (
    sortColumn = 'fullName',
    sortOrder = 'asc',
    searchString = '',
    page = 1,
    fromDate = '',
    toDate = ''
  ) => {
    this.isLoading = true;
    try {
      // Verify token.
      const token = localStorage.getItem('token');
      verifyTokenExpiry(token);

      const res = await axios.post(
        `${endpoint}/users/list`,
        { sortColumn, sortOrder, searchString, page, fromDate, toDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      runInAction(() => {
        this.users = [...res.data.data.listUsers];
        this.currentPage = res.data.data.currentPage;
        this.totalPages = res.data.data.totalPages;
      });
    } catch (error) {
      toast.warn('Fetch failed');
      console.error('Fetch failed', error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  setPage = (page) => {
    this.page = page;
    this.getUsers();
  };

  getUserByUserCode = async (userCode) => {
    this.isLoading = true;
    try {
      // Verify token.
      const token = localStorage.getItem('token');
      verifyTokenExpiry(token);

      const res = await axios.get(
        `${endpoint}/users/${userCode}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = res.data.data;
      runInAction(() => {
        this.userDetail = data;
      });
    } catch (error) {
      toast.warn('Fetch failed');
      console.error('Fetch failed', error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };
  getUserByMe = async () => {
    this.isLoading = true;
    try {
      // Verify token.
      const token = localStorage.getItem('token');
      verifyTokenExpiry(token);

      const res = await axios.get(
        `${endpoint}/users/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = res.data.data;
      runInAction(() => {
        this.userDetailByMe = data;
      });
    } catch (error) {
      toast.warn('Fetch failed');
      console.error('Fetch failed', error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };
  createUser = async (data, navigate) => {
    this.isLoading = true;

    // Verify token.
    const token = localStorage.getItem('token');
    verifyTokenExpiry(token);

    try {
      await axios.post(
        `${endpoint}/users/create`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Created Successfully!');

      navigate('/users');
      
    } catch (error) {
      toast.warn('Failed create user!');
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  updateUser = async (data, navigate) => {
    this.isLoading = true;

    // Verify token.
    const token = localStorage.getItem('token');
    verifyTokenExpiry(token);

    try {
      const res = await axios.put(
        `${endpoint}/users/update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = res.data.data;
      runInAction(() => {
        const index = this.users.findIndex((u) => u.id === updatedUser.id);
        if (index !== -1) {
          this.users.splice(index, 1, updatedUser);
        }
      });

      navigate(`/users`);
      toast.success('Updated Successfully!');

    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  clearUserDetail = () => {
    this.userDetail = null;
  };

  deleteUser = async (id, navigate) => {
    this.isLoading = false;

    // Verify token.
    const token = localStorage.getItem('token');
    verifyTokenExpiry(token);
  
    try {
      await axios.delete(
        `${endpoint}/users/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Deleted Successfully!');
      navigate(`/users`);
    } catch (error) {
      toast.warn('Failed deleted!');
      console.error('Failed deleted', error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  forgotPasswordUser = async (email) => {
    this.isLoading = true;
    try {
      const res = await axios.put(
        `${endpoint}/users/forgot-password`,
        { email }
      );
      alert(res.data.message);
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  resetPasswordUser = async (password, token, navigate) => {
    this.isLoading = true;
    try {
      await axios.put(
        `${endpoint}/users/reset-password`,
        { password, token }
      );
      toast.success("Reset password successfully!");
      navigate(`/login`);
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  updateExpiredPasswordUser = async (data, navigate) => {
  
    // Verify token.
    const token = localStorage.getItem('token');
    verifyTokenExpiry(token);

    try {
      await axios.put(
        `${endpoint}/users/change-password`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Updated password successfully!');
      localStorage.removeItem('token');
      navigate(`/users/`);
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };
}

export const userStore = new UserStore();
