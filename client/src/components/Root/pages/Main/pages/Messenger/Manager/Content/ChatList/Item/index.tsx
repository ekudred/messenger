import React, { FC } from 'react'
import { Avatar, Col, Row, Typography, Badge } from 'antd'
import moment from 'moment-timezone'
import cs from 'classnames'

import { GroupChatListItem, DialogChatListItem } from 'store/types/messenger/manager'
import { format } from 'utils/format'

import styles from './Item.module.less'

interface ChatListItemProps {
  item: (DialogChatListItem | GroupChatListItem)
  selected: boolean
  userID: string
  timezone: string
}

const ChatListItem: FC<ChatListItemProps> = (props) => {
  const { item, selected, userID, timezone } = props

  return (
    <Row
      className={
        cs({
          [styles.ChatListItem]: true,
          [styles.read]: item.unreadMessages !== 0,
          [styles.selected]: selected,
        })
      }
      align={'middle'}
      wrap={false}
    >
      <Col className={styles.presentation}>
        <Row className={styles.avatar}>
          <Avatar src={item.avatar} />
        </Row>
      </Col>
      <Col className={styles.content}>
        <Row className={styles.title} justify={'space-between'}>
          <Col className={styles.name}>
            <Typography.Paragraph ellipsis className={styles.paragraph}>
              {item.name}
            </Typography.Paragraph>
          </Col>
          <Col className={styles.date}>
            {
              item.lastMessage
                ? moment(item.lastMessage.createdAt).tz(timezone).format(`${format.date} ${format.messageTime}`)
                : ''
            }
          </Col>
        </Row>
        <Row className={styles.preview} justify={'space-between'}>
          <Col className={styles.message}>
            <Typography.Paragraph ellipsis className={styles.paragraph}>
              {
                item.lastMessage
                  ? userID === item.lastMessage.author.id
                    ? `You: ${item.lastMessage.text}`
                    : `${item.lastMessage.author.username}: ${item.lastMessage.text}`
                  : 'Write something'
              }
            </Typography.Paragraph>
          </Col>
          <Col className={styles.unreadMessages}>
            <Badge
              count={item.unreadMessages}
              style={{ position: 'relative', bottom: '2px', backgroundColor: '#99a2ad' }}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default ChatListItem