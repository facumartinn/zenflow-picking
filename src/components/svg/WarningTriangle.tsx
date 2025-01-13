import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface WarningTriangleSvgProps {
  width: number
  height: number
  color: string
}

export const WarningTriangleSvg = ({ width, height, color }: WarningTriangleSvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 62 54" fill="none">
      <Path
        d="M0.102539 53.6666L31 0.333252L61.8975 53.6666H0.102539ZM5.83337 50.3332H56.1667L31 6.99992L5.83337 50.3332ZM31 45.7183C31.5812 45.7183 32.0684 45.5216 32.4617 45.1283C32.855 44.7349 33.0517 44.2477 33.0517 43.6666C33.0517 43.0855 32.855 42.5982 32.4617 42.2049C32.0684 41.8116 31.5812 41.6149 31 41.6149C30.4189 41.6149 29.9317 41.8116 29.5384 42.2049C29.145 42.5982 28.9484 43.0855 28.9484 43.6666C28.9484 44.2477 29.145 44.7349 29.5384 45.1283C29.9317 45.5216 30.4189 45.7183 31 45.7183ZM29.3334 38.2816H32.6667V21.6149H29.3334V38.2816Z"
        fill={color}
      />
    </Svg>
  )
}
