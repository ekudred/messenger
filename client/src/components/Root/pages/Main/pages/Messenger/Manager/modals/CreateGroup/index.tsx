import React, { FC, useEffect, useState } from 'react'
import { Button, Form, Input, Modal } from 'antd'
import { RegExpFolderName } from 'utils/reg-exps'

import { useAppDispatch, useAppSelector } from 'hooks/store'
import checkAntForm from 'helpers/checkAntForm'
import { managerSliceActions } from 'store/reducers/messenger/manager'
import { selectTab } from 'store/selectors/messenger'
import { PersonalChatsTab } from 'store/types/messenger/manager'

const CreateGroupModal: FC = () => {
  const personalChatsTab = (useAppSelector(selectTab('1')) as PersonalChatsTab)!

  const initialValues = { name: null }
  const [isEdit, setEdit] = useState(false)
  const [form] = Form.useForm()

  const dispatch = useAppDispatch()

  const handleCancel = () => {
    dispatch(managerSliceActions.setPersonalChatsTabModal({ field: 'createGroup', action: { visible: false } }))
  }

  const handleSubmit = () => {
    // const { name } = form.getFieldsValue()

    // dispatch(managerSliceActions.setPersonalChatsTabModal({ field: 'createGroup', action: { visible: false } }))
  }

  const afterCloseModal = () => {
    form.resetFields()
  }

  const onFieldsChange = () => {
    checkAntForm(form, { initialValues, setEdit, isEmpty: true })
  }

  useEffect(() => {
    if (personalChatsTab.modals.createGroup.visible) {
      form.setFieldsValue(initialValues)
    }
  }, [personalChatsTab.modals.createGroup.visible])

  return (
    <Modal
      title="Create group"
      visible={personalChatsTab.modals.createGroup.visible}
      forceRender
      confirmLoading={personalChatsTab.actions.createGroup.status === 'loading'}
      afterClose={afterCloseModal}
      transitionName={''}
      maskTransitionName={''}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          disabled={!isEdit}
          loading={personalChatsTab.actions.createGroup.status === 'loading'}
          onClick={handleSubmit}
        >
          Select users
        </Button>,
      ]}
    >
      <Form name="createGroup" layout="vertical" form={form} onFieldsChange={onFieldsChange}>
        <Form.Item name="name" rules={[{ pattern: new RegExp(RegExpFolderName), message: 'Length: 4-16' }]}>
          <Input placeholder="Please name the group" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateGroupModal
