import React, { FC, ReactNode, useLayoutEffect } from 'react'
import { Layout } from 'antd'

import { useAppSelector } from 'hooks/store'
import { Paths } from 'utils/paths'

import styles from './Layout.module.less'

interface RootLayoutProps {
  children?: ReactNode
}

const RootLayout: FC<RootLayoutProps> = (props) => {
  const { children } = props

  const { pathname } = useAppSelector(store => store.router.location)

  useLayoutEffect(() => {
    switch (pathname) {
      case Paths.SIGN_IN:
        document.title = 'Messenger | Sign in'
        break
      case  Paths.SIGN_UP:
        document.title = 'Messenger | Sign up'
        break
      case  Paths.PROFILE:
        document.title = 'Messenger | Profile'
        break
      case  Paths.SETTINGS:
        document.title = 'Messenger | Settings'
        break
      case  Paths.NOT_FOUND:
        document.title = 'Messenger | Not found'
        break
      default:
        document.title = 'Messenger'
        break
    }
  }, [pathname])

  return (
    <Layout className={styles.RootLayout}>{children}</Layout>
  )
}

export default RootLayout