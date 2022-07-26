import io, { Socket, SocketOptions } from 'socket.io-client'

const url = process.env.REACT_APP_SERVER!
const defaultSocketOptions: SocketOptions = {
  auth: {
    accessToken: localStorage.getItem('accessToken') || null
  }
}

export const connect = (namespace: string = '/', socketOptions?: SocketOptions): Promise<Socket> => {
  const socket = io(`${url}${namespace}`, socketOptions ?? defaultSocketOptions)

  return new Promise(resolve => {
    socket.on('connect', () => resolve(socket))
  })
}
