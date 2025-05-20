import { makeAutoObservable, runInAction } from 'mobx'
import { toast } from 'react-toastify'
import api from '../utils/api'
import encryptPassword from '../utils/encryptPassword'
import { userStore } from './UserStore'
import { redirect } from 'react-router-dom'

const expiryMinutesToken = import.meta.env.VITE_EXPIRY_TOKEN

class AuthStore {
  constructor() {
    makeAutoObservable(this)
  }

  login = async (data, navigate) => {
    try {
      // Encrypt password.
      const encryptedPassword = encryptPassword(data.password)
      data = { ...data, password: encryptedPassword }
      const res = await api.post(`/login`, data)

      // Set token and expiry token.
      const expiryToken = Date.now() + expiryMinutesToken * 60 * 1000
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('expiryToken', expiryToken)
      localStorage.setItem('refreshToken', res.data.refreshToken)

      navigate('/admins/me')
    } catch (error) {
      throw error
    } finally {
      runInAction(() => {})
    }
  }

  logout = async () => {
    try {
      await api.post(`/logout`)
      userStore.clearUserDetail()
      redirect('/login')
    } catch (error) {}
  }
}

export const authStore = new AuthStore()
