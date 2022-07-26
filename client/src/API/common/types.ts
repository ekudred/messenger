export interface UserResponse {
  id: string
  username: string
  fullname: string
  birthdate: string
  avatar: string
  role: RoleResponse
  updatedAt: string
  createdAt: string
}

export type RoleResponse = 'USER' | 'ADMIN'