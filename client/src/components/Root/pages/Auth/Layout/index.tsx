import React, { FC, ReactNode } from 'react'
import { Layout, Row } from 'antd'

import { useAppSelector } from 'hooks/store'
import useNotificationEffect from 'hooks/useNotificationEffect'

import styles from './Layout.module.less'

interface AuthLayoutProps {
  children?: ReactNode
}

const AuthLayout: FC<AuthLayoutProps> = (props) => {
  const { children } = props

  const { signUp: signUpAction, signIn: signInAction } = useAppSelector(store => store.auth.actions)

  const authInfo = { message: '', description: '' }
  if (signInAction.status === 'failed') {
    authInfo.message = 'Error'
    authInfo.description = signInAction.message!
  }
  if (signUpAction.status === 'succeeded') {
    authInfo.message = 'Fine!'
    authInfo.description = signUpAction.message!
  }
  if (signUpAction.status === 'failed') {
    authInfo.message = 'Error'
    authInfo.description = signUpAction.message!
  }

  useNotificationEffect(
    { ...authInfo },
    notification => {
      if (signInAction.status === 'failed') {
        notification.error()
      }
      if (signUpAction.status === 'succeeded') {
        notification.success()
      }
      if (signUpAction.status === 'failed') {
        notification.error()
      }
    },
    [signInAction, signUpAction]
  )

  return (
    <Layout className={styles.AuthLayout}>
      <Row style={{ height: '100%' }} justify="center" align="middle">
        {children}
      </Row>
    </Layout>
  )
}

export default AuthLayout