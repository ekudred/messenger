import { END, EventChannel, eventChannel } from 'redux-saga'
import { race, cancelled, call, fork, put, take, select } from 'redux-saga/effects'
import { Socket } from 'socket.io-client'
import moment from 'moment'

import { connect } from 'API/socket'
import { chatSliceActions } from 'store/reducers/messenger/chat'
import { managerSliceActions } from 'store/reducers/messenger/manager'
import {
  SendMessage,
  SentMessage,
  JoinChat,
  JoinedChat,
  LeaveChat,
  LeftChat,
  ViewChatMessages,
} from 'API/socket/chat/types'
import { ChatSocketEvents } from 'API/socket/chat/events'
import { ReadChatMessages } from 'API/socket/common/types'
import {
  TransformedChatMessage,
  TransformedDialogChatListItem,
  TransformedGroupChatListItem,
} from 'store/helpers/messenger'
import { ChatActions } from 'store/actions/messenger'
import { Action, EmitInput } from 'store/types/common'

// CreateChannel

function createChatSocketChannel(socket: Socket) {
  return eventChannel<EmitInput>(emit => {
    const joinedChatListener = (data: JoinedChat) => emit({ event: ChatSocketEvents.joined_chat, data })
    const leftChatListener = (data: LeftChat) => emit({ event: ChatSocketEvents.left_chat, data })
    const sentMessageListener = (data: SentMessage) => emit({ event: ChatSocketEvents.sent_message, data })
    const readMessageListener = (data: ReadChatMessages) => emit({ event: ChatSocketEvents.read_messages, data })

    socket.on(ChatSocketEvents.joined_chat, joinedChatListener)
    socket.on(ChatSocketEvents.left_chat, leftChatListener)
    socket.on(ChatSocketEvents.sent_message, sentMessageListener)
    socket.on(ChatSocketEvents.read_messages, readMessageListener)

    return () => {
      socket.off(ChatSocketEvents.joined_chat)
      socket.off(ChatSocketEvents.left_chat)
      socket.off(ChatSocketEvents.sent_message)
      socket.off(ChatSocketEvents.read_messages)

      emit(END)
    }
  })
}

// Channel

function* chatSocketChannel(socket: Socket) {
  const socketChannel: EventChannel<EmitInput> = yield call(createChatSocketChannel, socket)

  while (true) {
    const { event, data }: EmitInput = yield take(socketChannel)

    if (event === ChatSocketEvents.joined_chat) yield joinedChatHandler(data)
    if (event === ChatSocketEvents.left_chat) yield leftChatHandler(data)
    if (event === ChatSocketEvents.sent_message) yield sentMessageHandler(data)
    if (event === ChatSocketEvents.read_messages) yield readMessageHandler(data)
  }
}

// Handlers

function* joinedChatHandler(data: JoinedChat) {
  if (!data.error) {
    const { auth, messenger } = yield select(store => store)
    const { userID } = auth.info
    const { type, roster } = messenger.chat.head

    if (data.chat.type === 'user') {
      const { id, roster } = data.chat.chat
      const { username: name, avatar } = data.chat.chat.roster.find(user => user.id !== userID)!

      if (type === 'empty') {
        yield put(chatSliceActions.setChatHead({ type: data.chat.type, id, name, avatar, roster }))
      }
    }
    if (data.chat.type === 'group') {
      const { id, roster, name, avatar } = data.chat.chat

      if (type === 'empty') {
        yield put(chatSliceActions.setChatHead({ type: data.chat.type, id, name, avatar, roster }))
      }
    }

    yield put(chatSliceActions.setChatHead({ id: data.chat.chat.id }))

    const messages = data.chat.chat.messages.map(
      message => new TransformedChatMessage(message, userID, true, roster.length)
    )
    const unreadMessages = data.chat.chat.messages.filter(
      message => message.unread.findIndex(item => item.userID === userID) !== -1
    ).length

    yield put(chatSliceActions.setMessages(messages))
    yield put(chatSliceActions.setUnreadMessages(unreadMessages))

    if (data.chat.created) {
      yield put(
        managerSliceActions.changeChatsTabListItem({
          id:
            data.chat.type === 'user' ? data.chat.chat.roster.find(user => user.id !== userID)!.id : data.chat.chat.id,
          item:
            data.chat.type === 'user'
              ? new TransformedDialogChatListItem(data.chat.chat, userID)
              : new TransformedGroupChatListItem(data.chat.chat, userID),
        })
      )
    }

    yield put(chatSliceActions.setAction({ field: 'joinChat', action: { status: 'succeeded' } }))
    yield put(chatSliceActions.setAction({ field: 'joinChat', action: { status: 'done' } }))
  } else {
    yield put(
      chatSliceActions.setAction({
        field: 'joinChat',
        action: { status: 'failed', message: data.error.message },
      })
    )
  }
}

function* leftChatHandler(data: LeftChat) {
  if (!data.error) {
    yield put(chatSliceActions.setAction({ field: 'leaveChat', action: { status: 'succeeded' } }))
    yield put(chatSliceActions.setAction({ field: 'leaveChat', action: { status: 'done' } }))
    yield put(chatSliceActions.setAction({ field: 'leaveChat', action: { status: 'idle' } }))
  } else {
    yield put(
      chatSliceActions.setAction({
        field: 'leaveChat',
        action: { status: 'failed', message: data.error.message },
      })
    )
  }
}

