import { request, RequestOptions } from '../index'
import {
  SignUpRequest,
  SignUpResponse,
  SignInRequest,
  SignInResponse,
  RefreshResponse,
  ConfirmRequest,
  ConfirmResponse
} from './types'

export class AuthAPI {
  public static async signUp(requestOptions: RequestOptions, options: SignUpRequest): Promise<SignUpResponse> {
    return await request(requestOptions).post('/auth/sign-up', options)
  }

  public static async signIn(requestOptions: RequestOptions, options: SignInRequest): Promise<SignInResponse> {
    return await request(requestOptions).post('/auth/sign-in', options)
  }

  public static async signOut(requestOptions: RequestOptions) {
    return await request(requestOptions).post('/auth/sign-out')
  }

  public static async refresh(requestOptions: RequestOptions): Promise<RefreshResponse> {
    return await request(requestOptions).post('/auth/refresh')
  }

  public static async confirm(requestOptions: RequestOptions, options: ConfirmRequest): Promise<ConfirmResponse> {
    return await request(requestOptions).post('/auth/confirm', options)
  }
}
