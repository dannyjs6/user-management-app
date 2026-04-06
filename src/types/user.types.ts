export interface User {
  id: string
  name: string
  email: string
  registrationDate: string
  status: 'active' | 'blocked'
}

export interface FetchUsersParams {
  page?: number
  limit?: number
  search?: string
}

export type CreateUserPayload = Omit<User, 'id' | 'registrationDate'>
export type UpdateUserPayload = Omit<User, 'id'>