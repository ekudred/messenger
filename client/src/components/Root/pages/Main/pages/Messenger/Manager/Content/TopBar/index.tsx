import React, { FC } from 'react'
import { Col, Row } from 'antd'

import TopBarSearch from './Search'
import TopBarDropdown from './Dropdown'
import DeleteFolderModal from '../../modals/DeleteFolder'
import EditFolderModal from '../../modals/EditFolder'

import styles from './TopBar.module.less'

interface TopBarProps {
  id: string
}

const TopBar: FC<TopBarProps> = props => {
  const { id } = props

  const isChatsTab = id === '0'
  const isPersonalTab = id === '1'
  const isFolderTab = !isChatsTab && !isPersonalTab

  return (
    <Row className={styles.TopBar}>
      <Col className={styles.search}>
        <TopBarSearch id={id} />
      </Col>
      <Col className={styles.dropdown}>
        <TopBarDropdown id={id} />
      </Col>
      {isFolderTab && (
        <>
          <DeleteFolderModal folderID={id} />
          <EditFolderModal folderID={id} />
        </>
      )}
    </Row>
  )
}

export default TopBar
