import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  fetchUsersApi,
  addUserApi,
  updateUserApi
} from '@/api'
import { CreateUserPayload, FetchUsersParams, User } from '@/types'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const limit = ref(10)
  const search = ref('')
  const total = ref(0)

  const fetchUsers = async (params: FetchUsersParams = {}) => {
    loading.value = true
    error.value = null
    try {
      const { page = currentPage.value, limit: pageLimit = limit.value, search: searchTerm = search.value } = params

      const response = await fetchUsersApi({ page, limit: pageLimit, search: searchTerm })

      users.value = response.data
      currentPage.value = response.meta.currentPage
      limit.value = response.meta.limit
      total.value = response.meta.totalItems
      search.value = searchTerm || ''
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      loading.value = false
    }
  }

  const addUser = async (user: CreateUserPayload) => {
    loading.value = true
    error.value = null
    try {
      const userToCreate = {
        ...user,
        registrationDate: new Date().toISOString(),
        status: user.status || 'active'
      }
      const newUser = await addUserApi(userToCreate)
      users.value.push(newUser)
      total.value += 1
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id: string, user: Omit<User, 'id'>) => {
    loading.value = true
    error.value = null
    try {
      const updatedUser = await updateUserApi(id, user)
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      loading.value = false
    }
  }

  const setPage = (page: number) => {
    currentPage.value = page
    fetchUsers({ page, limit: limit.value, search: search.value })
  }

  const setSearch = (searchTerm: string) => {
    search.value = searchTerm
    currentPage.value = 1
    fetchUsers({ page: 1, limit: limit.value, search: searchTerm })
  }

  return {
    users,
    loading,
    error,
    currentPage,
    limit,
    search,
    total,
    fetchUsers,
    addUser,
    updateUser,
    setPage,
    setSearch
  }
})
