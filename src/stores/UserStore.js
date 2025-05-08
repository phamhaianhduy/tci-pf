import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "react-toastify";
import api from "../utils/api";

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
    sortColumn = "fullName",
    sortOrder = "asc",
    searchString = "",
    page = 1,
    fromDate = "",
    toDate = "",
    itemPerPage = 10
  ) => {
    try {
      const params = {
        sortColumn,
        sortOrder,
        searchString,
        page,
        fromDate,
        toDate,
        itemPerPage,
      };

      const queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");

      const res = await api.get(`/users/list?${queryString}`);

      runInAction(() => {
        this.users = [...res.data.listUsers];
        this.currentPage = res.data.currentPage;
        this.totalPages = res.data.totalPages;
      });
    } catch (error) {
      toast.warn("Fetch failed");
      console.error("Fetch failed", error);
    } finally {
      runInAction(() => {});
    }
  };

  setPage = (page) => {
    this.page = page;
    this.getUsers();
  };

  getUserByUserCode = async (userCode) => {
    try {
      const res = await api.get(`/users/${userCode}`);
      const data = res.data.userData;

      runInAction(() => {
        this.userDetail = data;
      });
    } catch (error) {
      toast.warn("Fetch failed");
      console.error("Fetch failed", error);
    } finally {
      runInAction(() => {});
    }
  };
  getUserByMe = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const res = await api.get(`/users/me`);
      const data = res.data.userData;

      runInAction(() => {
        this.userDetailByMe = data;
      });
    } catch (error) {
      toast.warn("Fetch failed");
      console.error("Fetch failed", error);
    } finally {
      runInAction(() => {});
    }
  };
  createUser = async (data, navigate) => {
    try {
      await api.post(`/users/create`, data);

      toast.success("Created Successfully!");

      navigate("/users");
    } catch (error) {
      toast.warn("Failed create user!");
      throw error;
    } finally {
      runInAction(() => {});
    }
  };

  updateUser = async (data, navigate) => {
    try {
      const res = await api.put(`/users/update`, data);

      const updatedUser = res.data.data;
      runInAction(() => {
        const index = this.users.findIndex((u) => u.id === updatedUser.id);
        if (index !== -1) {
          this.users.splice(index, 1, updatedUser);
        }
      });

      navigate(`/users`);
      toast.success("Updated Successfully!");
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {});
    }
  };

  clearUserDetail = () => {
    this.userDetail = null;
  };

  deleteUser = async (id, navigate) => {
    this.isLoading = false;
    try {
      await api.delete(`/users/delete/${id}`);

      toast.success("Deleted Successfully!");
      navigate(`/users`);
    } catch (error) {
      toast.warn("Failed deleted!");
      console.error("Failed deleted", error);
    } finally {
      runInAction(() => {});
    }
  };

  forgotPasswordUser = async (email, navigate) => {
    try {
      const res = await api.put(`/users/forgot-password`, { email });
      toast.success(res.data.message);
      navigate(`/login`);
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {});
    }
  };

  resetPasswordUser = async (password, token, navigate) => {
    try {
      await api.put(`/users/reset-password`, { password, token });
      toast.success("Reset password successfully!");
      navigate(`/login`);
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {});
    }
  };

  updateExpiredPasswordUser = async (data, navigate) => {
    try {
      await api.put(`/users/change-password`, data);
      toast.success("Updated password successfully!");
      localStorage.removeItem("token");
      navigate(`/users/`);
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {});
    }
  };
}

export const userStore = new UserStore();
