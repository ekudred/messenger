import React, { FC } from 'react'

import MessengerLayout from './Layout'
import MessengerManager from './Manager'

const Messenger: FC = () => {
  return (
    <MessengerLayout>
      <MessengerManager />
    </MessengerLayout>
  )
}

export default Messenger