import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Colors from '../../../constants/Colors'
import { MinusSvg } from '../../svg/MinusSign'
import { PlusSvg } from '../../svg/PlusSign'

interface QuantitySelectorProps {
  quantity: number
  maxQuantity: number
  onIncrease: () => void
  onDecrease: () => void
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, maxQuantity, onIncrease, onDecrease }) => {
  const isDecreaseDisabled = quantity <= 0
  const isIncreaseDisabled = quantity >= maxQuantity

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onDecrease} disabled={isDecreaseDisabled} style={[styles.button, isDecreaseDisabled && styles.disabledButton]}>
        <MinusSvg width={24} height={24} color={isDecreaseDisabled ? Colors.grey3 : Colors.mainBlue} />
      </TouchableOpacity>
      <Text style={styles.quantity}>{quantity}</Text>
      <TouchableOpacity onPress={onIncrease} disabled={isIncreaseDisabled} style={[styles.button, isIncreaseDisabled && styles.disabledButton]}>
        <PlusSvg width={24} height={24} color={isIncreaseDisabled ? Colors.grey3 : Colors.mainBlue} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  button: {
    fontSize: 24,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.mainLightBlue2
  },
  disabledButton: {
    backgroundColor: Colors.grey2 // Fondo deshabilitado
  },
  quantity: {
    fontSize: 34,
    marginHorizontal: 20,
    color: Colors.black,
    fontFamily: 'Inter_700Bold'
  }
})
