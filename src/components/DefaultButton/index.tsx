/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState } from 'react'
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native'
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
  const [isLoading, setIsLoading] = useState(false)

  const handlePress = () => {
    setIsLoading(true)

    setTimeout(() => {
      onPress?.()
      setIsLoading(false)
    }, 1000)
  }

  return (
    <TouchableOpacity style={{ ...styles[type], ...(isLoading ? styles.loading : {}), backgroundColor: backgroundColor }} onPress={() => handlePress()}>
      {isLoading ? <ActivityIndicator size="small" color="white" /> : <Text style={{ ...styles.buttonLabel, color: color }}>{label}</Text>}
    </TouchableOpacity>
  )
}
