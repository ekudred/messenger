import { AxiosResponse } from 'axios'

import { UserResponse } from '../../common/types'

// Edit

export interface EditRequest {
  id: string
  username: string | null
  fullname: string | null
  birthdate: string | null
  phone: string | null
  email: string | null
  avatar: string | null
  password: string | null
}

export interface EditResponse extends AxiosResponse {
  data: {
    user: UserResponse
  }
}
