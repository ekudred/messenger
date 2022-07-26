import React, { FC, ReactNode, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu } from 'antd'
import { UserOutlined, SettingOutlined, MessageOutlined, LogoutOutlined } from '@ant-design/icons'

import { useAppDispatch, useAppSelector } from 'hooks/store'
import { navbarSliceActions } from 'store/reducers/navbar'
import useWindowDimensions from 'hooks/useWindowDimensions'
import { AuthActions } from 'store/actions/auth'
import { MediaWidth } from 'utils/media'
import { Paths } from 'utils/paths'

import styles from './Menu.module.less'

interface MenuItem {
  path: string
  name: string
  icon: ReactNode
}

const NavbarMenu: FC = () => {
  const { pathname } = useAppSelector(store => store.router.location)

  const dispatch = useAppDispatch()
  const { width } = useWindowDimensions()

  const items = useMemo<MenuItem[]>(() => [
    { name: 'Profile', path: Paths.PROFILE, icon: <UserOutlined /> },
    { name: 'Messenger', path: Paths.MESSENGER, icon: <MessageOutlined /> },
    { name: 'Settings', path: Paths.SETTINGS, icon: <SettingOutlined /> },
  ], [])

  const closeDrawer = () => {
    if (width < MediaWidth.navbarVisible) {
      dispatch(navbarSliceActions.showNavbarDrawer(false))
    }
  }

  const signOut = () => {
    dispatch({ type: AuthActions.SIGN_OUT })
  }

  return (
    <Menu
      mode="vertical"
      selectedKeys={[pathname]}
      className={styles.NavbarMenu}
      items={[
        ...items.map(item => ({
          key: item.path,
          icon: item.icon,
          onClick: closeDrawer,
          label: <NavLink to={item.path}>{item.name}</NavLink>,
        })),
        {
          key: 'sign-out',
          icon: <LogoutOutlined />,
          onClick: signOut,
          label: 'Sign out',
        },
      ]}
    />
  )
}

export default NavbarMenu
