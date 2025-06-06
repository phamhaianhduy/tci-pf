import { makeAutoObservable, runInAction } from 'mobx'
import api from '../utils/api'
import logout from '../utils/logout'

class UserStore {
  users = []
  isLoading = false
  userDetail = null
  userDetailByMe = null
  page = 1
  totalPages = 1
  hasFetchedMe = false

  constructor() {
    makeAutoObservable(this)
  }

  getUsers = async (
    sortColumn = 'firstName',
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
        this.totals = res.data.totalUsers
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
      logout()
      throw error
    } finally {
      runInAction(() => {})
    }
  }
  getUserByMe = async () => {
    if (this.hasFetchedMe) {
      return
    }

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
        this.hasFetchedMe = true
      })
    } catch (error) {
      logout()
      throw error
    } finally {
      runInAction(() => {})
    }
  }
  createUser = async (data, navigate) => {
    try {
      await api.post(`/users/create`, data)
      navigate('/admins')
    } catch (error) {
      throw error
    } finally {
      runInAction(() => {})
    }
  }

  updateUser = async (data, navigate) => {
    try {
      await api.put(`/users/update`, data)
      navigate('/admins')
      this.getUserByMe()
    } catch (error) {
      throw error
    } finally {
      runInAction(() => {})
    }
  }

  clearUserDetail = () => {
    this.userDetail = null
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

  forgotPasswordUser = async (loginId, navigate) => {
    try {
      await api.put(`/users/forgot-password`, { loginId })
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

  updatePasswordUser = async (data, navigate) => {
    try {
      const res = await api.put(`/users/change-password`, data)
      const newAccessToken = res.data.token
      localStorage.setItem('token', newAccessToken)
      navigate('/admins')
    } catch (error) {
      throw error
    } finally {
      runInAction(() => {
        userStore.userDetailByMe.mustChangePassword = false
        userStore.userDetailByMe.requiredChangePassword = false
      })
    }
  }

  blockUser = async (userId, navigate) => {
    try {
      await api.put(`/users/block`, { userId })
      navigate('/admins')
    } catch (error) {
      throw error
    } finally {
      runInAction(() => {})
    }
  }
}

export const userStore = new UserStore()
