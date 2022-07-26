import React, { FC, useEffect, useState } from 'react'
import { Button, Form, Input, Modal } from 'antd'

import { useAppDispatch, useAppSelector } from 'hooks/store'
import checkAntForm from 'helpers/checkAntForm'
import { managerSliceActions } from 'store/reducers/messenger/manager'
import { RegExpFolderName } from 'utils/reg-exps'
import { selectTab } from 'store/selectors/messenger'
import { ChatsTab } from 'store/types/messenger/manager'
import { FolderManagerActions } from '../../../../../../../../../store/actions/messenger'

const CreateFolderModal: FC = () => {
  const chatsTab = (useAppSelector(selectTab('0')) as ChatsTab)!
  const { userID } = useAppSelector(store => store.auth.info)

  const initialValues = { name: null }
  const [isEdit, setEdit] = useState(false)
  const [form] = Form.useForm()

  const dispatch = useAppDispatch()

  const handleCancel = () => {
    dispatch(managerSliceActions.setChatsTabModal({ field: 'createFolder', action: { visible: false } }))
  }

  const handleSubmit = () => {
    const { name } = form.getFieldsValue()

    const dialogs = Object.entries(chatsTab.selected)
      .filter(([_, type]) => type === 'user')
      .map(item => ({ id: item[0] }))
    const groups = Object.entries(chatsTab.selected)
      .filter(([_, type]) => type === 'group')
      .map(item => ({ id: item[0] }))

    dispatch({
      type: FolderManagerActions.CREATE_FOLDER,
      payload: { userID, name, dialogs, groups },
    })
  }

  const afterCloseModal = () => {
    form.resetFields()
  }

  const onFieldsChange = () => {
    checkAntForm(form, { initialValues, setEdit, isEmpty: true })
  }

  useEffect(() => {
    if (chatsTab.modals.createFolder.visible) {
      form.setFieldsValue(initialValues)
    }
  }, [chatsTab.modals.createFolder.visible])

  return (
    <Modal
      title='Create folder'
      visible={chatsTab.modals.createFolder.visible}
      forceRender
      confirmLoading={chatsTab.actions.createFolder.status === 'loading'}
      afterClose={afterCloseModal}
      transitionName={''}
      maskTransitionName={''}
      onCancel={handleCancel}
      footer={[
        <Button key='cancel' onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key='submit'
          type='primary'
          disabled={!isEdit}
          loading={chatsTab.actions.createFolder.status === 'loading'}
          onClick={handleSubmit}
        >
          Create
        </Button>,
      ]}
    >
      <Form name='createFolder' layout='vertical' form={form} onFieldsChange={onFieldsChange}>
        <Form.Item name='name' rules={[{ pattern: new RegExp(RegExpFolderName), message: 'Length: 4-16' }]}>
          <Input placeholder='Please name the folder' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateFolderModal
