/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'
import { AppState, AppStateStatus, Alert } from 'react-native'
import * as FileSystem from 'expo-file-system'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import Colors from '../constants/Colors'
import { useAtom } from 'jotai'
import { packingOrdersAtom } from '../store'
import { DefaultHeader } from '../components/DefaultHeader'
import BarcodePdf from '../components/BarcodeGenerator'
import { PackingOrder, PrintStatusEnum } from '../types/flow'

const PackingOrderOverviewScreen = () => {
  const router = useRouter()
  const barcodePdfRef = useRef<any>() // Puedes definir un tipo más específico si lo deseas
  const [pdfPath, setPdfPath] = useState(null)
  const [, setIsPrinting] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState(false)

  const { orderId } = useLocalSearchParams<{ orderId: string }>()
  const [packingOrderDetail, setPackingOrderDetail] = useAtom(packingOrdersAtom)

  const currentOrder: PackingOrder = packingOrderDetail[parseInt(orderId as string)]

  const totalItems = currentOrder.resources.reduce((sum, item) => sum + item.barcodes.length, 0)

  const generateBarcodes = () => {
    const barcodes: any[] = []

    currentOrder.resources.forEach(item => {
      item.barcodes.forEach(barcode => {
        barcodes.push({
          value: barcode,
          label: item.resource_name
        })
      })
    })

    console.log('Barcodes generados:', barcodes) // Log para depuración
    return barcodes
  }
  const barcodes = generateBarcodes()

  const handlePrintLabels = async () => {
    try {
      setIsPrinting(true)
      console.log('Generando etiquetas...')
      const filePath = await barcodePdfRef.current?.generatePdf()
      console.log('PDF generado en:', filePath)
      setPdfPath(filePath)

      if (filePath) {
        // Actualizar el estado de impresión
        const updatedPackingOrders = {
          ...packingOrderDetail,
          [orderId as string]: {
            ...currentOrder,
            print_status: PrintStatusEnum.PRINTED
          }
        }
        setShouldRedirect(true)
        setPackingOrderDetail(updatedPackingOrders)
      } else {
        console.log('No se pudo generar el PDF')
        Alert.alert('Error', 'No se pudo generar el PDF. Por favor, intenta nuevamente.')
      }
    } catch (error) {
      console.error('Error al imprimir:', error)
      Alert.alert('Error', 'Ocurrió un error al intentar imprimir. Por favor, intenta nuevamente.')
    } finally {
      setIsPrinting(false)
    }
  }

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log('nextAppState', nextAppState)
      if (nextAppState === 'active' && shouldRedirect) {
        console.log('Intentando redirigir...')
        // La aplicación vuelve a estar activa y no está en proceso de impresión
        if (pdfPath) {
          FileSystem.deleteAsync(pdfPath, { idempotent: true })
            .then(() => console.log('PDF eliminado'))
            .catch(error => console.error('Error al eliminar el PDF:', error))
            .finally(() => {
              console.log('Redirigiendo a packing-order-completed')
              router.push({ pathname: '/packing-order-completed', params: { orderId } })
            })
        } else {
          console.log('Redirigiendo a packing-order-completed (sin PDF)')
          router.push({ pathname: '/packing-order-completed', params: { orderId } })
        }
        setShouldRedirect(false)
      }
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange)

    return () => {
      subscription.remove()
    }
  }, [router, pdfPath, shouldRedirect, orderId])
  return (
    <LinearGradient
      colors={[Colors.lightOrange, Colors.background]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      locations={[0.35, 0.35]}
    >
      <DefaultHeader
        title="Empaquetado"
        leftIcon={
          <View style={{ borderRadius: 50, backgroundColor: Colors.lightOrange, marginLeft: 10 }}>
            <AntDesign name="arrowleft" size={25} color="black" style={{ padding: 8 }} />
          </View>
        }
        leftAction={() => router.navigate('/packing-orders')}
      />
      <BarcodePdf ref={barcodePdfRef} barcodes={barcodes} />

      <ScrollView style={styles.content}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderLabel}>Pedido</Text>
          <Text style={styles.orderId}>000{orderId}</Text>
        </View>
        <View style={styles.summaryWrapper}>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Etiquetas</Text>
            {currentOrder.resources.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.resource_name}</Text>
                <Text style={styles.itemQuantity}>{item.barcodes.length}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalQuantity}>{totalItems}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.continueButtonContainer}>
        <TouchableOpacity style={styles.continueButton} onPress={handlePrintLabels}>
          <Text style={styles.continueButtonText}>IMPRIMIR ETIQUETAS</Text>
        </TouchableOpacity>
      </View>
      {/* </SafeAreaView> */}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    // paddingTop: 20,
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    flex: 1,
    padding: 16
  },
  backButton: {
    marginRight: 16
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold'
  },
  orderInfo: {
    width: '40%',
    padding: 10,
    borderRadius: 20,
    backgroundColor: Colors.lightOrange,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24
  },
  orderLabel: {
    fontSize: 16,
    marginRight: 8,
    fontFamily: 'Inter_400Regular'
  },
  orderId: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold'
  },
  summaryWrapper: {
    alignItems: 'center',
    width: '100%'
  },
  summaryContainer: {
    width: '70%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    marginVertical: 24,
    borderWidth: 1,
    borderColor: Colors.orange
  },
  summaryTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 16
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  itemName: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular'
  },
  itemQuantity: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.orange
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold'
  },
  totalQuantity: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold'
  },
  printButton: {
    backgroundColor: Colors.mainBlue,
    padding: 16,
    alignItems: 'center',
    borderRadius: 8
  },
  printButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Inter_700Bold'
  },
  continueButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  continueButton: {
    backgroundColor: Colors.mainBlue,
    paddingHorizontal: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 36,
    borderRadius: 30
  },
  continueButtonText: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: 'Inter_700Bold'
  }
})

export default PackingOrderOverviewScreen
