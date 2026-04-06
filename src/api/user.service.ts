import { apiClient } from './'
import { CreateUserPayload, FetchUsersParams, UpdateUserPayload, User } from '@/types'

interface FetchUsersResult {
  data: User[]
  meta: {
    totalItems: number
    totalPages: number
    currentPage: number
    limit: number
  }
}

export const fetchUsersApi = async (params: FetchUsersParams = {}): Promise<FetchUsersResult> => {
  const { page = 1, limit = 10, search } = params

  const queryParams = new URLSearchParams({
    _page: page.toString(),
    _limit: limit.toString(),
  })

  if (search && search.trim()) {
    queryParams.set('q', search.trim())
  }

  const response = await apiClient.get(`/users?${queryParams}`)
  const totalItems = Number(response.headers['x-total-count'] ?? 0)
  const totalPages = Math.max(1, Math.ceil(totalItems / limit))

  return {
    data: response.data as User[],
    meta: {
      totalItems,
      totalPages,
      currentPage: page,
      limit,
    },
  }
}

export const addUserApi = async (user: CreateUserPayload): Promise<User> => {
  const createdUser = {
    ...user,
    registrationDate: new Date().toISOString(),
  }
  const response = await apiClient.post('/users', createdUser)
  return response.data
}

export const updateUserApi = async (id: string, user: UpdateUserPayload): Promise<User> => {
  const response = await apiClient.put(`/users/${id}`, user)
  return response.data
}

export const deleteUserApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/users/${id}`)
}