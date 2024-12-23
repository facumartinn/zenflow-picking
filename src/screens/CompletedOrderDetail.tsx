/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native'
import { DefaultHeader } from '../components/DefaultHeader'
import { AntDesign } from '@expo/vector-icons'
import { OrderDetailLoader } from '../store/OrderLoader'
import Colors from '../constants/Colors'
import { useAtom } from 'jotai'
import { orderDetailsAtom } from '../store'
import PositionsList from '../components/PositionCard'
import * as FileSystem from 'expo-file-system'
import { router, useLocalSearchParams } from 'expo-router'
import { BoxDetailSvg } from '../components/svg/BoxDetail'
import { CartSvg } from '../components/svg/Cart'
import { WatchSvg } from '../components/svg/Watch'
import { usePdfGenerator, usePdfViewer } from '../hooks/usePdfGenerator'
import { OrderDetailTemplate } from '../templates/OrderDetailTemplate'
import { getResources } from '../services/order'
import { OrderResourceItem } from '../types/order'

type LocalSearchParams = {
  orderId: number
  stateId: number
  quantity: number
}

const CompletedOrderDetail = () => {
  const { orderId, stateId, quantity }: Partial<LocalSearchParams> = useLocalSearchParams()
  const [orderDetails, setOrderDetails] = useAtom(orderDetailsAtom)
  const { generatePdf } = usePdfGenerator()
  const { showPdf } = usePdfViewer()
  const [resources, setResources] = useState<OrderResourceItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchResources = async () => {
      try {
        if (orderId) {
          const response = await getResources(Number(orderId))
          setResources(response.resources)
        }
      } catch (error) {
        console.error('Error al obtener recursos:', error)
        Alert.alert('Error', 'No se pudieron cargar los recursos del pedido')
      } finally {
        setIsLoading(false)
      }
    }

    fetchResources()
  }, [orderId])

  const transformedPositions = resources.reduce(
    (acc, resource) => {
      const existingPosition = acc.find(pos => pos.position === resource.position)

      if (existingPosition) {
        const existingType = existingPosition.details.find(detail => detail.type === resource.resource_name)

        if (existingType) {
          existingType.quantity += resource.quantity
        } else {
          existingPosition.details.push({
            type: resource.resource_name,
            quantity: resource.quantity
          })
        }

        if (!existingPosition.barcodes) {
          existingPosition.barcodes = []
        }
        existingPosition.barcodes.push({
          barcode: resource.barcode,
          resource_name: resource.resource_name
        })
      } else {
        acc.push({
          id: acc.length + 1,
          position: resource.position,
          details: [
            {
              type: resource.resource_name,
              quantity: resource.quantity
            }
          ],
          barcodes: [
            {
              barcode: resource.barcode,
              resource_name: resource.resource_name
            }
          ]
        })
      }

      return acc
    },
    [] as Array<{
      id: number
      position: string
      details: Array<{ type: string; quantity: number }>
      barcodes: Array<{ barcode: string; resource_name: string }>
    }>
  )

  const handleBack = () => {
    setOrderDetails([])
    router.navigate('/home')
  }

  const handleOrderDetailNavigation = () => {
    router.navigate({ pathname: '/order-detail', params: { orderId, quantity, stateId } })
  }

  const generatePDF = async () => {
    try {
      const pdfData = {
        orderId: orderId || 0,
        quantity: quantity || 0,
        startTime: orderDetails[0]?.Orders?.created_at || null,
        endTime: orderDetails[0]?.Orders?.updated_at || null,
        orderDetails: orderDetails[0],
        positions: orderDetails[0]?.Orders?.OrderPositions || []
      }

      const filePath = await generatePdf(pdfData, OrderDetailTemplate, {
        fileName: `order_detail_${orderId}.pdf`,
        directory: `${FileSystem.documentDirectory}orders`
      })

      await showPdf(filePath)
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'Hubo un error al generar el PDF.')
    }
  }

  return (
    <View style={styles.container}>
      <OrderDetailLoader orderId={orderId!} />
      <DefaultHeader
        title={<Text style={styles.headerTitle}>Detalle pedido</Text>}
        leftIcon={
          <View style={{ borderRadius: 100, backgroundColor: 'white', marginLeft: 10 }}>
            <AntDesign name="arrowleft" size={24} color="black" style={{ padding: 8 }} />
          </View>
        }
        leftAction={handleBack}
      />
      <View style={styles.bodyContainer}>
        <View style={styles.titleBox}>
          <BoxDetailSvg width={25} height={25} color={Colors.grey5} />
          <Text style={styles.title}>Nro Pedido </Text>
          <Text style={styles.value}>{orderId}</Text>
        </View>
        <View style={styles.titleBox}>
          <CartSvg width={25} height={25} color={Colors.grey5} />
          <Text style={styles.title}>Cantidad </Text>
          <Text style={styles.value}>{quantity}</Text>
        </View>
        <View style={styles.titleBox}>
          <WatchSvg width={25} height={25} color={Colors.grey5} />
          <Text style={styles.title}>Inicio </Text>
          <Text style={styles.value}>{'12:02'}</Text>
          <Text style={styles.title}>Fin </Text>
          <Text style={styles.value}>{'12:12'}</Text>
        </View>
        <PositionsList positions={transformedPositions} isLoading={isLoading} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.enterDetailScreen} onPress={handleOrderDetailNavigation}>
          <Text style={styles.startPickingText}>VER DETALLE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadDetailScreen} onPress={generatePDF}>
          <Text style={styles.downloadDetailText}>DESCARGAR DETALLE</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CompletedOrderDetail

const styles = StyleSheet.create({
  container: {
    // paddingTop: 20
  },
  bodyContainer: {
    paddingTop: 30,
    paddingHorizontal: 16
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.black
  },
  titleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 10
  },
  title: {
    fontSize: 16,
    marginLeft: 15,
    color: Colors.grey5,
    fontFamily: 'Inter_400Regular'
  },
  value: {
    fontSize: 18,
    marginLeft: 15,
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  },
  enterDetailScreen: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    backgroundColor: Colors.mainBlue,
    marginVertical: 10,
    marginHorizontal: 30,
    height: 66,
    borderRadius: 50
  },
  startPickingText: {
    color: Colors.white,
    fontFamily: 'Inter_700Bold',
    fontSize: 16
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  downloadDetailScreen: {
    marginTop: 10
  },
  downloadDetailText: {
    color: Colors.black,
    fontFamily: 'Inter_700Bold',
    fontSize: 16
  }
})
