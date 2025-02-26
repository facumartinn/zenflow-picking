import React, { useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import Colors from '../constants/Colors'
import { DefaultHeader } from '../components/DefaultHeader'
import { LinearGradient } from 'expo-linear-gradient'
import { usePackingOrderDetail } from '../hooks/usePackingOrderDetail'
import { BackSvg } from '../components/svg/BackSvg'
import { AddSvg } from '../components/svg/Add'
import { MinusSvg } from '../components/svg/Minus'
import BottomButton from '../components/BottomButton'
import { BoundingBoxSvg } from '../components/svg/BoundingBox'
import { BoxDetailSvg } from '../components/svg/BoxDetail'
import BarcodePdf from '../components/BarcodeGenerator'
import { usePdfViewer } from '../hooks/usePdfGenerator'
import { useAtom } from 'jotai'
import { basketsByOrderAtom, packingOrdersAtom } from '../store'
import { PrintStatusEnum } from '../types/flow'

interface BarcodePdfRef {
  generatePdf: () => Promise<string>
}

const PackingOrderDetailScreen = () => {
  const router = useRouter()
  const { orderId } = useLocalSearchParams<{ orderId: string }>()
  const [baskets] = useAtom(basketsByOrderAtom)
  const { resourceList, availableResources, incrementResource, decrementResource, handleConfirm } = usePackingOrderDetail({
    orderId: parseInt(orderId as string, 10)
  })
  const barcodePdfRef = useRef<BarcodePdfRef>(null)
  const [, setIsPrinting] = useState(false)
  const [packingOrderDetail, setPackingOrderDetail] = useAtom(packingOrdersAtom)
  const { showPdf } = usePdfViewer()

  const basketByComma = baskets[parseInt(orderId as string, 10)]?.join(',')

  const generateBarcodes = () => {
    return resourceList.map(item => ({
      value: item.barcode.toString(),
      label: item.resource_name
    }))
  }
  const barcodes = generateBarcodes()

  const onConfirm = async () => {
    try {
      setIsPrinting(true)

      const viewRef = barcodePdfRef.current
      if (!viewRef) {
        throw new Error('La referencia del PDF no está disponible')
      }

      const filePath = await viewRef.generatePdf()
      if (!filePath) {
        throw new Error('No se pudo generar la ruta del archivo PDF')
      }

      const shared = await showPdf(filePath)

      if (shared) {
        handleConfirm()
        const currentOrder = packingOrderDetail[parseInt(orderId as string)]
        const updatedPackingOrders = {
          ...packingOrderDetail,
          [orderId as string]: {
            ...currentOrder,
            print_status: PrintStatusEnum.PRINTED
          }
        }
        setPackingOrderDetail(updatedPackingOrders)
        router.push({ pathname: '/packing-order-completed', params: { orderId } })
      }
    } catch (error) {
      console.error('Error al imprimir:', error)
      Alert.alert('Error', 'Ocurrió un error al intentar imprimir. Por favor, intenta nuevamente.')
    } finally {
      setIsPrinting(false)
    }
  }

  const getCountForResource = (resourceId: number) => resourceList.filter(item => item.resource_id === resourceId).length

  return (
    <LinearGradient
      colors={[Colors.mainLightBlue3, Colors.white]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      locations={[0.2, 0.2]}
    >
      <DefaultHeader
        title="Empaquetado"
        leftIcon={<BackSvg height={30} width={30} color={Colors.black} />}
        leftAction={() => router.push('/packing-orders')}
        backgroundColor="transparent"
      />
      <BarcodePdf ref={barcodePdfRef} barcodes={barcodes} />
      <ScrollView style={styles.content}>
        <View style={styles.orderInfoContainer}>
          <View style={styles.orderInfo}>
            <View style={styles.orderInfoHeader}>
              <BoxDetailSvg width={20} height={20} color={Colors.black2} />
              <Text style={styles.orderLabel}>Nro pedido</Text>
            </View>
            <Text style={styles.orderId}>{orderId}</Text>
          </View>
          <View style={styles.orderInfo}>
            <View style={styles.boundingBoxContainer}>
              <BoundingBoxSvg width={20} height={20} color={Colors.black} />
              <Text style={styles.orderLabel}>Cajón</Text>
            </View>
            <Text style={styles.orderId}>{basketByComma}</Text>
          </View>
        </View>

        {availableResources.map(resource => {
          const count = getCountForResource(resource.resource_id)
          return (
            <View key={resource.resource_id} style={styles.itemRow}>
              <Text style={styles.itemName}>{resource.resource_name}</Text>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={[styles.quantityButton, count === 0 && styles.quantityButtonDisabled]}
                  onPress={() => decrementResource(resource.resource_id)}
                  disabled={count === 0}
                >
                  <MinusSvg
                    width={40}
                    height={40}
                    backgroundColor={count > 0 ? Colors.mainLightBlue3 : Colors.grey2}
                    color={count > 0 ? Colors.mainBlue : Colors.grey3}
                  />
                </TouchableOpacity>
                <Text style={styles.quantity}>{count}</Text>
                <TouchableOpacity style={styles.quantityButton} onPress={() => incrementResource(resource.resource_id)}>
                  <AddSvg
                    width={40}
                    height={40}
                    backgroundColor={count >= 0 ? Colors.mainLightBlue3 : Colors.grey2}
                    color={count >= 0 ? Colors.mainBlue : Colors.grey3}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )
        })}
        <View style={styles.scannerSection}>
          <Text style={styles.scannerText}>Escaneá cajones para sumarlos como empaques</Text>
        </View>
      </ScrollView>
      <BottomButton text="IMPRIMIR ETIQUETAS" onPress={onConfirm} />
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    flex: 1,
    padding: 16
  },
  orderInfoContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30
  },
  orderInfo: {
    width: '45%',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginVertical: 30,
    backgroundColor: Colors.white,
    borderWidth: 1.4,
    borderColor: Colors.mainLightBlue4
  },
  orderInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  boundingBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  orderLabel: {
    color: Colors.black2,
    fontSize: 15,
    marginRight: 8
  },
  orderId: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  scannerSection: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24
  },
  scannerText: {
    paddingTop: 20,
    marginLeft: 14,
    fontSize: 20,
    color: Colors.black2,
    textAlign: 'center'
  },
  drawerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 24
  },
  drawerLabel: {
    fontSize: 20
  },
  drawerInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  drawerNumber: {
    fontSize: 26,
    fontWeight: 'bold',
    marginRight: 16
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30
  },
  itemName: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold'
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.mainLightBlue3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  quantityButtonDisabled: {
    backgroundColor: Colors.grey2
  },
  quantity: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    marginHorizontal: 16
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
    fontWeight: 'bold'
  }
})

export default PackingOrderDetailScreen
