import React, { FC, memo } from 'react'
import { Layout } from 'antd'

import useWindowDimensions from 'hooks/useWindowDimensions'
import { MediaWidth } from 'utils/media'
import NavbarDrawer from './Drawer'
import NavbarMenu from './Menu'

import styles from './Navbar.module.less'

const Navbar: FC = () => {
  const { width } = useWindowDimensions()

  return (
    width > MediaWidth.navbarVisible
      ? (
        <Layout.Sider className={styles.Navbar} collapsed={width < MediaWidth.navbarCollapsed}>
          <NavbarMenu />
        </Layout.Sider>
      ) : (
        <NavbarDrawer />
      )
  )
}

export default Navbar