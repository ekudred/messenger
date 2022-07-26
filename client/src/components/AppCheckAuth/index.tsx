import React, { FC, ReactNode, useEffect } from 'react'

import { useAppDispatch, useAppSelector } from 'hooks/store'
import { AuthActions } from 'store/actions/auth'
import CustomSpin from 'components/common/CustomSpin'

interface AppCheckAuthProps {
  children?: ReactNode
}

const AppCheckAuth: FC<AppCheckAuthProps> = props => {
  const { children } = props

  const { auth, global } = useAppSelector(store => store)
  const { refresh: refreshAction, signIn: signInAction, signOut: signOutAction } = auth.actions

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (localStorage.getItem('accessToken') && global.client.id) {
      dispatch({ type: AuthActions.REFRESH })
    }
  }, [global.client.id])

  if (!localStorage.getItem('accessToken')) {
    return <>{children}</>
  }

  if (refreshAction.status === 'done' || signInAction.status === 'done' || signOutAction.status === 'done') {
    return <>{children}</>
  }

  if (refreshAction.status === 'failed') {
    return <>{children}</>
  }

  return <CustomSpin />
}

export default AppCheckAuth
