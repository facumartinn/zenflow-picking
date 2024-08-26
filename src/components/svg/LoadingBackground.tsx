import React from 'react'
import Svg, { Path, G, Rect, Defs, ClipPath } from 'react-native-svg'

interface LoadingBackgroundSvgProps {
  width: number | string
  height: number | string
  color: string
}

export const LoadingBackgroundSvg = ({ width, height, color }: LoadingBackgroundSvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 360 276" fill="none">
      <G opacity="0.15" clipPath="url(#clip0_137_2806)">
        <Path
          opacity="0.35"
          d="M588.36 276C585.716 271.643 583.073 267.379 580.46 263.083C517.913 162.458 442.646 110.574 368.001 116.425C297.243 122.059 229.13 180.853 170.409 275.938H588.36V276Z"
          fill={color}
        />
        <Path
          opacity="0.35"
          d="M744.586 193.178C691.339 74.6877 628.762 -51.6149 557.227 -21.4243C506.748 -0.135231 473.531 117.266 429.117 174.441C371.422 248.642 326.2 153.868 274.57 90.1254C204.901 4.22218 118.841 27.5966 56.7304 149.262C37.5092 186.953 19.1278 234.418 0 274.786H744.586V193.178Z"
          fill={color}
        />
        <Path
          opacity="0.35"
          d="M1067.71 139.738C1060.99 137.528 1054.33 137.185 1048.33 138.43C1025.63 142.943 1004.1 165.882 983.171 189.661C962.239 213.44 941.214 238.495 918.727 247.957C843.709 279.455 781.66 138.088 712.364 92.522C649.569 51.2511 583.042 86.9196 522.081 144.002C460.032 202.049 395.962 283.563 331.456 248.86C286.047 224.427 248.04 145.34 206.083 93.3623C131.718 1.10975 52.7494 3.16395 -24.2285 47.7963V294.363H1067.71V139.738Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_137_2806">
          <Rect width="360" height="276" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
