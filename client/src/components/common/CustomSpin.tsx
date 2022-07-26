import React, { FC } from 'react'
import { Spin, SpinProps } from 'antd'

interface CustomSpinProps extends SpinProps {}

const CustomSpin: FC<CustomSpinProps> = props => {
  const { size = 'large', style } = props

  return (
    <Spin
      size={size}
      style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', ...style }}
    />
  )
}

export default CustomSpin
