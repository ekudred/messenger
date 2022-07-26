import { END, EventChannel, eventChannel } from 'redux-saga'
import { race, cancelled, call, fork, put, select, take } from 'redux-saga/effects'
import { Socket } from 'socket.io-client'

import { connect } from 'API/socket'
import {
  SearchChats,
  SearchedChats,
  GetChats,
  GotChats,
  GetDialogs,
  GotDialogs,
  CreateGroup,
  CreatedGroup,
  NewMessage,
  SearchDialogs,
  SearchedDialogs,
} from 'API/socket/chat-manager/types'
import { ChatManagerSocketEvents } from 'API/socket/chat-manager/events'
import { ReadChatMessages } from 'API/socket/common/types'
import { ChatManagerActions } from 'store/actions/messenger'
import { Action, EmitInput } from 'store/types/common'
import {
  TransformedDialogChatListItem,
  TransformedGroupChatListItem,
  TransformedUserChatListItem,
  TransformedChatMessage,
  transformChatList,
} from 'store/helpers/messenger'
import { managerSliceActions } from 'store/reducers/messenger/manager'

// CreateChannel

function createChatManagerSocketChannel(socket: Socket) {
  return eventChannel<EmitInput>(emit => {
    const gotChatsListener = (data: GotChats) => emit({ event: ChatManagerSocketEvents.got_chats, data })
    const gotDialogsListener = (data: GotDialogs) => emit({ event: ChatManagerSocketEvents.got_dialogs, data })
    const searchedDialogsListener = (data: SearchedDialogs) =>
      emit({
        event: ChatManagerSocketEvents.searched_dialogs,
        data,
      })
    const searchedChatsListener = (data: SearchedChats) => emit({ event: ChatManagerSocketEvents.searched_chats, data })
    const createdGroupListener = (data: CreatedGroup) => emit({ event: ChatManagerSocketEvents.created_group, data })
    const newMessagesListener = (data: NewMessage) => emit({ event: ChatManagerSocketEvents.new_message, data })
    const readMessagesListener = (data: ReadChatMessages) =>
      emit({
        event: ChatManagerSocketEvents.read_messages,
        data,
      })

    socket.on(ChatManagerSocketEvents.got_chats, gotChatsListener)
    socket.on(ChatManagerSocketEvents.got_dialogs, gotDialogsListener)
    socket.on(ChatManagerSocketEvents.searched_dialogs, searchedDialogsListener)
    socket.on(ChatManagerSocketEvents.searched_chats, searchedChatsListener)
    socket.on(ChatManagerSocketEvents.created_group, createdGroupListener)
    socket.on(ChatManagerSocketEvents.new_message, newMessagesListener)
    socket.on(ChatManagerSocketEvents.read_messages, readMessagesListener)

    return () => {
      socket.off(ChatManagerSocketEvents.got_chats)
      socket.off(ChatManagerSocketEvents.got_dialogs)
      socket.off(ChatManagerSocketEvents.searched_dialogs)
      socket.off(ChatManagerSocketEvents.searched_chats)
      socket.off(ChatManagerSocketEvents.created_group)
      socket.off(ChatManagerSocketEvents.new_message)
      socket.off(ChatManagerSocketEvents.read_messages)

      emit(END)
    }
  })
}

// Channel

function* chatManagerSocketChannel(socket: Socket) {
  const socketChannel: EventChannel<EmitInput> = yield call(createChatManagerSocketChannel, socket)

  while (true) {
    const { event, data }: EmitInput = yield take(socketChannel)

    if (event === ChatManagerSocketEvents.got_chats) yield gotChatsHandler(data)
    if (event === ChatManagerSocketEvents.got_dialogs) yield gotDialogsHandler(data)
    if (event === ChatManagerSocketEvents.searched_dialogs) yield searchedDialogsHandler(data)
    if (event === ChatManagerSocketEvents.searched_chats) yield searchedChatsHandler(data)
    if (event === ChatManagerSocketEvents.created_group) yield createdGroupHandler(data)
    if (event === ChatManagerSocketEvents.new_message) yield newMessageHandler(data)
    if (event === ChatManagerSocketEvents.read_messages) yield readMessagesHandler(data)
  }
}

// Handlers

