import axios from 'axios'
import { toast } from 'react-toastify'
import verifyTokenExpiry from './verifyTokenExpiry'
import { loadingStore } from '../stores/LoadingStore'
import logout from './logout'
import redirect from './redirect'

const api = axios.create({
  baseURL: import.meta.env.VITE_RDS_END_POINT,
})

// Request
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      await verifyTokenExpiry(token)
      const newToken = localStorage.getItem('token')
      config.headers.Authorization = `Bearer ${newToken}`
    }

    loadingStore.startLoading()
    return config
  },
  (error) => {
    loadingStore.stopLoading()
    return Promise.reject(error)
  },
)

// Response
api.interceptors.response.use(
  (response) => {
    loadingStore.stopLoading()

    const code = response?.data?.code
    const message = response?.data?.message

    switch (code) {
      case 'LOGIN':
        break
      case 'LOGOUT':
        toast.success(message)
        logout()
        break
      default:
        toast.success(message)
    }

    return response
  },
  (error) => {
    loadingStore.stopLoading()

    const code = error?.response?.data?.code
    const message = error?.response?.data?.message

    switch (code) {
      case 'EXPIRED_TOKEN':
        toast.warn(message)
        logout()
        break
      case 'INTERNAL_SERVER_ERROR':
      case 'USER_BLOCKED':
        toast.error(message)
        break
      default:
        toast.warn(message)
    }

    return Promise.reject(error)
  },
)

export default api
