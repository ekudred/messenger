import React, { useEffect, useCallback, DependencyList } from 'react'
import { notification } from 'antd'

interface NotificationInfo {
  message: string
  description: string
}

interface ExecuteOptions {
  success: () => void
  info: () => void
  error: () => void
  warning: () => void
}

const useNotificationEffect = (info: NotificationInfo, execute: (callbacks: ExecuteOptions) => void, deps: DependencyList) => {
  const openNotification = useCallback(() => {
    notification.config({ placement: 'bottomRight' })

    const options: ExecuteOptions = {
      success: () => notification.success({ ...info }),
      info: () => notification.info({ ...info }),
      error: () => notification.error({ ...info }),
      warning: () => notification.warning({ ...info })
    }

    return { ...options }
  }, [info])

  useEffect(() => {
    const notificationCallbacks = openNotification()

    execute(notificationCallbacks)
  }, deps)
}

export default useNotificationEffect
