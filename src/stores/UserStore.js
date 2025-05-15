import { makeAutoObservable, runInAction } from 'mobx'
import api from '../utils/api'

class UserStore {
  users = []
  isLoading = false
  userDetail = null
  userDetailByMe = null
  page = 1
  totalPages = 1

  constructor() {
    makeAutoObservable(this)
  }

  getUsers = async (
    sortColumn = 'fullName',
    sortOrder = 'asc',
    searchString = '',
    page = 1,
    fromDate = '',
    toDate = '',
    itemPerPage = 10,
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
      }

      const queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')

      const res = await api.get(`/users/list?${queryString}`)

      runInAction(() => {
        this.users = [...res.data.listUsers]
        this.currentPage = res.data.currentPage
        this.totalPages = res.data.totalPages
      })
    } catch (error) {
      throw error
    } finally {
      runInAction(() => {})
    }
  }

  setPage = (page) => {
    this.page = page
    this.getUsers()
  }

  getUserByUserCode = async (userCode) => {
    try {
      const res = await api.get(`/users/${userCode}`)
      const data = res.data.userData

      runInAction(() => {
        this.userDetail = data
      })
    } catch (error) {
      throw error
    } finally {
      runInAction(() => {})
    }
  }
  getUserByMe = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }
      const res = await api.get(`/users/me`)
      const data = res.data.userData

      runInAction(() => {
        this.userDetailByMe = data
        this.userDetailByMe.mustChangePassword = res.data.mustChangePassword
      })
    } catch (error) {
      throw error
    } finally {
      runInAction(() => {})
    }
  }
  createUser = async (data) => {
    try {
      await api.post(`/users/create`, data)
    } catch (error) {
      throw error
    } finally {
      runInAction(() => {})
    }
  }

  updateUser = async (data) => {
    try {
      await api.put(`/users/update`, data)
    } catch (error) {
      throw error
    } finally {
      runInAction(() => {})
    }
  }

  clearUserDetail = () => {
    this.userDetail = null
    this.userDetailByMe = null
  }

  deleteUser = async (id) => {
    this.isLoading = false
    try {
      await api.delete(`/users/delete/${id}`)
    } catch (error) {
      throw error
    } finally {
      runInAction(() => {})
    }
  }

  forgotPasswordUser = async (email, navigate) => {
    try {
      await api.put(`/users/forgot-password`, { email })
      navigate(`/login`)
    } catch (error) {
      throw error
    } finally {
      runInAction(() => {})
    }
  }

  resetPasswordUser = async (password, token, navigate) => {
    try {
      await api.put(`/users/reset-password`, { password, token })
      navigate(`/login`)
    } catch (error) {
      throw error
    } finally {
      runInAction(() => {})
    }
  }

  updatePasswordUser = async (data) => {
    try {
      await api.put(`/users/change-password`, data)
    } catch (error) {
      throw error
    } finally {
      runInAction(() => {})
    }
  }
}

export const userStore = new UserStore()
