import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Result, Button } from 'antd'

const NotFound: FC = () => {
  const navigate = useNavigate()

  const goBack = () => {
    navigate(-1)
  }

  return (
    <Result
      status="404"
      title="Page not found"
      subTitle="Sorry, the page you visited does not exist"
      extra={<Button type="primary" onClick={goBack}>Back</Button>}
    />
  )
}

export default NotFound