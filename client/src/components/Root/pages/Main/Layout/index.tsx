import React, { FC, ReactNode } from 'react'
import { Layout } from 'antd'

import Header from '../Header'
import Navbar from '../Navbar'

import { useAppSelector } from 'hooks/store'
import useNotificationEffect from 'hooks/useNotificationEffect'

import styles from './Layout.module.less'

interface MainLayoutProps {
  children?: ReactNode
}

const MainLayout: FC<MainLayoutProps> = (props) => {
  const { children } = props

  const { auth } = useAppSelector(store => store)
  const { confirm: confirmAction } = auth.actions

  const confirmInfo = { message: '', description: '' }
  if (confirmAction.status === 'succeeded') {
    confirmInfo.message = 'Fine!'
    confirmInfo.description = confirmAction.message!
  }
  if (confirmAction.status === 'failed') {
    confirmInfo.message = 'Error'
    confirmInfo.description = confirmAction.message!
  }

  useNotificationEffect(
    { ...confirmInfo },
    notification => {
      if (confirmAction.status === 'succeeded') notification.success()
      if (confirmAction.status === 'failed') notification.error()
    },
    [confirmAction]
  )

  return (
    <Layout className={styles.MainLayout}>
      <Header />
      <Layout className={styles.main}>
        <Navbar />
        <Layout.Content>
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout