import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface BasketSvgProps {
  width: number
  height: number
  color: string
}

export const BasketSvg = ({ width, height, color }: BasketSvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 25 24" fill="none">
      <Path
        d="M6.5444 20C6.18415 20 5.85786 19.8945 5.56555 19.6836C5.27325 19.4727 5.07965 19.1891 4.98477 18.8327L2.78095 11.025C2.71043 10.7724 2.75498 10.5384 2.9146 10.323C3.07421 10.1077 3.28863 9.99996 3.55785 9.99996H8.25017L11.8425 4.58456C11.9258 4.46405 12.0232 4.37495 12.1348 4.31726C12.2463 4.25956 12.3726 4.23071 12.5136 4.23071C12.6547 4.23071 12.7809 4.26276 12.8925 4.32686C13.004 4.39098 13.1015 4.48329 13.1848 4.60379L16.7386 9.99996H21.4425C21.7117 9.99996 21.9293 10.1077 22.0954 10.323C22.2614 10.5384 22.3028 10.7724 22.2194 11.025L19.9771 18.8327C19.8822 19.1891 19.6886 19.4727 19.3963 19.6836C19.104 19.8945 18.7777 20 18.4175 20H6.5444ZM6.4617 19H18.5386C18.6797 19 18.8015 18.9583 18.904 18.875C19.0066 18.7916 19.0771 18.6795 19.1155 18.5384L21.2002 11H3.80017L5.8848 18.5384C5.92325 18.6795 5.99375 18.7916 6.09632 18.875C6.19889 18.9583 6.32068 19 6.4617 19ZM12.5002 16C12.7681 16 13.0018 15.9003 13.2011 15.7009C13.4005 15.5016 13.5002 15.2679 13.5002 15C13.5002 14.732 13.4005 14.4984 13.2011 14.299C13.0018 14.0996 12.7681 14 12.5002 14C12.2322 14 11.9986 14.0996 11.7992 14.299C11.5998 14.4984 11.5002 14.732 11.5002 15C11.5002 15.2679 11.5998 15.5016 11.7992 15.7009C11.9986 15.9003 12.2322 16 12.5002 16ZM9.46365 9.99996H15.5309L12.4944 5.37689L9.46365 9.99996Z"
        fill={color}
      />
    </Svg>
  )
}