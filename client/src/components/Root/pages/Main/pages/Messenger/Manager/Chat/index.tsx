import React, { FC, useEffect, useState } from 'react'
import { Layout, Col } from 'antd'
import cs from 'classnames'

import { useAppDispatch, useAppSelector } from 'hooks/store'
import { chatSliceActions } from 'store/reducers/messenger/chat'
import { ChatActions } from 'store/actions/messenger'
import ChatHead from './Head'
import ChatMessageList from './MessageList'
import ChatExtra from './Extra'
import ChatInput from './Input'
import useQuery from 'hooks/useQuery'

import styles from './Chat.module.less'

interface ChatProps {
  frontier?: boolean
}

const Chat: FC<ChatProps> = props => {
  const { frontier } = props

  const { messenger, auth } = useAppSelector(store => store)
  const { id, type } = messenger.chat.head
  const { joinChat: joinChatAction } = messenger.chat.actions
  const { userID } = auth.info

  const [visible, setVisible] = useState(false)

  const query = useQuery()
  const chatQuery =
    (query.has('user') && ['user', query.get('user')]) || (query.has('group') && ['group', query.get('group')]) || false

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (chatQuery && messenger.chat.socket.connected) {
      setVisible(true)
      dispatch({ type: ChatActions.JOIN_CHAT, payload: { type: chatQuery[0], id: chatQuery[1], userID } })
    }
    if (!chatQuery && (joinChatAction.status === 'done' || joinChatAction.status === 'failed')) {
      setVisible(false)
      dispatch({ type: ChatActions.LEAVE_CHAT, payload: { id, type } })
      dispatch(chatSliceActions.clear())
      dispatch(chatSliceActions.setAction({ field: 'joinChat', action: { status: 'idle' } }))
    }
  }, [chatQuery, messenger.chat.socket.connected])

  useEffect(() => {
    return () => {
      dispatch(chatSliceActions.clear())
    }
  }, [])

  return visible ? (
    <Layout.Content
      className={cs({
        [styles.Chat]: true,
        [styles.desktop]: !frontier,
        [styles.mobile]: frontier,
      })}
    >
      <ChatHead />
      <Col className={styles.body}>
        <ChatMessageList />
        <ChatExtra />
        <ChatInput />
      </Col>
    </Layout.Content>
  ) : (
    <></>
  )
}

export default Chat