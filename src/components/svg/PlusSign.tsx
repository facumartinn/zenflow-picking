import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface PlusSvgProps {
  width: number
  height: number
  color: string
}

export const PlusSvg = ({ width, height, color }: PlusSvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 21 22" fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.75 12.8334H19.25C20.216 12.8334 21 12.012 21 11C21 9.98802 20.216 9.16669 19.25 9.16669H1.75C0.784 9.16669 0 9.98802 0 11C0 12.012 0.784 12.8334 1.75 12.8334Z"
        fill={color}
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.25 20.1667V1.83333C12.25 0.821333 11.466 0 10.5 0C9.534 0 8.75 0.821333 8.75 1.83333V20.1667C8.75 21.1787 9.534 22 10.5 22C11.466 22 12.25 21.1787 12.25 20.1667Z"
        fill={color}
      />
    </Svg>
  )
}
