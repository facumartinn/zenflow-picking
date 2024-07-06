import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { styles } from './styles'

interface HeaderProps {
  title?: React.ReactNode
  leftIcon?: React.ReactNode
  leftAction?: () => void
  rightIcon?: React.ReactNode
  rightAction?: () => void
}

export const DefaultHeader = ({ title, rightIcon, leftIcon, rightAction, leftAction }: HeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <TouchableOpacity onPress={leftAction}>{leftIcon}</TouchableOpacity>
      </View>
      <View style={styles.middleColumn}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.rightColumn}>
        <TouchableOpacity onPress={rightAction}>{rightIcon}</TouchableOpacity>
      </View>
    </View>
  )
}
