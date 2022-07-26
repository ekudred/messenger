import React, { FC } from 'react'
import { Outlet } from 'react-router-dom'

import AuthLayout from './Layout'

const Auth: FC = () => {
  return (
    <AuthLayout>
      <Outlet/>
    </AuthLayout>
  )
}

export default Auth