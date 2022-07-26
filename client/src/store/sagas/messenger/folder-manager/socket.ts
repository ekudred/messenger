import { END, EventChannel, eventChannel } from 'redux-saga'
import { call, cancelled, fork, put, race, select, take } from 'redux-saga/effects'
import { push } from '@lagunovsky/redux-react-router'
import { Socket } from 'socket.io-client'

import { connect } from 'API/socket'
import { managerSliceActions } from 'store/reducers/messenger/manager'
import { FolderManagerActions } from 'store/actions/messenger'
import {
  GetFolders,
  GotFolders,
  CreateFolder,
  CreatedFolder,
  EditFolder,
  EditedFolder,
  DeleteFolder,
  DeletedFolder,
  SearchFolderChats,
  SearchedFolderChats,
} from 'API/socket/folder-manager/types'
import { FolderManagerSocketEvents } from 'API/socket/folder-manager/events'
import { transformChatList, sortFolders, TransformedFolder } from 'store/helpers/messenger'
import { Action, EmitInput } from 'store/types/common'
import { Paths } from 'utils/paths'
import { ChatsTab, FolderTab } from '../../../types/messenger/manager'
import folder from '../../../../components/Root/pages/Main/pages/Messenger/Manager/Content/ChatList/Extra/Folder'

// CreateChannel

function createFolderManagerSocketChannel(socket: Socket) {
  return eventChannel<EmitInput>(emit => {
    const gotFoldersListener = (data: GotFolders) => emit({ event: FolderManagerSocketEvents.got_folders, data })
    const createdFolderListener = (data: CreatedFolder) =>
      emit({
        event: FolderManagerSocketEvents.created_folder,
        data,
      })
    const editedFolderListener = (data: EditedFolder) => emit({ event: FolderManagerSocketEvents.edited_folder, data })
    const deletedFolderListener = (data: DeletedFolder) =>
      emit({
        event: FolderManagerSocketEvents.deleted_folder,
        data,
      })
    const searchedFolderChatsListener = (data: SearchedFolderChats) =>
      emit({
        event: FolderManagerSocketEvents.searched_chats,
        data,
      })

    socket.on(FolderManagerSocketEvents.got_folders, gotFoldersListener)
    socket.on(FolderManagerSocketEvents.created_folder, createdFolderListener)
    socket.on(FolderManagerSocketEvents.edited_folder, editedFolderListener)
    socket.on(FolderManagerSocketEvents.deleted_folder, deletedFolderListener)
    socket.on(FolderManagerSocketEvents.searched_chats, searchedFolderChatsListener)

    return () => {
      socket.off(FolderManagerSocketEvents.got_folders)
      socket.off(FolderManagerSocketEvents.created_folder)
      socket.off(FolderManagerSocketEvents.edited_folder)
      socket.off(FolderManagerSocketEvents.deleted_folder)
      socket.off(FolderManagerSocketEvents.searched_chats)

      emit(END)
    }
  })
}

// Channel

function* folderManagerSocketChannel(socket: Socket) {
  const socketChannel: EventChannel<EmitInput> = yield call(createFolderManagerSocketChannel, socket)

  while (true) {
    const { event, data }: EmitInput = yield take(socketChannel)

    if (event === FolderManagerSocketEvents.got_folders) yield gotFoldersHandler(data)
    if (event === FolderManagerSocketEvents.created_folder) yield createdFolderHandler(data)
    if (event === FolderManagerSocketEvents.edited_folder) yield editedFolderHandler(data)
    if (event === FolderManagerSocketEvents.deleted_folder) yield deletedFolderHandler(data)
    if (event === FolderManagerSocketEvents.searched_chats) yield searchedFolderChatsHandler(data)
  }
}

// Handlers

function* gotFoldersHandler(data: GotFolders) {
  if (!data.error) {
    // console.log(data.folders[0].list[0].chat.unreadMessages![0].unread)
    const folders = data.folders.map(folder => new TransformedFolder(folder))
    // const sortedFolders = sortFolders(folders)
    yield put(managerSliceActions.setFolderTabs(folders))

    yield put(managerSliceActions.setManagerAction({ field: 'getFolders', action: { status: 'succeeded' } }))
    yield put(managerSliceActions.setManagerAction({ field: 'getFolders', action: { status: 'done' } }))
  } else {
    yield put(
      managerSliceActions.setManagerAction({
        field: 'getFolders',
        action: { status: 'failed', message: data.error.message },
      }),
    )
  }
}

