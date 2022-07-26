import React, { FC, ReactNode } from 'react'
import { Provider } from 'react-redux'

import store from 'store'

interface AppProviderProps {
  children?: ReactNode
}

const AppProvider: FC<AppProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>
}

export default AppProvider
