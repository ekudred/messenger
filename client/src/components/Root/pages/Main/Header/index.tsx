import React, { FC, memo } from 'react'
import { Button, Col, Layout, Row } from 'antd'
import { MenuOutlined } from '@ant-design/icons'

import useWindowDimensions from 'hooks/useWindowDimensions'
import { navbarSliceActions } from 'store/reducers/navbar'
import { useAppDispatch, useAppSelector } from 'hooks/store'
import { MediaWidth } from 'utils/media'

import styles from './Header.module.less'

const Header: FC = () => {
  const { isAuth } = useAppSelector(store => store.auth)
  const { visible } = useAppSelector(store => store.navbar.drawer)

  const dispatch = useAppDispatch()
  const { width } = useWindowDimensions()

  const onClickButton = () => {
    dispatch(navbarSliceActions.showNavbarDrawer(!visible))
  }

  return (
    <Layout.Header className={styles.Header}>
      <Row className={styles.container} justify='space-between' align='middle'>
        {width <= MediaWidth.headerButtonVisible && isAuth &&
          <Button icon={<MenuOutlined />} onClick={onClickButton} />}
        <Col>Messenger</Col>
      </Row>
    </Layout.Header>
  )
}

export default Header