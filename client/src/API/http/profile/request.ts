import { request, RequestOptions } from '../index'
import { EditRequest, EditResponse } from './types'

export class ProfileAPI {
  public static async edit(requestOptions: RequestOptions, options: EditRequest): Promise<EditResponse> {
    return await request(requestOptions).post('/profile/edit', options)
  }
}
