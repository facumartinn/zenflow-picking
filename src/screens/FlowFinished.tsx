// src/screens/FlowFinishedScreen.tsx
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Colors from '../constants/Colors'
import { LoadingPackingBackgroundSvg } from '../components/svg/LoadingPackingBackground'
import { CheckSvg } from '../components/svg/Check'
import { DefaultButton } from '../components/DefaultButton'
import { useRouter } from 'expo-router'
import { resetAllFlowAtoms } from '../store'
import { useAtom } from 'jotai'
// import { packingOrdersAtom } from '../store' // Solo dejamos packingOrdersAtom, ya que lo usamos
// import InvoiceGenerator from '../components/InvoiceGenerator'
// import { Order } from '../types/order' // Asegúrate que Order esté bien definido en este archivo
// import * as Sharing from 'expo-sharing'

const FlowFinishedScreen: React.FC = () => {
  const router = useRouter()
  const [, setResetFlow] = useAtom(resetAllFlowAtoms)

  //   const handleDownloadDetail = async () => {
  //     try {
  //       // Simulación de espera (opcional)
  //       await new Promise(resolve => setTimeout(resolve, 500))

  //       const viewRef = invoiceGeneratorRef.current
  //       console.log('viewRef', viewRef)
  //       if (!viewRef) {
  //         throw new Error('No se pudo acceder al generador de facturas')
  //       }

  //       const filePath = await viewRef.generateInvoice()
  //       if (!filePath) {
  //         throw new Error('No se pudo generar el PDF del recibo/factura')
  //       }

  //       setPdfPath(filePath)
  //       console.log('PDF del recibo/factura generado en:', filePath)

  //       const canShare = await Sharing.isAvailableAsync()
  //       if (canShare) {
  //         await Sharing.shareAsync(filePath, {
  //           mimeType: 'application/pdf',
  //           dialogTitle: 'Compartir Recibo/Factura',
  //           UTI: 'com.adobe.pdf' // Solo para iOS
  //         })
  //       } else {
  //         Alert.alert('Error', 'No se puede compartir en este dispositivo')
  //       }
  //     } catch (error) {
  //       console.error('Error al generar el recibo/factura:', error)
  //       Alert.alert('Error', 'Ocurrió un error al intentar generar el recibo/factura. Por favor, intenta nuevamente.')
  //     }
  //   }

  const handleGoHome = () => {
    setResetFlow()
    router.push('/home')
  }

  return (
    <View style={styles.container}>
      <View style={styles.checkContainer}>
        <CheckSvg width={80} height={80} color={Colors.green} />
        <Text style={styles.title}>PICKING COMPLETADO CON ÉXITO</Text>
        <DefaultButton label="DESCARGAR DETALLE" onPress={() => console.log('DESCARGAR DETALLE')} />
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
    marginVertical: 24,
    marginHorizontal: 40,
    fontSize: 20,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    color: Colors.green
  },
  homeButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  homeButtonText: {
    color: Colors.black,
    fontSize: 18,
    fontFamily: 'Inter_700Bold'
  }
})

export default FlowFinishedScreen
