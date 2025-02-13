import React from 'react'
import Svg, { Path } from 'react-native-svg'
interface CrossSvgProps {
  width: number
  height: number
  color: string
}
export const CrossSvg = ({ width, height, color }: CrossSvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 25" fill="none">
      <Path
        d="M17.2809 6.38969C16.9397 6.04844 16.3884 6.04844 16.0472 6.38969L11.7684 10.6597L7.48969 6.38094C7.14844 6.03969 6.59719 6.03969 6.25594 6.38094C5.91469 6.72219 5.91469 7.27344 6.25594 7.61469L10.5347 11.8934L6.25594 16.1722C5.91469 16.5134 5.91469 17.0647 6.25594 17.4059C6.59719 17.7472 7.14844 17.7472 7.48969 17.4059L11.7684 13.1272L16.0472 17.4059C16.3884 17.7472 16.9397 17.7472 17.2809 17.4059C17.6222 17.0647 17.6222 16.5134 17.2809 16.1722L13.0022 11.8934L17.2809 7.61469C17.6134 7.28219 17.6134 6.72219 17.2809 6.38969Z"
        fill={color}
      />
    </Svg>
  )
}
