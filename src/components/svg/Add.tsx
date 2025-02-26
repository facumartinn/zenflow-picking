import React from 'react'
import Svg, { Path, Rect } from 'react-native-svg'
interface AddSvgProps {
  width: number
  height: number
  backgroundColor: string
  color: string
}
export const AddSvg = ({ width, height, backgroundColor, color }: AddSvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 40 40" fill="none">
      <Rect width={width} height={height} rx="8" fill={backgroundColor} />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.25 21.8334H28.75C29.716 21.8334 30.5 21.012 30.5 20C30.5 18.988 29.716 18.1667 28.75 18.1667H11.25C10.284 18.1667 9.5 18.988 9.5 20C9.5 21.012 10.284 21.8334 11.25 21.8334Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.75 29.1667V10.8333C21.75 9.82133 20.966 9 20 9C19.034 9 18.25 9.82133 18.25 10.8333V29.1667C18.25 30.1787 19.034 31 20 31C20.966 31 21.75 30.1787 21.75 29.1667Z"
        fill={color}
      />
    </Svg>
  )
}
