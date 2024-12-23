import React, { useEffect } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { RelativePathString, useRouter } from 'expo-router'
import Colors from '../../constants/Colors'
import { LoadingPackingBackgroundSvg } from '../svg/LoadingPackingBackground'
import { CheckSvg } from '../svg/Check'

interface LoadingScreenProps {
  message: string
  title: string
  subtitle?: string
  color?: string
  duration?: number // Duración de la pantalla de carga en milisegundos
  nextRoute?: string // Ruta a la que se navega después de la carga
}

const LoadingPackingScreen: React.FC<LoadingScreenProps> = ({ title, subtitle, message, color = Colors.lightGreen, duration = 3000, nextRoute }) => {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (nextRoute) {
        router.push(nextRoute as RelativePathString)
      }
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, nextRoute, router])

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <CheckSvg width={50} height={50} color={Colors.green} />
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        <Text style={styles.message}>{message}</Text>
        <View style={[styles.loadingContainer, { borderColor: Colors.lightGreen }]}>
          {/* El color de fondo usa una versión más clara del color principal (33 es 20% de opacidad en hex) */}
          <ActivityIndicator size={120} color={color} />
        </View>
      </View>
      <LoadingPackingBackgroundSvg width={'100%'} height={'36.5%'} color={Colors.green} />
      {/* <LoadingBackground /> Añade el SVG como fondo */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  contentContainer: {
    flex: 1,
    paddingTop: 100,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  loadingContainer: {
    width: 100, // Tamaño del fondo circular
    height: 100,
    borderRadius: 60, // Radio para que sea un círculo perfecto
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 10, // Borde del círculo de fondo,
    marginBottom: 70
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: Colors.green
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: Colors.green
  },
  message: {
    marginTop: 10,
    marginBottom: 40,
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: Colors.green
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

export default LoadingPackingScreen