function* gotChatsHandler(data: GotChats) {
  if (!data.error) {
    // console.log(data.chats[0].chat.unreadMessages![0].unread)
    const chats = transformChatList(data.chats, data.userID)
    yield put(managerSliceActions.setChatsTabList(chats))

    yield put(managerSliceActions.setManagerAction({ field: 'getChats', action: { status: 'succeeded' } }))
    yield put(managerSliceActions.setManagerAction({ field: 'getChats', action: { status: 'done' } }))
  } else {
    yield put(
      managerSliceActions.setManagerAction({
        field: 'getChats',
        action: { status: 'failed', message: data.error.message },
      }),
    )
    yield put(managerSliceActions.setManagerAction({ field: 'getChats', action: { status: 'idle' } }))
  }
}

function* searchedChatsHandler(data: SearchedChats) {
  if (!data.error) {
    const { auth, profile } = yield select(store => store)
    const { userID, role, updatedAt, createdAt } = auth.info
    const { username, fullname, birthdate, avatar } = profile.user

    const user = { id: userID, role, username, fullname, birthdate, avatar, updatedAt, createdAt }

    const transformedChats = transformChatList(data.chats, data.userID)
    const transformedUsers = data.users.map(comrade => new TransformedUserChatListItem(comrade, user))

    const chats = [...transformedChats, ...transformedUsers]

    yield put(managerSliceActions.setChatsTabList(chats))

    yield put(managerSliceActions.setChatsTabAction({ field: 'searchChats', action: { status: 'succeeded' } }))
    yield put(managerSliceActions.setChatsTabAction({ field: 'searchChats', action: { status: 'done' } }))
    yield put(managerSliceActions.setChatsTabAction({ field: 'searchChats', action: { status: 'idle' } }))
  } else {
    yield put(
      managerSliceActions.setChatsTabAction({
        field: 'searchChats',
        action: { status: 'failed', message: data.error.message },
      }),
    )
  }
}

function* gotDialogsHandler(data: GotDialogs) {
  if (!data.error) {
    const { dialogs } = data

    const transformedDialogs = dialogs.map(dialog => new TransformedDialogChatListItem(dialog, data.userID))

    yield put(managerSliceActions.setPersonalChatsTabList(transformedDialogs))

    yield put(managerSliceActions.setManagerAction({ field: 'getDialogs', action: { status: 'succeeded' } }))
    yield put(managerSliceActions.setManagerAction({ field: 'getDialogs', action: { status: 'done' } }))
  } else {
    yield put(
      managerSliceActions.setManagerAction({
        field: 'getDialogs',
        action: { status: 'failed', message: data.error.message },
      }),
    )
  }
}

function* searchedDialogsHandler(data: SearchedDialogs) {
  if (!data.error) {
    const transformedDialogs = data.dialogs.map(dialog => new TransformedDialogChatListItem(dialog, data.userID))
    yield put(managerSliceActions.setPersonalChatsTabList(transformedDialogs))

    yield put(managerSliceActions.setPersonalChatsTabAction({ field: 'searchChats', action: { status: 'succeeded' } }))
    yield put(managerSliceActions.setPersonalChatsTabAction({ field: 'searchChats', action: { status: 'done' } }))
    yield put(managerSliceActions.setPersonalChatsTabAction({ field: 'searchChats', action: { status: 'idle' } }))
  } else {
    yield put(
      managerSliceActions.setPersonalChatsTabAction({
        field: 'searchChats',
        action: { status: 'failed', message: data.error.message },
      }),
    )
  }
}

function* createdGroupHandler(data: CreatedGroup) {
  if (!data.error) {
    const { group, userID } = data

    const transformedGroup = new TransformedGroupChatListItem(group, data.userID)

    yield put(managerSliceActions.setChatsTabList([transformedGroup]))

    yield put(
      managerSliceActions.setPersonalChatsTabAction({
        field: 'createGroup',
        action: {
          status: 'succeeded',
          message:
            transformedGroup.creator.id === userID
              ? `You have created a group "${group.name}"`
              : `You have been added to the group "${group.name}"`,
        },
      }),
    )
    yield put(managerSliceActions.setPersonalChatsTabAction({ field: 'createGroup', action: { status: 'done' } }))
    yield put(managerSliceActions.setPersonalChatsTabAction({ field: 'createGroup', action: { status: 'idle' } }))

    yield put(managerSliceActions.setPersonalChatsTabModal({ field: 'createGroup', action: { visible: false } }))
    yield put(managerSliceActions.setPersonalChatsTabExtra(null))
  } else {
    yield put(
      managerSliceActions.setPersonalChatsTabAction({
        field: 'createGroup',
        action: { status: 'failed', message: data.error.message },
      }),
    )
  }
}

