import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface MinusSvgProps {
  width: number
  height: number
  color: string
}

export const MinusSvg = ({ width, height, color }: MinusSvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 21 22" fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.75 12.8334H19.25C20.216 12.8334 21 12.012 21 11C21 9.98802 20.216 9.16669 19.25 9.16669H1.75C0.784 9.16669 0 9.98802 0 11C0 12.012 0.784 12.8334 1.75 12.8334Z"
        fill={color}
      />
    </Svg>
  )
}