function* createdFolderHandler(data: CreatedFolder) {
  if (!data.error) {
    const { folder } = data

    const transformedFolder = new TransformedFolder(folder)
    yield put(managerSliceActions.setFolderTab(transformedFolder))

    yield put(
      managerSliceActions.setChatsTabAction({
        field: 'createFolder',
        action: {
          status: 'succeeded',
          message: `You have created a folder "${folder.name}"`,
        },
      }),
    )
    yield put(managerSliceActions.setChatsTabAction({ field: 'createFolder', action: { status: 'done' } }))
    yield put(managerSliceActions.setChatsTabAction({ field: 'createFolder', action: { status: 'idle' } }))
    yield put(push(`${Paths.MESSENGER}?folder=${folder.id}`))

    yield put(managerSliceActions.setChatsTabModal({ field: 'createFolder', action: { visible: false } }))
    yield put(managerSliceActions.setChatsTabExtra(null))
  } else {
    yield put(
      managerSliceActions.setChatsTabAction({
        field: 'createFolder',
        action: { status: 'failed', message: data.error.message },
      }),
    )
  }
}

function* editedFolderHandler(data: EditedFolder) {
  if (!data.error) {
    const { folder } = data

    const { id, name, list } = new TransformedFolder(folder)
    yield put(managerSliceActions.changeFolderTab({ id, name, list }))

    yield put(
      managerSliceActions.setFolderTabAction({
        id: folder.id,
        field: 'editFolder',
        action: { status: 'succeeded', message: `You edited the folder` },
      }),
    )
    yield put(managerSliceActions.setFolderTabAction({
      id: folder.id,
      field: 'editFolder',
      action: { status: 'done' },
    }))
    yield put(managerSliceActions.setFolderTabAction({
      id: folder.id,
      field: 'editFolder',
      action: { status: 'idle' },
    }))

    const chatsTab: ChatsTab = yield select(state => state.messenger.manager.tabs.default['0'])
    const folderTab: FolderTab = yield select(state => state.messenger.manager.tabs.folders[folder.id])

    if (chatsTab.extra === 'addChatsToFolder' && chatsTab.modals.addChatsToFolder.visible) {
      yield put(managerSliceActions.setChatsTabModal({ field: 'addChatsToFolder', action: { visible: false } }))
      yield put(managerSliceActions.setChatsTabExtra(null))
    }

    if (folderTab.modals.editFolder.visible) {
      yield put(managerSliceActions.setFolderTabModal({
        id, field: 'editFolder', action: { visible: false },
      }))
    }

    if (folderTab.extra === 'deleteFolderChats' && folderTab.modals.confirmDeleteFolderChats.visible) {
      yield put(managerSliceActions.setFolderTabModal({
        id, field: 'confirmDeleteFolderChats', action: { visible: false },
      }))
      yield put(managerSliceActions.setFolderTabExtra({ id, extra: null }))
    }
  } else {
    yield put(
      managerSliceActions.setFolderTabAction({
        id: data.error.extra.folderID,
        field: 'editFolder',
        action: { status: 'failed', message: data.error.message },
      }),
    )
  }
}

function* deletedFolderHandler(data: DeletedFolder) {
  if (!data.error) {
    const { folderName, folderID } = data

    yield put(
      managerSliceActions.setFolderTabAction({
        id: folderID,
        field: 'deleteFolder',
        action: { status: 'succeeded', message: `You deleted the folder "${folderName}"` },
      }),
    )

    yield put(
      managerSliceActions.setFolderTabAction({
        id: folderID,
        field: 'deleteFolder',
        action: { status: 'done' },
      }),
    )
    yield put(
      managerSliceActions.setFolderTabAction({
        id: folderID,
        field: 'deleteFolder',
        action: { status: 'idle' },
      }),
    )
    yield put(managerSliceActions.deleteFolderTab({ id: folderID }))
    yield put(push(Paths.MESSENGER))
  } else {
    yield put(
      managerSliceActions.setFolderTabAction({
        id: data.error.extra.folderID,
        field: 'deleteFolder',
        action: { status: 'failed', message: data.error.message },
      }),
    )
  }
}

