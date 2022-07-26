import { FC, useEffect, useState } from 'react'
import { Form, Button, Modal, Input } from 'antd'
import { LockOutlined } from '@ant-design/icons'

import { useAppDispatch, useAppSelector } from 'hooks/store'
import { profileSliceActions } from 'store/reducers/profile'
import checkAntForm from 'helpers/checkAntForm'

import { ProfileActions } from 'store/actions/profile'
import { RegExpPassword } from 'utils/reg-exps'

const ConfirmModal: FC = () => {
  const { auth, profile } = useAppSelector(store => store)
  const { userID } = auth.info
  const { confirm: confirmAction } = auth.actions
  const { confirmModal } = profile.modals

  const initialValues = { confirm: null }
  const [isEdit, setEdit] = useState(false)
  const [formModal] = Form.useForm()

  const dispatch = useAppDispatch()

  const handleCancel = () => {
    dispatch(profileSliceActions.setModal({ field: 'confirmModal', action: { visible: false } }))
  }
  const handleSubmit = () => {
    dispatch({ type: ProfileActions.CONFIRM, payload: { id: userID, password: formModal.getFieldValue('confirm') } })
  }

  const afterCloseModal = () => {
    formModal.resetFields()
  }

  const onFieldsChange = () => {
    checkAntForm(formModal, { initialValues, setEdit, isEmpty: true })
  }

  useEffect(() => {
    if (confirmModal.visible) {
      formModal.setFieldsValue(initialValues)
    }
  }, [confirmModal.visible])

  return (
    <Modal
      title="Confirm password"
      visible={confirmModal.visible}
      forceRender
      confirmLoading={confirmAction.status === 'loading'}
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
          loading={confirmAction.status === 'loading'}
          onClick={handleSubmit}
        >
          Confirm
        </Button>,
      ]}
    >
      <Form name="confirmPassword" layout="vertical" form={formModal} onFieldsChange={onFieldsChange}>
        <Form.Item name="confirm" rules={[{ pattern: new RegExp(RegExpPassword), message: 'Length: 8-32' }]}>
          <Input.Password
            prefix={<LockOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
            placeholder="Please confirm your current password"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ConfirmModal