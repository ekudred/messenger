import React, { FC, ReactNode, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { GlobalActions } from 'store/actions/global'

interface AppGlobalProps {
  children?: ReactNode
}

const AppGlobal: FC<AppGlobalProps> = ({ children }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: GlobalActions.GET_RESULT_FP })
  }, [])

  return <>{children}</>
}

export default AppGlobal
