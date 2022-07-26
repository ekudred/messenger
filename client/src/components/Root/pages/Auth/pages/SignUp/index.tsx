import React, { FC, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Form, Input, Button } from 'antd'
import { LoginOutlined } from '@ant-design/icons'

import { useAppDispatch, useAppSelector } from 'hooks/store'
import checkAntForm from 'helpers/checkAntForm'
import { RegExpPassword, RegExpUserName } from 'utils/reg-exps'
import { Paths } from 'utils/paths'
import { AuthActions } from 'store/actions/auth'

import styles from './SignUp.module.less'

const SignUp: FC = () => {
  const { signUp: signUpAction } = useAppSelector(store => store.auth.actions)

  const initialValues = { username: null, email: null, password: null, confirm: null }
  const [isEdit, setEdit] = useState(false)
  const [form] = Form.useForm()

  const dispatch = useAppDispatch()

  const onFinish = (values: any) => {
    if (isEdit) {
      const { username, email, password } = values
      dispatch({ type: AuthActions.SIGN_UP, payload: { username, email, password } })
    }
  }

  const onFieldsChange = () => {
    checkAntForm(form, { initialValues, setEdit, isEmpty: true })
  }

  return (
    <Form
      name='SignUp'
      form={form}
      className={styles.SignUp}
      layout='vertical'
      initialValues={initialValues}
      onFinish={onFinish}
      onFieldsChange={onFieldsChange}
    >
      <LoginOutlined className={styles.titleIcon} />
      <Form.Item
        name='username'
        label='Username'
        rules={[{ pattern: new RegExp(RegExpUserName), message: 'Example: Example_123' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name='email'
        label='Email'
        rules={[{ type: 'email', message: 'Example: example@email.com' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name='password'
        label='Password'
        rules={[{ pattern: new RegExp(RegExpPassword), message: 'Length: 8-32' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name='confirm'
        label='Confirm Password'
        dependencies={['password']}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('The two passwords that you entered do not match'))
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type='primary' htmlType='submit' disabled={!isEdit} className={styles.button}
                loading={signUpAction.status === 'loading'}>
          Sign up
        </Button>
        Or <NavLink to={Paths.SIGN_IN}>Sign In now!</NavLink>
      </Form.Item>
    </Form>
  )
}

export default SignUp