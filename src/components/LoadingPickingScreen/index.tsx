import React, { useEffect } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import Colors from '../../constants/Colors'
import { LoadingPickingBackgroundSvg } from '../svg/LoadingPickingBackground'
// import LoadingBackground from '../../app/basket-selection/loadingbg'

interface LoadingScreenProps {
  message: string
  color?: string
  duration?: number // Duración de la pantalla de carga en milisegundos
  nextRoute?: string // Ruta a la que se navega después de la carga
}

const LoadingPickingScreen: React.FC<LoadingScreenProps> = ({ message, color = Colors.mainLightBlue, duration = 3000, nextRoute }) => {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (nextRoute) {
        router.push(nextRoute)
      }
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, nextRoute, router])

  return (
    <View style={styles.container}>
      <View style={[styles.loadingContainer, { borderColor: Colors.mainLightBlue2 }]}>
        {/* El color de fondo usa una versión más clara del color principal (33 es 20% de opacidad en hex) */}
        <ActivityIndicator size={120} color={color} />
      </View>
      <Text style={styles.message}>{message}</Text>
      <LoadingPickingBackgroundSvg width={'100%'} height={'36.5%'} color={Colors.mainBlue} />
      {/* <LoadingBackground /> Añade el SVG como fondo */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  loadingContainer: {
    width: 100, // Tamaño del fondo circular
    height: 100,
    borderRadius: 60, // Radio para que sea un círculo perfecto
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 10 // Borde del círculo de fondo
  },
  message: {
    marginTop: 20,
    marginBottom: 40,
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.mainBlue
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.15
  }
})

export default LoadingPickingScreen
