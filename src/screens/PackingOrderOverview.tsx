/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'
import { AppState, AppStateStatus, Alert } from 'react-native'
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
import { usePdfViewer } from '../hooks/usePdfGenerator'

const PackingOrderOverviewScreen = () => {
  const router = useRouter()
  const barcodePdfRef = useRef<any>() // Puedes definir un tipo más específico si lo deseas
  const [pdfPath, setPdfPath] = useState<string | null>(null)
  const [, setIsPrinting] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState(false)

  const { orderId } = useLocalSearchParams<{ orderId: string }>()
  const [packingOrderDetail, setPackingOrderDetail] = useAtom(packingOrdersAtom)

  const currentOrder: PackingOrder = packingOrderDetail[parseInt(orderId as string)]

  // Calcular el total de etiquetas (número de objetos en `resources`)
  const totalItems = currentOrder?.resources?.length || 0

  // Generar códigos de barras desde la nueva estructura de datos
  const generateBarcodes = () => {
    return (
      currentOrder?.resources?.map(item => ({
        value: item.barcode.toString(), // Convertir el barcode en string
        label: item.resource_name
      })) || []
    )
  }

  const barcodes = generateBarcodes()

  const { showPdf, deletePdf } = usePdfViewer()

  const handlePrintLabels = async () => {
    try {
      setIsPrinting(true)
      console.log('Generando etiquetas...')

      const viewRef = barcodePdfRef.current
      if (!viewRef) {
        throw new Error('La referencia del PDF no está disponible')
      }

      const filePath = await viewRef.generatePdf()
      if (!filePath) {
        throw new Error('No se pudo generar la ruta del archivo PDF')
      }

      setPdfPath(filePath)
      const shared = await showPdf(filePath)

      if (shared) {
        const updatedPackingOrders = {
          ...packingOrderDetail,
          [orderId as string]: {
            ...currentOrder,
            print_status: PrintStatusEnum.PRINTED
          }
        }
        setShouldRedirect(true)
        setPackingOrderDetail(updatedPackingOrders)
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
      if (nextAppState === 'active' && shouldRedirect) {
        if (pdfPath) {
          deletePdf(pdfPath)
            .then(() => console.log('PDF eliminado'))
            .catch(error => console.error('Error al eliminar el PDF:', error))
            .finally(() => {
              router.push({ pathname: '/packing-order-completed', params: { orderId } })
            })
        } else {
          router.push({ pathname: '/packing-order-completed', params: { orderId } })
        }
      }
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange)
    return () => {
      subscription.remove()
    }
  }, [router, pdfPath, shouldRedirect, orderId, deletePdf])

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
            {currentOrder?.resources?.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.resource_name}</Text>
                <Text style={styles.itemQuantity}>1</Text> {/* Cada recurso es una etiqueta */}
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
  },
  barcodeContainer: {
    position: 'absolute',
    left: -9999, // Fuera de la pantalla pero renderizado
    width: 300, // Ancho fijo
    height: 500, // Alto fijo
    backgroundColor: 'white'
  }
})

export default PackingOrderOverviewScreen
