import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
interface BoxSvgProps {
  width?: number
  height?: number
  color?: string
}
export const BoxSvg = ({ width = 24, height = 24, color = '#000' }: BoxSvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 7.2V16.8C3 17.9201 3 18.4802 3.21799 18.908C3.40973 19.2843 3.71569 19.5903 4.09202 19.782C4.51984 20 5.07989 20 6.2 20H17.8C18.9201 20 19.4802 20 19.908 19.782C20.2843 19.5903 20.5903 19.2843 20.782 18.908C21 18.4802 21 17.9201 21 16.8V7.2C21 6.0799 21 5.51984 20.782 5.09202C20.5903 4.71569 20.2843 4.40973 19.908 4.21799C19.4802 4 18.9201 4 17.8 4H6.2C5.0799 4 4.51984 4 4.09202 4.21799C3.71569 4.40973 3.40973 4.71569 3.21799 5.09202C3 5.51984 3 6.07989 3 7.2Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M7.5 4V20" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16.5 4V20" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3 12H21" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}
