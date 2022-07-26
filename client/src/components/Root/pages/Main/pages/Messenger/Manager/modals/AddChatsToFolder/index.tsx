import React, { FC, useEffect, useState } from 'react'
import { Modal, Button, Form, Select, Alert } from 'antd'

import { useAppDispatch, useAppSelector } from 'hooks/store'
import { managerSliceActions } from 'store/reducers/messenger/manager'
import { FolderManagerActions } from 'store/actions/messenger'
import { selectTab } from 'store/selectors/messenger'
import { ChatsTab } from 'store/types/messenger/manager'
import checkAntForm from 'helpers/checkAntForm'

const AddChatsToFolderModal: FC = () => {
  const { folders } = useAppSelector(store => store.messenger.manager.tabs)
  const chatsTab = (useAppSelector(selectTab('0')) as ChatsTab)!

  const dispatch = useAppDispatch()

  const initialValues = { folder: null }
  const [isEdit, setEdit] = useState(false)
  const [formModal] = Form.useForm()

  const [existing, setExisting] = useState<any[]>([])

  const handleCancel = () => {
    dispatch(
      managerSliceActions.setChatsTabModal({
        field: 'addChatsToFolder',
        action: { visible: false },
      }),
    )
  }

  const handleSubmit = () => {
    const folder = JSON.parse(formModal.getFieldValue('folder'))

    if (folder.id) {
      const selected = Object.entries(chatsTab.selected).filter(item => !existing.some(ex => ex.id === item[0]))

      if (selected.length !== 0) {
        const added = selected.reduce(
          (total: any, chat) => {
            if (chat[1] === 'user') total.dialogs.push({ id: chat[0] })
            if (chat[1] === 'group') total.groups.push({ id: chat[0] })

            return total
          },
          { dialogs: [], groups: [] },
        )

        dispatch({
          type: FolderManagerActions.EDIT_FOLDER,
          payload: {
            folderID: folder.id,
            folderName: folder.name,
            list: { deleted: { dialogs: [], groups: [] }, added },
          },
        })
      }
    }
  }

  const onFieldsChange = () => {
    checkAntForm(formModal, { initialValues, setEdit })
  }

  const handleSelectFolder = (value: string) => {
    const folder = JSON.parse(value)

    folders[folder.id].list.forEach(item => {
      if (chatsTab.selected[item.id]) {
        setExisting(value => [...value, item])
      }
    })
  }

  return (
    <Modal
      title={`Add chats to folder`}
      visible={chatsTab.modals.addChatsToFolder.visible}
      forceRender
      // confirmLoading={folderTab.actions.editFolder.status === 'loading'}
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
          disabled={!isEdit || Object.keys(chatsTab.selected).length - existing.length === 0}
          // loading={chatsTab.actions.e.status === 'loading'}
          onClick={handleSubmit}
        >
          Add chats
        </Button>,
      ]}
    >
      <Form layout='vertical' name='editFolder' form={formModal} onFieldsChange={onFieldsChange}>
        <Form.Item
          label='Folders'
          name='folder'
          rules={[
            () => ({
              validator(_: any, value: any) {
                if (value.length === 0) {
                  return Promise.reject(new Error('You must select a folder'))
                }

                return Promise.resolve()
              },
            }),
          ]}
        >
          <Select
            placeholder={'Please select folder'}
            onChange={handleSelectFolder}
            options={Object.values(folders).map(folder => ({
              value: JSON.stringify({ id: folder.id, name: folder.name }),
              label: folder.name,
            }))}
          />
        </Form.Item>
        {
          existing.length !== 0 && existing.length !== Object.keys(chatsTab.selected).length &&
          (
            <Alert
              message={`You can add ${Object.keys(chatsTab.selected).length - existing.length} chats to the folder, as it already has:`}
              description={existing.map(item => item.name).join(', ')}
              type='warning'
            />
          )
        }
        {
          existing.length !== 0 && existing.length === Object.keys(chatsTab.selected).length &&
          (
            <Alert
              message="All selected chats already exist in this folder"
              type='warning'
            />
          )
        }
      </Form>
    </Modal>
  )
}

export default AddChatsToFolderModal
