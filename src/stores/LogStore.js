import { makeAutoObservable, runInAction } from 'mobx'
import api from '../utils/api'

class LogStore {
  logs = []
  page = 1
  totalPages = 1

  constructor() {
    makeAutoObservable(this)
  }

  getLogs = async (
    sortColumn = 'timestamp',
    sortOrder = 'desc',
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

      const res = await api.get(`/logs/list?${queryString}`)

      runInAction(() => {
        this.logs = res.data.listLogs
        this.currentPage = res.data.currentPage
        this.totalPages = res.data.totalPages
      })
    } catch (error) {
      console.error('Fetch failed', error)
    } finally {
    }
  }

  setPage = (page) => {
    this.page = page
    this.getLogs()
  }

  clearLogDetail = () => {
    this.userDetail = null
  }
}

export const logStore = new LogStore()
