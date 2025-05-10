import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "react-toastify";
import api from "../utils/api";
import encryptPassword from '../utils/encryptPassword';
import { userStore } from "./UserStore";

class AuthStore {
  constructor() {
    makeAutoObservable(this);
  }

  login = async (data, navigate) => {
    try {
      // Encrypt password.
      const encryptedPassword = encryptPassword(data.password);
      data = {...data, password: encryptedPassword};
      const res = await api.post(`/login`, data);

      // Set token and expiry token.
      const minutes = 15;
      const expiryToken = Date.now() + minutes * 60 * 1000;
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('expiryToken', expiryToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);


    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {});
    }
  };

  logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await api.post(
        `/logout`,
        { refreshToken },
      );
      userStore.clearUserDetail();
    } catch (error) {
      toast.warn("Logout failed!");
      console.error("Logout failed", error);
    }

  }
}

export const authStore = new AuthStore();
