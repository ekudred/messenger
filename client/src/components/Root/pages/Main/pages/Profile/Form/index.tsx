import React, { FC, useState, useEffect, memo } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { Form, Row, Button, Col, Input, Typography, DatePicker, Upload, Badge, Image } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import moment from 'moment'

import { useAppDispatch, useAppSelector } from 'hooks/store'
import { profileSliceActions } from 'store/reducers/profile'
import { authSliceActions } from 'store/reducers/auth'
import { ProfileActions } from 'store/actions/profile'
import ConfirmModal from './ConfirmModal'
import checkAntForm from 'helpers/checkAntForm'
import { getBase64 } from 'utils/services'
import { RegExpFullName, RegExpPassword, RegExpPhoneNumber, RegExpUserName } from 'utils/reg-exps'
import { format } from 'utils/format'

import styles from './Form.module.less'

const ProfileForm: FC = () => {
  const { auth, profile } = useAppSelector(store => store)
  const { isConfirm } = auth
  const { userID } = auth.info
  const { user, isEdit } = profile

  const dispatch = useAppDispatch()

  const [form] = Form.useForm()
  const [initialValues, setInitialValues] = useState({
    avatar: user.avatar,
    username: user.username,
    fullname: user.fullname,
    birthdate: user.birthdate ? moment(user.birthdate, format.date) : null,
    email: null,
    phone: null,
    password: null,
  })

  const [fields, setFields] = useState<any>(initialValues)
  const [avatar, setAvatar] = useState<string | null>(initialValues.avatar)

  // Form
  const onFinish = () => {
    dispatch(profileSliceActions.setUser({ email: null, phone: null }))
    dispatch({
      type: ProfileActions.EDIT,
      payload: {
        id: userID,
        username: fields.username,
        fullname: fields.fullname,
        birthdate: fields.birthdate,
        phone: fields.phone,
        email: fields.email,
        avatar: avatar,
        password: fields.password,
      },
    })
    dispatch(profileSliceActions.setUser({ email: null, phone: null }))
    dispatch(authSliceActions.setConfirm(false))
    form.resetFields(['email', 'phone', 'password'])
  }
  const onReset = () => {
    setFields({ ...initialValues })
    setAvatar(initialValues.avatar)
    form.setFieldsValue({
      ...initialValues,
      birthdate: user.birthdate ? moment(user.birthdate, format.date) : null,
    })

    dispatch(profileSliceActions.setUser({ email: null, phone: null }))
    dispatch(authSliceActions.setConfirm(false))
    dispatch(profileSliceActions.setEdit(false))
  }

  const handleFieldsChange = () => {
    const { fieldsValue } = checkAntForm(form, {
      initialValues: initialValues,
      setEdit: value => dispatch(profileSliceActions.setEdit(value)),
    })

    setFields(fieldsValue)
  }

  // Form Fields
  const handleConfirm = () => {
    dispatch(
      profileSliceActions.setModal({
        field: 'confirmModal',
        action: { visible: true },
      })
    )
  }
  const handleCancelConfirmation = () => {
    dispatch(authSliceActions.setConfirm(false))
    dispatch(profileSliceActions.setUser({ email: null, phone: null }))
    form.resetFields(['email', 'phone', 'password'])
    handleFieldsChange()
  }

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError, onProgress } = options

    const result = await getBase64(file)
    setAvatar(result)
  }

  useEffect(() => {
    if (!isConfirm) {
      const values = {
        avatar: user.avatar,
        username: user.username,
        fullname: user.fullname,
        birthdate: user.birthdate ? moment(user.birthdate, format.date) : null,
        email: null,
        phone: null,
        password: null,
      }

      setInitialValues(values)
      form.setFieldsValue(values)
    }
  }, [user])

  useEffect(() => {
    return () => {
      if (isConfirm) dispatch(authSliceActions.setConfirm(false))
      if (isEdit) dispatch(profileSliceActions.setEdit(false))
    }
  }, [])

  return (
    <Scrollbars universal autoHide>
      <Form
        name="profile"
        className={styles.ProfileForm}
        layout="vertical"
        form={form}
        initialValues={initialValues}
        onFieldsChange={handleFieldsChange}
        onFinish={onFinish}
        onReset={onReset}
      >
        <Row className={styles.header} justify="center" align="middle">
          <Badge
            count={
              <Form.Item name="avatar" valuePropName="fileName">
                <Upload
                  name="avatar"
                  className={styles.editAvatar}
                  multiple={false}
                  showUploadList={false}
                  customRequest={customRequest}
                >
                  <Button className={styles.button} icon={<EditOutlined />} />
                </Upload>
              </Form.Item>
            }
          >
            <Image src={avatar!} className={styles.avatar} preview={{ maskClassName: styles.avatarMask }} />
          </Badge>
          <Typography.Title className={styles.title} level={3}>
            {fields.username}
          </Typography.Title>
        </Row>
        <Col className={styles.body}>
          <Row className={styles.columns} justify="center">
            <Col className={styles.column}>
              <Form.Item
                name="username"
                label={<Typography.Title level={5}>Username</Typography.Title>}
                rules={[
                  () => ({
                    validator(_: any, value: any) {
                      if (initialValues.username) {
                        if (!value || value.trim() == '') {
                          return Promise.reject(new Error('Username must not be empty'))
                        }
                      }
                      return Promise.resolve()
                    },
                  }),
                  {
                    pattern: new RegExp(RegExpUserName),
                    message: 'Example: Example_123',
                  },
                ]}
              >
                <Input style={{ width: 'calc(100%)' }} placeholder={'Please enter your username'} />
              </Form.Item>
              <Form.Item
                name="fullname"
                label={<Typography.Title level={5}>Full name</Typography.Title>}
                rules={[
                  () => ({
                    validator(_: any, value: any) {
                      if (initialValues.fullname) {
                        if (!value || value.trim() == '') {
                          return Promise.reject(new Error('Full name must not be empty'))
                        }
                      }
                      return Promise.resolve()
                    },
                  }),
                  {
                    pattern: new RegExp(RegExpFullName),
                    message: 'Example: Full Name',
                  },
                ]}
              >
                <Input style={{ width: 'calc(100%)' }} placeholder={'Please enter your full name'} />
              </Form.Item>
              <Form.Item
                name="birthdate"
                label={<Typography.Title level={5}>Birthdate</Typography.Title>}
                rules={[
                  () => ({
                    validator(_: any, value: any) {
                      if (initialValues.birthdate) {
                        if (!value) {
                          return Promise.reject(new Error('Birthdate must not be empty'))
                        }
                      }
                      return Promise.resolve()
                    },
                  }),
                ]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format={format.date}
                  placeholder={'Please enter your birth date'}
                />
              </Form.Item>
            </Col>

            <Col className={styles.column}>
              <Form.Item
                name="email"
                label={<Typography.Title level={5}>Email</Typography.Title>}
                rules={[{ type: 'email', message: 'Example: example@email.com' }]}
              >
                {isConfirm ? (
                  <Input style={{ width: 'calc(100%)' }} placeholder={user.email! || 'Please enter your new email'} />
                ) : (
                  <Input
                    style={{ width: 'calc(100%)' }}
                    readOnly={!isConfirm}
                    placeholder="Click to change email"
                    onClick={handleConfirm}
                  />
                )}
              </Form.Item>
              <Form.Item
                name={'phone'}
                label={<Typography.Title level={5}>Phone number</Typography.Title>}
                rules={[
                  {
                    pattern: new RegExp(RegExpPhoneNumber),
                    message: 'Example: 12312312312, +12312312312',
                  },
                ]}
              >
                {isConfirm ? (
                  <Input
                    style={{ width: 'calc(100%)' }}
                    placeholder={user.phone! || 'Please enter your new phone number'}
                  />
                ) : (
                  <Input
                    style={{ width: 'calc(100%)' }}
                    readOnly={!isConfirm}
                    placeholder="Click to change phone number"
                    onClick={handleConfirm}
                  />
                )}
              </Form.Item>
              <Form.Item
                name={'password'}
                label={<Typography.Title level={5}>Password</Typography.Title>}
                rules={[
                  {
                    pattern: new RegExp(RegExpPassword),
                    message: 'Length: 8-32',
                  },
                ]}
              >
                {isConfirm ? (
                  <Input.Password style={{ width: 'calc(100%)' }} placeholder="Please enter your new password" />
                ) : (
                  <Input
                    style={{ width: 'calc(100%)' }}
                    readOnly={!isConfirm}
                    placeholder="Click to change password"
                    onClick={handleConfirm}
                  />
                )}
              </Form.Item>
              <ConfirmModal />
            </Col>
          </Row>
          <Row className={styles.buttons} justify="end">
            {isConfirm && (
              <Form.Item style={{ margin: 0 }}>
                <Button type="default" onClick={handleCancelConfirmation}>
                  Cancel confirmation
                </Button>
              </Form.Item>
            )}
            <Form.Item style={{ margin: '0 0 0 8px' }}>
              <Button
                type="default"
                htmlType="reset"
                disabled={!isEdit && !form.getFieldsError().some(field => field.errors.length != 0)}
              >
                Cancel
              </Button>
            </Form.Item>
            <Form.Item style={{ margin: '0 0 0 8px' }}>
              <Button type="primary" htmlType="submit" disabled={!isEdit}>
                Save
              </Button>
            </Form.Item>
          </Row>
        </Col>
      </Form>
    </Scrollbars>
  )
}

export default ProfileForm
