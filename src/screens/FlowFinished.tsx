import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Colors from '../constants/Colors'
import { LoadingPackingBackgroundSvg } from '../components/svg/LoadingPackingBackground'
// import { DefaultButton } from '../components/DefaultButton'
import { useRouter } from 'expo-router'
import { resetAllFlowAtoms } from '../store'
import { useAtom } from 'jotai'
import { CheckSignSvg } from '../components/svg/CheckSign'

const FlowFinishedScreen: React.FC = () => {
  const router = useRouter()
  const [, setResetFlow] = useAtom(resetAllFlowAtoms)

  const handleGoHome = async () => {
    try {
      await Promise.resolve(setResetFlow())

      // Esperamos un tick para asegurar que el estado se actualice
      await new Promise(resolve => setTimeout(resolve, 0))

      router.push('/home')
    } catch (error) {
      console.error('Error en handleGoHome:', error)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.checkContainer}>
        <CheckSignSvg width={80} height={80} color={Colors.green} />
        <Text style={styles.title}>PICKING FINALIZADO</Text>
        {/* <DefaultButton label="DESCARGAR DETALLE" onPress={() => console.log('DESCARGAR DETALLE')} /> */}
        <TouchableOpacity onPress={handleGoHome} style={styles.homeButton}>
          <Text style={styles.homeButtonText}>VOLVER AL INICIO</Text>
        </TouchableOpacity>
      </View>
      <LoadingPackingBackgroundSvg width={'100%'} height={'36.5%'} color={Colors.green} />

      {/* Componente para generar el PDF */}
      {/* <InvoiceGenerator ref={invoiceGeneratorRef} order={currentOrder} /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  checkContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 100,
    position: 'absolute'
  },
  title: {
    marginTop: 20,
    marginBottom: 42,
    marginHorizontal: 40,
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    color: Colors.green
  },
  homeButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  homeButtonText: {
    color: Colors.mainBlue,
    fontSize: 18,
    fontFamily: 'Inter_700Bold'
  }
})

export default FlowFinishedScreen
