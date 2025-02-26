import React from 'react'
import Svg, { Path, Rect } from 'react-native-svg'
interface MinusSvgProps {
  width: number
  height: number
  backgroundColor: string
  color: string
}
export const MinusSvg = ({ width, height, backgroundColor, color }: MinusSvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 40 40" fill="none">
      <Rect width={width} height={height} rx="8" fill={backgroundColor} />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.25 21.8334H28.75C29.716 21.8334 30.5 21.012 30.5 20C30.5 18.988 29.716 18.1667 28.75 18.1667H11.25C10.284 18.1667 9.5 18.988 9.5 20C9.5 21.012 10.284 21.8334 11.25 21.8334Z"
        fill={color}
      />
    </Svg>
  )
}
