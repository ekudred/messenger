import axios from 'axios'

export interface RequestOptions {
  clientID: string
  accessToken?: string
}

export const request = (options: RequestOptions) => {
  const { accessToken, clientID } = options

  const API = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER}/api`,
    withCredentials: true,
  })

  API.interceptors.request.use((config: any) => {
    config.headers['Authorization'] = `Bearer ${accessToken ?? null}`
    config.headers['Client-Id'] = `${clientID}`

    return config
  })

  return API
}
