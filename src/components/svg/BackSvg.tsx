import React from 'react'
import Svg, { Path } from 'react-native-svg'
interface BackSvgProps {
  width: number
  height: number
  color: string
}
export const BackSvg = ({ width, height, color }: BackSvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 40 40" fill="none">
      <Path d="M11.5354 20.8335L21.1891 30.4872L20 31.6668L8.33331 20.0002L20 8.3335L21.1891 9.51308L11.5354 19.1668H31.6666V20.8335H11.5354Z" fill={color} />
    </Svg>
  )
}
