import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native'
import Colors from '../../constants/Colors'

interface BottomButtonProps {
  text: string
  onPress: () => void
  style?: ViewStyle
  disabled?: boolean
  backgroundColor?: string
  textColor?: string
}

const BottomButton: React.FC<BottomButtonProps> = ({ text, onPress, style, disabled = false, backgroundColor, textColor }) => {
  return (
    <TouchableOpacity
      style={[styles.button, backgroundColor && { backgroundColor }, style, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, textColor && { color: textColor }]}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: Colors.mainBlue,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: 'Inter_700Bold'
  },
  disabledButton: {
    backgroundColor: Colors.grey1
  }
})

export default BottomButton
