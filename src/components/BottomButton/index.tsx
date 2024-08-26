import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native'
import Colors from '../../constants/Colors'

interface BottomButtonProps {
  text: string
  onPress: () => void
  style?: ViewStyle
  disabled?: boolean
}

const BottomButton: React.FC<BottomButtonProps> = ({ text, onPress, style, disabled = false }) => {
  return (
    <TouchableOpacity style={[styles.button, style, disabled && styles.disabledButton]} onPress={onPress} disabled={disabled}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: Colors.mainBlue,
    paddingVertical: 20,
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
