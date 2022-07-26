import React, { FC, lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { ReduxRouter } from '@lagunovsky/redux-react-router'

import { useAppSelector } from 'hooks/store'
import { history } from 'store'
import CustomSpin from '../common/CustomSpin'

import Root from '../Root'
import NotFound from '../Root/pages/NotFound'
import Messenger from '../Root/pages/Main/pages/Messenger'
import Profile from '../Root/pages/Main/pages/Profile'
import Settings from '../Root/pages/Main/pages/Settings'
import SignIn from '../Root/pages/Auth/pages/SignIn'
import SignUp from '../Root/pages/Auth/pages/SignUp'

const Main = lazy(() => import('../Root/pages/Main'))
const Auth = lazy(() => import('../Root/pages/Auth'))

const AppRouter: FC = () => {
  const { isAuth } = useAppSelector(store => store.auth)

  return (
    <ReduxRouter history={history}>
      <Routes>
        <Route
          path={'/'}
          element={
            <Suspense fallback={<CustomSpin />}>
              <Root />
            </Suspense>
          }
        >
          <Route path={''} element={isAuth ? <Main /> : <Navigate to={'/sign-in'} />}>
            <Route index element={<Navigate to={'messenger'} />} />
            <Route path={'messenger'} element={<Messenger />} />
            <Route path={'profile'} element={<Profile />} />
            <Route path={'settings'} element={<Settings />} />
          </Route>
          <Route path={''} element={!isAuth ? <Auth /> : <Navigate to={'/messenger'} />}>
            <Route index element={<Navigate to={'sign-in'} />} />
            <Route path={'sign-in'} element={<SignIn />} />
            <Route path={'sign-up'} element={<SignUp />} />
          </Route>
          <Route path={'*'} element={<NotFound />} />
        </Route>
      </Routes>
    </ReduxRouter>
  )
}

export default AppRouter
