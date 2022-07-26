import React, { FC } from 'react'

import ProfileLayout from './Layout'
import ProfileForm from './Form'

const Profile: FC = () => {
  return (
    <ProfileLayout>
      <ProfileForm />
    </ProfileLayout>
  )
}

export default Profile