function* newMessageHandler(data: NewMessage) {
  if (!data.error) {
    const { auth, messenger } = yield select(store => store)
    const { userID } = auth.info
    const { roster } = messenger.chat.head

    const message = new TransformedChatMessage(data.message, userID, true, roster.length)
    const chat =
      data.chat.type === 'user'
        ? new TransformedDialogChatListItem(data.chat.chat, userID)
        : new TransformedGroupChatListItem(data.chat.chat, userID)

    yield put(managerSliceActions.addNewMessageChatListItem({ id: data.message.chatID, message, item: chat }))

    yield put(managerSliceActions.setManagerAction({ field: 'addNewMessage', action: { status: 'succeeded' } }))
    yield put(managerSliceActions.setManagerAction({ field: 'addNewMessage', action: { status: 'done' } }))
    yield put(managerSliceActions.setManagerAction({ field: 'addNewMessage', action: { status: 'idle' } }))
  } else {
    yield put(
      managerSliceActions.setManagerAction({
        field: 'addNewMessage',
        action: { status: 'failed', message: data.error.message },
      }),
    )
  }
}

function* readMessagesHandler(data: ReadChatMessages) {
  if (!data.error) {
    const { chatID: id, chatType, unreadMessages } = data

    yield put(managerSliceActions.handleChatListItem({ id, chatType, unreadMessages }))
  }
}

// Workers

function* getChatsWorker(socket: Socket) {
  while (true) {
    const action: Action<GetChats> = yield take(ChatManagerActions.GET_CHATS)

    yield socket.emit(ChatManagerSocketEvents.get_chats, action.payload)
    yield put(managerSliceActions.setManagerAction({ field: 'getChats', action: { status: 'loading' } }))
  }
}

function* searchChatsWorker(socket: Socket) {
  while (true) {
    const action: Action<SearchChats> = yield take(ChatManagerActions.SEARCH_CHATS)

    yield socket.emit(ChatManagerSocketEvents.search_chats, action.payload)
    yield put(managerSliceActions.setChatsTabAction({ field: 'searchChats', action: { status: 'loading' } }))
  }
}

function* getDialogsWorker(socket: Socket) {
  while (true) {
    const action: Action<GetDialogs> = yield take(ChatManagerActions.GET_DIALOGS)

    yield socket.emit(ChatManagerSocketEvents.get_dialogs, action.payload)
    yield put(managerSliceActions.setManagerAction({ field: 'getDialogs', action: { status: 'loading' } }))
  }
}

function* searchDialogsWorker(socket: Socket) {
  while (true) {
    const action: Action<SearchDialogs> = yield take(ChatManagerActions.SEARCH_DIALOGS)

    yield socket.emit(ChatManagerSocketEvents.search_dialogs, action.payload)
    yield put(managerSliceActions.setPersonalChatsTabAction({ field: 'searchChats', action: { status: 'loading' } }))
  }
}

function* createGroupWorker(socket: Socket) {
  while (true) {
    const action: Action<CreateGroup> = yield take(ChatManagerActions.CREATE_GROUP)

    yield socket.emit(ChatManagerSocketEvents.create_group, action.payload)
    yield put(managerSliceActions.setPersonalChatsTabAction({ field: 'createGroup', action: { status: 'loading' } }))
  }
}

// Listen

function* listenChatManagerSocket() {
  const accessToken: string | null = yield select(state => state.auth.info.accessToken)
  const socket: Socket = yield call(connect, '/chat_manager', { auth: { accessToken } })

  yield put(managerSliceActions.setSocket({ field: 'chatManager', socket: { connected: true } }))

  try {
    yield fork(chatManagerSocketChannel, socket)

    yield fork(getChatsWorker, socket)
    yield fork(searchChatsWorker, socket)
    yield fork(getDialogsWorker, socket)
    yield fork(searchDialogsWorker, socket)
    yield fork(createGroupWorker, socket)
  } catch (error: any) {
    console.log(error)
  } finally {
    if ((yield cancelled()) as boolean) {
      socket.disconnect()
    }
  }
}

// Watch

export function* watchChatManagerSocket() {
  while (true) {
    yield take(ChatManagerActions.CONNECT)
    yield race({
      task: call(listenChatManagerSocket),
      cancel: take(ChatManagerActions.DISCONNECT),
    })
  }
}