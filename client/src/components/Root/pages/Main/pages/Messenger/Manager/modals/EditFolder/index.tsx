import React, { FC, useEffect, useState } from 'react'
import { Button, Form, Input, Modal } from 'antd'

import { useAppDispatch, useAppSelector } from 'hooks/store'
import { managerSliceActions } from 'store/reducers/messenger/manager'
import { FolderManagerActions } from 'store/actions/messenger'
import { selectTab } from 'store/selectors/messenger'
import checkAntForm from 'helpers/checkAntForm'
import { RegExpFolderName } from 'utils/reg-exps'
import { FolderTab } from 'store/types/messenger/manager'

interface EditFolderModalProps {
  folderID: string
}

const EditFolderModal: FC<EditFolderModalProps> = props => {
  const { folderID } = props

  const folderTab = (useAppSelector(selectTab(folderID)) as FolderTab)!

  const initialValues = { name: folderTab.name }
  const [isEdit, setEdit] = useState(false)
  const [form] = Form.useForm()

  const dispatch = useAppDispatch()

  const handleCancel = () => {
    dispatch(managerSliceActions.setFolderTabModal({ id: folderID, field: 'editFolder', action: { visible: false } }))
  }

  const handleSubmit = () => {
    const { name: folderName } = form.getFieldsValue()

    dispatch({
      type: FolderManagerActions.EDIT_FOLDER,
      payload: {
        folderID,
        folderName,
        list: { deleted: { dialogs: [], groups: [] }, added: { dialogs: [], groups: [] } },
      },
    })
  }

  const afterCloseModal = () => {
    form.resetFields()
  }

  const onFieldsChange = () => {
    checkAntForm(form, { initialValues, setEdit, isEmpty: true })
  }

  useEffect(() => {
    if (folderTab.modals.editFolder.visible) {
      form.setFieldsValue(initialValues)
    }
  }, [folderTab.modals.editFolder.visible])

  return (
    <Modal
      title='Edit folder'
      visible={folderTab.modals.editFolder.visible}
      forceRender
      confirmLoading={folderTab.actions.editFolder.status === 'loading'}
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
          loading={folderTab.actions.editFolder.status === 'loading'}
          onClick={handleSubmit}
        >
          Edit
        </Button>,
      ]}
    >
      <Form name='editFolder' layout='vertical' form={form} onFieldsChange={onFieldsChange}>
        <Form.Item name='name' rules={[{ pattern: new RegExp(RegExpFolderName), message: 'Length: 4-16' }]}>
          <Input placeholder='Please change name the folder' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditFolderModal
