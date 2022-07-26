import { AxiosResponse } from 'axios'

import { UserResponse } from '../../common/types'

// SignUp

export interface SignUpRequest {
  username: string
  email: string
  password: string
}

export interface SignUpResponse extends AxiosResponse {
  data: {
    message: string
  }
}

// SignIn

export interface SignInRequest {
  username: string
  password: string
}

export interface SignInResponse extends AuthResponse {
}

// Refresh

export interface RefreshResponse extends AuthResponse {
}

// Confirm

export interface ConfirmRequest {
  id: string
  password: string
}

export interface ConfirmResponse extends AxiosResponse {
  data: {
    isConfirm: boolean
    user: {
      email: string
      phone: string
    }
  }
}

// Common

export interface AuthResponse extends AxiosResponse {
  data: {
    accessToken: string
    refreshToken: string
    user: UserResponse
  }
}
