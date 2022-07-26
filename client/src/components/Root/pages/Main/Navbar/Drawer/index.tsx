import React, { FC } from 'react'
import { Drawer } from 'antd'

import { useAppDispatch, useAppSelector } from 'hooks/store'
import { navbarSliceActions } from 'store/reducers/navbar'
import NavbarMenu from '../Menu'

const NavbarDrawer: FC = () => {
  const dispatch = useAppDispatch()
  const { visible } = useAppSelector(store => store.navbar.drawer)

  const onCloseDrawer = () => {
    dispatch(navbarSliceActions.showNavbarDrawer(false))
  }

  return (
    <Drawer
      title='Navbar'
      placement='left'
      headerStyle={{ display: 'flex', alignItems: 'center', height: '48px', padding: '0 16px' }}
      onClose={onCloseDrawer}
      visible={visible}
    >
      <NavbarMenu />
    </Drawer>
  )
}

export default NavbarDrawer