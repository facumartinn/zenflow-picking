import React, { useState } from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { styles } from './styles'
import Colors from '../../constants/Colors'

interface HeaderProps {
  title?: React.ReactNode
  leftIcon?: React.ReactNode
  leftAction?: () => void
  rightIcon?: React.ReactNode
  rightAction?: () => void
  backgroundColor?: string
}

export const DefaultHeader = ({ title, rightIcon, leftIcon, rightAction, leftAction, backgroundColor = Colors.white }: HeaderProps) => {
  const [lastClickTime, setLastClickTime] = useState(0)

  // Verificar si el ícono izquierdo está deshabilitado (color gris)
  const isLeftIconDisabled = React.isValidElement(leftIcon) && leftIcon.props && leftIcon.props.color === Colors.grey3

  const handleLeftAction = () => {
    // Si el ícono está deshabilitado, no hacer nada
    if (isLeftIconDisabled) {
      return
    }

    // Prevenir doble clic o clics accidentales muy rápidos
    const currentTime = new Date().getTime()
    if (currentTime - lastClickTime < 500) {
      return // Ignorar clics muy rápidos (menos de 500ms entre ellos)
    }

    setLastClickTime(currentTime)

    if (leftAction) {
      leftAction()
    }
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.leftColumn}>
        <TouchableOpacity onPress={handleLeftAction} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} disabled={isLeftIconDisabled}>
          {leftIcon}
        </TouchableOpacity>
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
