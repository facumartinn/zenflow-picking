/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { styles } from './styles'
import Colors from '../../constants/Colors'

interface DefaultButtonProps {
  backgroundColor?: string
  color?: string
  type?: 'primary' | 'secondary'
  label: string
  onPress?: () => void
}

export const DefaultButton = ({ backgroundColor = Colors.mainBlue, color = Colors.white, type = 'primary', label, onPress }: DefaultButtonProps) => {
  return (
    <TouchableOpacity style={{ ...styles[type], backgroundColor: backgroundColor }} onPress={onPress}>
      <Text style={{ ...styles.buttonLabel, color: color }}>{label}</Text>
    </TouchableOpacity>
  )
}
