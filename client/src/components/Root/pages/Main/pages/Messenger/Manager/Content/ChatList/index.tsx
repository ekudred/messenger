import React, { FC, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Col, List } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Scrollbars } from 'react-custom-scrollbars-2'
import cs from 'classnames'

import { useAppDispatch, useAppSelector } from 'hooks/store'
import { managerSliceActions } from 'store/reducers/messenger/manager'
import { GroupChatListItem, DialogChatListItem } from 'store/types/messenger/manager'
import { chatSliceActions } from 'store/reducers/messenger/chat'
import ChatListItem from './Item'
import ChatListExtra from './Extra'
import { Paths } from 'utils/paths'
import { selectTab } from 'store/selectors/messenger'

import styles from './ChatList.module.less'

interface ChatListProps {
  id: string
  frontier?: boolean
}

const ChatList: FC<ChatListProps> = props => {
  const { id, frontier } = props

  const tab = useAppSelector(selectTab(id))!
  const isChatsTab = tab.key === 'chats'
  const isPersonalTab = tab.key === 'personalChats'
  const isFolderTab = tab.key === 'folder'

  const { router, auth, global } = useAppSelector(store => store)
  const { pathname, search } = router.location

  const timer = useRef(null as any)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const openChat = (item: GroupChatListItem | DialogChatListItem) => {
    const { type, name, avatar, roster, unreadMessages } = item
    const id = type === 'user' ? item.comradeID : item.id

    const url = `${pathname}${search}`
    const push = `${Paths.MESSENGER}?${type}=${id}`

    if (push !== url) {
      navigate(push)

      dispatch(chatSliceActions.setChatHead({ type, id, name, avatar, roster }))
      dispatch(chatSliceActions.setUnreadMessages(unreadMessages))
    }
  }
  const selectChat = (item: GroupChatListItem | DialogChatListItem) => {
    if (item.type === 'user' && item.id === item.comradeID) {
      return
    }

    if (isChatsTab) {
      dispatch(managerSliceActions.handleChatsTabSelected({ item: { id: item.id, type: item.type } }))
    }
    if (isPersonalTab) {
      dispatch(managerSliceActions.handlePersonalChatsTabSelected({ item: { id: item.id, type: item.type } }))
    }
    if (isFolderTab) {
      dispatch(managerSliceActions.handleFolderTabSelected({ id, item: { id: item.id, type: item.type } }))
    }
  }

  const onClickAddFolderChats = () => {
    dispatch(managerSliceActions.setChatsTabExtra('addChatsToFolder'))
    navigate(Paths.MESSENGER)
  }

  const onClickListItem = (item: GroupChatListItem | DialogChatListItem) => {
    if (!tab.selectable) {
      clearTimeout(timer.current)

      timer.current = setTimeout(() => {
        openChat(item)
      }, 250)
    } else {
      selectChat(item)
    }
  }
  const onDoubleClickListItem = (item: GroupChatListItem | DialogChatListItem) => {
    if (!tab.selectable) {
      clearTimeout(timer.current)

      if (isChatsTab) {
        dispatch(managerSliceActions.setChatsTabExtra('addChatsToFolder'))
      }
      if (isPersonalTab) {
        return
      }
      if (isFolderTab) {
        dispatch(managerSliceActions.setFolderTabExtra({ id: tab.id, extra: 'deleteFolderChats' }))
      }

      selectChat(item)
    }
  }

  return (
    <Col
      className={cs({
        [styles.ChatList]: true,
        [styles.vertical]: !frontier,
        [styles.horizontal]: frontier,
        [styles.selectable]: tab.selectable,
      })}
    >
      <ChatListExtra id={id} />
      <Scrollbars universal autoHide style={{ height: '100%' }}>
        <List split={true} style={{ width: '100%' }}>
          {tab.list.map(item => (
            <List.Item
              key={item.id}
              style={{ padding: 0 }}
              onClick={() => onClickListItem(item)}
              onDoubleClick={() => onDoubleClickListItem(item)}
            >
              <ChatListItem
                item={item}
                selected={tab.selected.hasOwnProperty(item.id)}
                userID={auth.info.userID!}
                timezone={global.client.timezone!}
              />
            </List.Item>
          ))}
          {isFolderTab && (
            <List.Item
              key={'addFolderChats'}
              style={{ padding: 0 }}
              onClick={() => onClickAddFolderChats()}
            >
              <div className={styles.addFolderChats}><PlusOutlined /></div>
            </List.Item>
          )}
        </List>
      </Scrollbars>
    </Col>
  )
}

export default ChatList
