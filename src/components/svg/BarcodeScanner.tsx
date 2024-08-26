import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface BarcodeScannerSvgProps {
  width: number
  height: number
  color: string
}

export const BarcodeScannerSvg = ({ width, height, color }: BarcodeScannerSvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6.0018 19.4615C5.33397 19.4615 4.80357 19.2022 4.41062 18.6836C4.01767 18.165 3.90132 17.591 4.06157 16.9615L5.95772 9.83461C5.42056 9.65127 4.95998 9.30127 4.576 8.78461C4.19203 8.26794 4.00005 7.67307 4.00005 6.99998C4.00005 6.17498 4.2938 5.46873 4.8813 4.88123C5.4688 4.29373 6.17505 3.99998 7.00005 3.99998H14C14.6042 3.99998 15.0607 4.25575 15.3696 4.76728C15.6784 5.27882 15.6981 5.80382 15.4289 6.34228L14.0443 9.11153C13.8967 9.38076 13.6988 9.59615 13.4506 9.75768C13.2024 9.91921 12.924 9.99998 12.6154 9.99998H10.052L9.68082 11.4038H9.75005C9.96928 11.4166 10.1555 11.4986 10.3087 11.6498C10.4619 11.8009 10.5385 11.9881 10.5385 12.2115V13.5961C10.5385 13.825 10.4611 14.0168 10.3063 14.1716C10.1515 14.3264 9.95967 14.4038 9.73082 14.4038H8.88082L7.93852 18.0115C7.81609 18.4399 7.57678 18.7887 7.2206 19.0578C6.86442 19.327 6.45815 19.4615 6.0018 19.4615ZM6.00005 18.4615C6.23338 18.4615 6.43338 18.3949 6.60005 18.2615C6.76672 18.1282 6.88338 17.9532 6.95005 17.7365L9.01542 9.99998H6.94042L5.02505 17.2115C4.94172 17.5282 5.00005 17.8157 5.20005 18.074C5.40005 18.3324 5.66672 18.4615 6.00005 18.4615ZM7.00005 8.99998H12.6154C12.7308 8.99998 12.8398 8.96793 12.9424 8.90383C13.0449 8.83973 13.1218 8.7564 13.1731 8.65383L14.5577 5.88458C14.6603 5.67946 14.6507 5.48075 14.5289 5.28843C14.4071 5.09613 14.2308 4.99998 14 4.99998H7.00005C6.45005 4.99998 5.97922 5.19582 5.58755 5.58748C5.19588 5.97915 5.00005 6.44998 5.00005 6.99998C5.00005 7.54998 5.19588 8.02081 5.58755 8.41248C5.97922 8.80415 6.45005 8.99998 7.00005 8.99998ZM17.9808 4.65383L17.5866 3.78461L20.7116 2.36536L21.1 3.24036L17.9808 4.65383ZM20.7116 11.6346L17.5866 10.2404L17.9808 9.36536L21.1 10.7846L20.7116 11.6346ZM18.1155 7.48076V6.51921H21.577V7.48076H18.1155Z"
        fill={color}
      />
    </Svg>
  )
}