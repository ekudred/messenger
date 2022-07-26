import React, { FC } from 'react'
import { Button, Col } from 'antd'
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons'

import { PersonalChatsTab } from 'store/types/messenger/manager'
import { managerSliceActions } from 'store/reducers/messenger/manager'
import { useAppDispatch } from 'hooks/store'
import CreateGroupModal from '../../../modals/CreateGroup'

interface PersonalChatsExtraProps {
  tab: PersonalChatsTab
}

const PersonalChatsExtra: FC<PersonalChatsExtraProps> = (props) => {
  const { tab } = props

  const dispatch = useAppDispatch()

  // CreateGroup
  const cancelCreateGroup = () => {
    dispatch(managerSliceActions.setPersonalChatsTabExtra(null),)
    dispatch(managerSliceActions.setPersonalChatsTabSelectable(false))

    dispatch(managerSliceActions.clearPersonalChatsTabSelected())
  }
  const showCreateGroupModal = () => {
    dispatch(managerSliceActions.setPersonalChatsTabModal({ field: 'createGroup', action: { visible: true } }))
  }

  return (
    <>
      {tab.extra === 'createGroup' && (
        <>
          <Col>
            <Button icon={<CloseOutlined />} shape={'circle'} onClick={() => cancelCreateGroup()} />
          </Col>
          <Col>
            <Button
              icon={<CheckOutlined />}
              shape={'circle'}
              onClick={() => showCreateGroupModal()}
              loading={tab.actions.createGroup.status === 'loading'}
              disabled={Object.keys(tab.selected).length < 1}
            />
          </Col>
          <CreateGroupModal />
        </>
      )}
    </>
  )
}

export default PersonalChatsExtra