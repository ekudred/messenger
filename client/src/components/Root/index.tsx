import React, { FC } from 'react'
import { Outlet } from 'react-router-dom'

import RootLayout from './Layout'

const Root: FC = () => {
  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  )
}

export default Root
