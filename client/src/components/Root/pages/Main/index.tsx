import React, { FC, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from 'hooks/store'
import { ChatActions, ChatManagerActions, FolderManagerActions } from 'store/actions/messenger'
import MainLayout from './Layout'

const Main: FC = () => {
  const { auth } = useAppSelector(store => store)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (auth.info.accessToken) {
      dispatch({ type: ChatManagerActions.CONNECT })
      dispatch({ type: FolderManagerActions.CONNECT })
      dispatch({ type: ChatActions.CONNECT })
    }

    return () => {
      dispatch({ type: ChatManagerActions.DISCONNECT })
      dispatch({ type: FolderManagerActions.DISCONNECT })
      dispatch({ type: ChatActions.DISCONNECT })
    }
  }, [auth.info.accessToken])

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}

export default Main