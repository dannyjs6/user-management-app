import axios from 'axios'

export const API_BASE_URL = 'http://127.0.0.1:4444/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export * from './user.service'