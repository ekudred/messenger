import React, { FC } from 'react'

import AppProvider from 'components/AppProvider'
import AppGlobal from 'components/AppGlobal'
import AppCheckAuth from 'components/AppCheckAuth'
import AppRouter from 'components/AppRouter'

import './App.less'

const App: FC = () => {
  return (
    <AppProvider>
      <AppGlobal>
        <AppCheckAuth>
          <AppRouter />
        </AppCheckAuth>
      </AppGlobal>
    </AppProvider>
  )
}

export default App
