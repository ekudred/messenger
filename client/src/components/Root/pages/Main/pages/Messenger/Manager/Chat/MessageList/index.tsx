import React, { useEffect, useState, useRef, memo, Fragment, useMemo } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { List, Col, Row } from 'antd'
import { InView } from 'react-intersection-observer'
import cs from 'classnames'
import moment from 'moment-timezone'
import debounce from 'lodash/debounce'

import { useAppDispatch, useAppSelector } from 'hooks/store'
import { ChatActions } from 'store/actions/messenger'
import ChatMessageListContainer from './Container'
import ChatMessageListItem from './Item'
import { format } from 'utils/format'

import styles from './MessageList.module.less'

const ChatMessageList = memo(() => {
  const { messenger, global, auth } = useAppSelector(store => store)
  const { userID } = auth.info
  const { messages, unreadMessages } = messenger.chat.body
  const { type: chatType, id: chatID, roster } = messenger.chat.head
  const { joinChat: joinChatAction, sendMessage: sendMessageAction } = messenger.chat.actions
  const timezone = global.client.timezone

  const scrollbarsRef = useRef(null as any)

  const [visibleUnreadMessages, setVisibleUnreadMessages] = useState<{ id: string }[]>([])

  const dispatch = useAppDispatch()

  const handleViewMessages = (payload: any) => {
    dispatch({ type: ChatActions.VIEW_MESSAGES, payload })
    setVisibleUnreadMessages([])
  }

  const debouncedViewMessages = useMemo(() => debounce(handleViewMessages, 500), [])

  useEffect(() => () => debouncedViewMessages.cancel(), [])

  useEffect(() => {
    if (visibleUnreadMessages.length <= unreadMessages! && visibleUnreadMessages.length !== 0) {
      debouncedViewMessages({ userID, chatType, chatID, roster, viewMessages: visibleUnreadMessages })
    }
  }, [visibleUnreadMessages])

  // useEffect(() => {
  //   if (joinChatAction.status === 'done') {
  //     if (messenger.chat.body.unreadMessages !== 0) {
  //       if (!a && unreadMessages.length === messenger.chat.body.unreadMessages) {
  //         setA(true)
  //       }
  //
  //       if (a) {
  //         const sortedUnreadMessages = unreadMessages.sort((a, b) => a.y - b.y)
  //         scrollbarsRef.current.scrollTop(sortedUnreadMessages[0].y - sortedUnreadMessages[0].height - 48 - 35)
  //       }
  //     }
  //   }
  // }, [unreadMessages, a])


  useEffect(() => {
    if (joinChatAction.status === 'done' && messenger.chat.body.unreadMessages === 0) {
      scrollbarsRef.current.scrollToBottom()
    }
  }, [joinChatAction.status])

  useEffect(() => {
    if (sendMessageAction.status === 'loading') {
      scrollbarsRef.current.scrollToBottom()
    }
  }, [sendMessageAction.status])

  return (
    <Col className={styles.ChatMessageList} flex={'1'}>
      <Scrollbars universal autoHide ref={scrollbarsRef} style={{ height: 'calc(100%)' }}>
        <ChatMessageListContainer>
          <List className={styles.list} split={false}>
            {
              messages.map((message, i) => {
                const parent =
                  messages[i - 1]
                    ? (
                      messages[i - 1].type !== message.type ||
                      messages[i] === messages[0] ||
                      messages[i - 1].author.id !== message.author.id ||
                      moment(messages[i - 1].createdAt).format(format.messageTime) !== moment(message.createdAt).format(format.messageTime)
                    )
                    : true

                const nextDate = messages[i - 1]
                  ? moment(messages[i].createdAt).isAfter(messages[i - 1].createdAt, 'day')
                  : true

                return (
                  <Fragment key={message.id}>
                    {
                      nextDate &&
                      <Row
                        justify={'center'}
                        style={{ width: '100%', padding: '8px', fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)' }}
                      >
                        {moment(message.createdAt).tz(timezone!).format(format.date)}
                      </Row>
                    }
                    <List.Item
                      key={message.id}
                      className={cs({ [styles.item]: true, [styles.parent]: parent })}
                    >
                      {
                        message.type === 'me' && !message.read
                          ? (
                            <InView
                              style={{ width: '100%' }}
                              onChange={(inView) => {
                                if ((visibleUnreadMessages.length <= unreadMessages!) && inView) {
                                  setVisibleUnreadMessages([...visibleUnreadMessages, { id: message.id }])
                                }
                              }}>
                              <ChatMessageListItem parent={parent} message={message} timezone={timezone!} />
                            </InView>
                          )
                          : <ChatMessageListItem parent={parent} message={message} timezone={timezone!} />
                      }
                    </List.Item>
                  </Fragment>
                )
              })
            }
          </List>
        </ChatMessageListContainer>
      </Scrollbars>
    </Col>
  )
})

export default ChatMessageList