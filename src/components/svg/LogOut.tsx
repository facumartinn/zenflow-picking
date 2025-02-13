import React from 'react'
import Svg, { Path } from 'react-native-svg'
interface LogOutSvgProps {
  width: number
  height: number
  color: string
}
export const LogOutSvg = ({ width, height, color }: LogOutSvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18.3846 4C18.8449 4 19.2292 4.15417 19.5375 4.4625C19.8458 4.77083 20 5.15512 20 5.61537L20 18.3846C20 18.8449 19.8458 19.2292 19.5375 19.5375C19.2292 19.8458 18.8449 20 18.3846 20L11.9808 20L11.9808 19L18.3846 19C18.5385 19 18.6795 18.9359 18.8077 18.8077C18.9359 18.6795 19 18.5385 19 18.3846L19 5.61537C19 5.46154 18.9359 5.32052 18.8077 5.1923C18.6795 5.0641 18.5385 5 18.3846 5L11.9808 5L11.9808 4L18.3846 4ZM7.53847 8.46153L8.2404 9.18077L5.92115 11.5L14.8077 11.5L14.8077 12.5L5.92115 12.5L8.2404 14.8192L7.53848 15.5385L4 12L7.53847 8.46153Z"
        fill={color}
      />
    </Svg>
  )
}
