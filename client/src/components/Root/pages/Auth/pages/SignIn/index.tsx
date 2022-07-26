import React, { FC, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Form, Input, Button } from 'antd'
import { LoginOutlined, UserOutlined, LockOutlined } from '@ant-design/icons'

import { useAppDispatch, useAppSelector } from 'hooks/store'
import { AuthActions } from 'store/actions/auth'
import checkAntForm from 'helpers/checkAntForm'
import { RegExpPassword, RegExpUserName } from 'utils/reg-exps'
import { Paths } from 'utils/paths'

import styles from './SignIn.module.less'

const SignIn: FC = () => {
  const { signIn: signInAction } = useAppSelector(store => store.auth.actions)

  const initialValues = { username: null, password: null }
  const [isEdit, setEdit] = useState(false)
  const [form] = Form.useForm()

  const dispatch = useAppDispatch()

  const onFinish = (values: any) => {
    if (isEdit) {
      dispatch({ type: AuthActions.SIGN_IN, payload: { username: values.username, password: values.password } })
    }
  }

  const onFieldsChange = () => {
    checkAntForm(form, { initialValues, setEdit, isEmpty: true })
  }

  return (
    <Form
      name='SignIn'
      form={form}
      className={styles.SignIn}
      layout='vertical'
      initialValues={initialValues}
      onFinish={onFinish}
      onFieldsChange={onFieldsChange}
    >
      <LoginOutlined className={styles.titleIcon} />
      <Form.Item
        name='username'
        hasFeedback={false}
        rules={[{ pattern: new RegExp(RegExpUserName), message: 'Example: Example_123' }]}
      >
        <Input prefix={<UserOutlined className={styles.inputIcon} />} placeholder='Username' />
      </Form.Item>
      <Form.Item
        name='password'
        hasFeedback={false}
        rules={[{ pattern: new RegExp(RegExpPassword), message: 'Length: 8-32' }]}
      >
        <Input prefix={<LockOutlined className={styles.inputIcon} />} type='password' placeholder='Password' />
      </Form.Item>
      <Form.Item>
        <Button
          type='primary'
          htmlType='submit'
          disabled={!isEdit}
          className={styles.button}
          loading={signInAction.status === 'loading'}
        >
          Sign in
        </Button>
        Or <NavLink to={Paths.SIGN_UP}>Sign Up now!</NavLink>
      </Form.Item>
    </Form>
  )
}

export default SignIn