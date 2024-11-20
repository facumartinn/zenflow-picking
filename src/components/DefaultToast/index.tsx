import React, { useRef, useEffect } from 'react'
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native'
import { CheckSvg } from '../svg/Check'

const { width, height } = Dimensions.get('window')

interface DefaultToastProps {
  visible: boolean
  message: string
  orderId: number
  backgroundColor: string
  textColor: string
  onHide: () => void
}

const DefaultToast: React.FC<DefaultToastProps> = ({ visible, message, orderId, backgroundColor, textColor, onHide }) => {
  const translateY = useRef(new Animated.Value(height)).current // Comienza desde fuera de la pantalla (abajo)

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start(() => {
        setTimeout(() => {
          Animated.timing(translateY, {
            toValue: height, // Se anima hacia abajo para ocultarlo
            duration: 300,
            useNativeDriver: true
          }).start(onHide)
        }, 2000) // Tiempo que el toast permanece visible
      })
    }
  }, [visible])

  if (!visible) return null

  return (
    <Animated.View style={[styles.toast, { backgroundColor: backgroundColor }, { transform: [{ translateY }] }]}>
      <View style={styles.iconContainer}>
        <CheckSvg width={24} height={24} color={textColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.toastText, { color: textColor }]}>{message}</Text>
        <Text style={[styles.orderText, { color: textColor }]}>Pedido: 000{orderId}</Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 50, // Ajusta según la altura que desees desde la parte inferior
    left: (width - 300) / 2, // Centra el toast horizontalmente
    width: 300,
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  },
  iconContainer: {
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  toastText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  orderText: {
    fontSize: 14
  }
})

export default DefaultToast
