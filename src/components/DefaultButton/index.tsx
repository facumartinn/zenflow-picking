/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native'
import { styles } from './styles'
import Colors from '../../constants/Colors'

interface DefaultButtonProps {
  backgroundColor?: string
  color?: string
  type?: 'primary' | 'secondary'
  label: string
  onPress?: () => void | Promise<void>
  /**
   * Si es true, el botón mostrará un loading state y estará deshabilitado
   */
  isLoading?: boolean
  /**
   * Si es true, el botón manejará automáticamente su estado de loading
   * basado en si la función onPress es asíncrona
   * @default false
   */
  withAsyncLoading?: boolean
  /**
   * Si es true, el botón estará deshabilitado
   * @default false
   */
  disabled?: boolean
}

export const DefaultButton = ({
  backgroundColor = Colors.mainBlue,
  color = Colors.white,
  type = 'primary',
  label,
  onPress,
  isLoading,
  withAsyncLoading = false,
  disabled = false
}: DefaultButtonProps) => {
  const [internalLoading, setInternalLoading] = React.useState(false)

  const handlePress = async () => {
    if (!onPress || disabled) return

    if (withAsyncLoading) {
      try {
        setInternalLoading(true)
        await onPress()
      } catch (error) {
        // Si hay un error, asegurarnos de quitar el loading
        console.error('Error en onPress:', error)
      } finally {
        setInternalLoading(false)
      }
    } else {
      onPress()
    }
  }

  const loading = isLoading || internalLoading
  const isDisabled = disabled || loading

  return (
    <TouchableOpacity style={[styles[type], (loading || disabled) && styles.loading, { backgroundColor }]} onPress={handlePress} disabled={isDisabled}>
      <View style={styles.buttonContent}>
        {loading ? <ActivityIndicator size="small" color={color} /> : <Text style={[styles.buttonLabel, { color }]}>{label}</Text>}
      </View>
    </TouchableOpacity>
  )
}