function* sentMessageHandler(data: SentMessage) {
  if (!data.error) {
    const { auth, messenger } = yield select(store => store)
    const { userID } = auth.info
    const { roster } = messenger.chat.head
    const { sendMessage } = messenger.chat.actions

    const unreadMessages = data.unreadMessages
      ? data.unreadMessages.filter(message => message.unread.findIndex(item => item.userID === userID) !== -1).length
      : 0

    yield put(chatSliceActions.setUnreadMessages(unreadMessages))

    if (sendMessage.status === 'loading') {
      yield put(chatSliceActions.setMessagesStatus({ [data.message.id]: { sent: true } }))

      yield put(chatSliceActions.setAction({ field: 'sendMessage', action: { status: 'succeeded' } }))
      yield put(chatSliceActions.setAction({ field: 'sendMessage', action: { status: 'done' } }))
      yield put(chatSliceActions.setAction({ field: 'sendMessage', action: { status: 'idle' } }))
    } else {
      const transformedMessage = new TransformedChatMessage(data.message, userID, true, roster.length)
      yield put(chatSliceActions.addMessages([transformedMessage]))

      yield put(chatSliceActions.setAction({ field: 'sentMessage', action: { status: 'succeeded' } }))
      yield put(chatSliceActions.setAction({ field: 'sentMessage', action: { status: 'done' } }))
      yield put(chatSliceActions.setAction({ field: 'sentMessage', action: { status: 'idle' } }))
    }
  } else {
    yield put(
      chatSliceActions.setAction({
        field: 'sentMessage',
        action: { status: 'failed', message: data.error.message },
      })
    )
  }
}

function* readMessageHandler(data: ReadChatMessages) {
  if (!data.error) {
    const messagesStatus = data.readMessages.reduce((total, item) => {
      total[item.id] = { read: true }

      return total
    }, {} as { [id: string]: { read: boolean } })

    yield put(chatSliceActions.setUnreadMessages(data.unreadMessages))
    yield put(chatSliceActions.setMessagesStatus(messagesStatus))
  } else {
    yield put(
      chatSliceActions.setAction({
        field: 'readMessages',
        action: { status: 'failed', message: data.error.message },
      })
    )
  }
}

// Workers

function* joinChatWorker(socket: Socket) {
  while (true) {
    const action: Action<JoinChat> = yield take(ChatActions.JOIN_CHAT)

    yield socket.emit(ChatSocketEvents.join_chat, action.payload)
    yield put(chatSliceActions.setAction({ field: 'joinChat', action: { status: 'loading' } }))
  }
}

function* leaveChatWorker(socket: Socket) {
  while (true) {
    const action: Action<LeaveChat> = yield take(ChatActions.LEAVE_CHAT)

    yield socket.emit(ChatSocketEvents.leave_chat, action.payload)
    yield put(chatSliceActions.setAction({ field: 'leaveChat', action: { status: 'loading' } }))
  }
}

function* sendMessageWorker(socket: Socket) {
  while (true) {
    const action: Action<SendMessage> = yield take(ChatActions.SEND_MESSAGE)
    const { messageID: id, userID, text } = action.payload

    const { profile, auth } = yield select(store => store)
    const { username, fullname, avatar, birthdate } = profile.user
    const { updatedAt, createdAt, role } = auth.info
    const author = { id: userID, username, fullname, avatar, birthdate, role, updatedAt, createdAt }

    const date = moment().format()

    yield put(
      chatSliceActions.addMessages([
        {
          type: 'my',
          id,
          author,
          text,
          updatedAt: date,
          createdAt: date,
          sent: false,
          read: false,
        },
      ])
    )

    yield socket.emit(ChatSocketEvents.send_message, action.payload)
    yield put(chatSliceActions.setAction({ field: 'sendMessage', action: { status: 'loading' } }))
  }
}

function* viewMessageWorker(socket: Socket) {
  while (true) {
    const action: Action<ViewChatMessages> = yield take(ChatActions.VIEW_MESSAGES)

    yield socket.emit(ChatSocketEvents.view_messages, action.payload)
    yield put(chatSliceActions.setAction({ field: 'readMessages', action: { status: 'loading' } }))
  }
}

// Listen

function* listenChatSocket() {
  const accessToken: string | null = yield select(state => state.auth.info.accessToken)
  const socket: Socket = yield call(connect, '/chat', { auth: { accessToken } })

  yield put(chatSliceActions.setSocket({ connected: true }))

  try {
    yield fork(chatSocketChannel, socket)

    yield fork(joinChatWorker, socket)
    yield fork(leaveChatWorker, socket)
    yield fork(sendMessageWorker, socket)
    yield fork(viewMessageWorker, socket)
  } catch (error: any) {
    console.log(error)
  } finally {
    if ((yield cancelled()) as boolean) {
      socket.disconnect()
    }
  }
}

// Watch

export function* watchChatSocket() {
  while (true) {
    yield take(ChatActions.CONNECT)
    yield race({
      task: call(listenChatSocket),
      cancel: take(ChatActions.DISCONNECT),
    })
  }
}
