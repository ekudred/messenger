import React, { FC } from 'react'
import { UnorderedListOutlined, FolderOutlined, LoadingOutlined } from '@ant-design/icons'
import { Row, Typography } from 'antd'
import cs from 'classnames'

import styles from './Tab.module.less'

export interface MessengerManagerTabProps {
  name?: string
  id?: string
  position: 'vertical' | 'horizontal'
  loading?: boolean
}

const MessengerManagerTab: FC<MessengerManagerTabProps> = (props) => {
  const { name, id, position, loading } = props

  const isChats = id === '0'
  const isPersonal = id === '1'
  const isFolder = !isChats && !isPersonal

  return (
    <Row className={cs({
      [styles.MessengerManagerTab]: true,
      [styles.vertical]: position === 'vertical',
      [styles.horizontal]: position === 'horizontal'
    })}>
      <Typography.Paragraph ellipsis className={cs({ [styles.content]: true, [styles.loading]: loading })}>
        {isChats && position === 'vertical' &&
          <UnorderedListOutlined className={cs({ [styles.icon]: true, [styles.loading]: loading })} />}
        {isPersonal && position === 'vertical' &&
          <UnorderedListOutlined className={cs({ [styles.icon]: true, [styles.loading]: loading })} />}
        {isFolder && position === 'vertical' &&
          <FolderOutlined className={cs({ [styles.icon]: true, [styles.loading]: loading })} />}
        {loading && !id && <LoadingOutlined className={cs({ [styles.icon]: true, [styles.loading]: loading })} />}
        {!loading ? (name ?? '') : 'Loading...'}
      </Typography.Paragraph>
    </Row>
  )
}

export default MessengerManagerTab