function* searchedFolderChatsHandler(data: SearchedFolderChats) {
  if (!data.error) {
    const list = transformChatList(data.chats, data.userID)

    yield put(managerSliceActions.changeFolderTab({ id: data.folderID, list }))

    yield put(
      managerSliceActions.setFolderTabAction({
        id: data.folderID,
        field: 'searchChats',
        action: { status: 'succeeded' },
      }),
    )
    yield put(
      managerSliceActions.setFolderTabAction({
        id: data.folderID,
        field: 'searchChats',
        action: { status: 'done' },
      }),
    )
    yield put(
      managerSliceActions.setFolderTabAction({
        id: data.folderID,
        field: 'searchChats',
        action: { status: 'idle' },
      }),
    )
  } else {
    yield put(
      managerSliceActions.setFolderTabAction({
        id: data.error.extra.folderID,
        field: 'searchChats',
        action: { status: 'failed', message: data.error.message },
      }),
    )
  }
}

// Workers

function* createFolderWorker(socket: Socket) {
  while (true) {
    const action: Action<CreateFolder> = yield take(FolderManagerActions.CREATE_FOLDER)

    yield socket.emit(FolderManagerSocketEvents.create_folder, action.payload)
    yield put(managerSliceActions.setChatsTabAction({ field: 'createFolder', action: { status: 'loading' } }))
  }
}

function* getFoldersWorker(socket: Socket) {
  while (true) {
    const action: Action<GetFolders> = yield take(FolderManagerActions.GET_FOLDERS)

    yield socket.emit(FolderManagerSocketEvents.get_folders, action.payload)
    yield put(managerSliceActions.setManagerAction({ field: 'getFolders', action: { status: 'loading' } }))
  }
}

function* editFolderWorker(socket: Socket) {
  while (true) {
    const action: Action<EditFolder> = yield take(FolderManagerActions.EDIT_FOLDER)

    yield socket.emit(FolderManagerSocketEvents.edit_folder, action.payload)
    yield put(
      managerSliceActions.setFolderTabAction({
        id: action.payload.folderID,
        field: 'editFolder',
        action: { status: 'loading' },
      }),
    )
  }
}

function* searchFolderChatsWorker(socket: Socket) {
  while (true) {
    const action: Action<SearchFolderChats> = yield take(FolderManagerActions.SEARCH_FOLDER_CHATS)

    yield socket.emit(FolderManagerSocketEvents.search_chats, action.payload)
    yield put(
      managerSliceActions.setFolderTabAction({
        id: action.payload.folderID,
        field: 'searchChats',
        action: { status: 'loading' },
      }),
    )
  }
}

function* deleteFolderWorker(socket: Socket) {
  while (true) {
    const action: Action<DeleteFolder> = yield take(FolderManagerActions.DELETE_FOLDER)

    yield socket.emit(FolderManagerSocketEvents.delete_folder, action.payload)
    yield put(
      managerSliceActions.setFolderTabAction({
        id: action.payload.folderID,
        field: 'deleteFolder',
        action: { status: 'loading' },
      }),
    )
  }
}

// Listen

function* listenFolderManagerSocket() {
  const accessToken: string | null = yield select(state => state.auth.info.accessToken)
  const socket: Socket = yield call(connect, '/folder_manager', { auth: { accessToken } })

  yield put(managerSliceActions.setSocket({ field: 'folderManager', socket: { connected: true } }))

  try {
    yield fork(folderManagerSocketChannel, socket)

    yield fork(getFoldersWorker, socket)
    yield fork(createFolderWorker, socket)
    yield fork(editFolderWorker, socket)
    yield fork(searchFolderChatsWorker, socket)
    yield fork(deleteFolderWorker, socket)
  } catch (error: any) {
    console.log(error)
  } finally {
    if ((yield cancelled()) as boolean) {
      socket.disconnect()
    }
  }
}

// Watch

export function* watchFolderManagerSocket() {
  while (true) {
    yield take(FolderManagerActions.CONNECT)
    yield race({
      task: call(listenFolderManagerSocket),
      cancel: take(FolderManagerActions.DISCONNECT),
    })
  }
}
