import React, { FC, ReactNode } from 'react'
import { Layout } from 'antd'

import { useAppSelector } from 'hooks/store'
import useNotificationEffect from 'hooks/useNotificationEffect'

import styles from './Layout.module.less'

interface ProfileLayoutProps {
  children?: ReactNode
}

const ProfileLayout: FC<ProfileLayoutProps> = (props) => {
  const { children } = props

  const { profile } = useAppSelector(store => store)
  const { edit: editAction } = profile.actions

  const profileInfo = { message: '', description: '' }
  if (editAction.status === 'succeeded') {
    profileInfo.message = 'Great!'
    profileInfo.description = editAction.message!
  }
  if (editAction.status === 'failed') {
    profileInfo.message = 'Error'
    profileInfo.description = editAction.message!
  }

  useNotificationEffect(
    { ...profileInfo },
    notification => {
      if (editAction.status === 'succeeded') notification.success()
      if (editAction.status === 'failed') notification.error()
    },
    [editAction]
  )

  return (
    <Layout className={styles.ProfileLayout}>{children}</Layout>
  )
}

export default ProfileLayout