import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'
import { BoxSvg } from '../svg/Box'

interface EmptyStateProps {
  title?: string
  icon?: React.ReactNode
}

const EmptyState: React.FC<EmptyStateProps> = ({ title = 'No hay pedidos para enviar', icon = <BoxSvg width={50} height={50} color={Colors.grey3} /> }) => {
  return (
    <View style={styles.container}>
      {icon}
      <Text style={styles.text}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.grey3,
    textAlign: 'center'
  }
})

export default EmptyState
