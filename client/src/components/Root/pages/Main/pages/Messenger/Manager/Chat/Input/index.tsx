import React, { FC, useState } from 'react'
import { Input, Button, Col, Row } from 'antd'
import { SendOutlined, PaperClipOutlined } from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'

import { useAppDispatch, useAppSelector } from 'hooks/store'
import { ChatActions } from 'store/actions/messenger'

import styles from './Input.module.less'

const ChatInput: FC = () => {
  const { messenger, auth } = useAppSelector(store => store)
  const { id: chatID, type: chatType } = messenger.chat.head
  const { joinChat: joinChatAction, sendMessage: sendMessageAction } = messenger.chat.actions
  const { userID } = auth.info

  const [text, setText] = useState<string>('')

  const dispatch = useAppDispatch()

  const sendMessage = () => {
    if (text.trim() !== '' && text.length <= 1024 && sendMessageAction.status === 'idle') {
      dispatch({
        type: ChatActions.SEND_MESSAGE,
        payload: { messageID: uuidv4(), userID, chatType, chatID, text }
      })

      setText('')
    }
  }

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value

    if ((value.trim() !== '' || value.length === 0) && value.length <= 1024) {
      setText(value)
    }
  }

  return (
    <Row className={styles.ChatInput} align="middle" gutter={16}>
      <Col>
        <Button
          shape={'circle'}
          size={'large'}
          disabled={chatType === 'empty' || joinChatAction.status === 'loading'}
          icon={<PaperClipOutlined />}
        />
      </Col>
      <Col className={styles.textArea} flex={'1'}>
        <Input.TextArea
          disabled={chatType === 'empty' || joinChatAction.status === 'loading'}
          placeholder={'message'}
          autoSize={{ minRows: 2, maxRows: 6 }}
          value={text}
          onChange={onChange}
          onPressEnter={sendMessage}
        />
      </Col>
      <Col>
        <Button
          shape={'circle'}
          size={'large'}
          disabled={chatType === 'empty' || joinChatAction.status === 'loading' || sendMessageAction.status !== 'idle' || text.trim() === ''}
          icon={<SendOutlined />}
          onClick={sendMessage}
        />
      </Col>
    </Row>
  )
}

export default ChatInput