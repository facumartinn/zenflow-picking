/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import React, { useEffect, useState } from 'react'
import { View, Text, Alert, StyleSheet } from 'react-native'
import { DefaultHeader } from '../components/DefaultHeader'
import { OrderDetailLoader } from '../store/OrderLoader'
import Colors from '../constants/Colors'
import { useAtom } from 'jotai'
import { orderDetailsAtom, warehousesAtom } from '../store'
import PositionsList from '../components/PositionCard'
import * as FileSystem from 'expo-file-system'
import { router, useLocalSearchParams } from 'expo-router'
import { usePdfGenerator, usePdfViewer } from '../hooks/usePdfGenerator'
import { OrderDetailTemplate } from '../templates/OrderDetailTemplate'
import { getResources } from '../services/order'
import { OrderResourceItem } from '../types/order'
import { DefaultButton } from '../components/DefaultButton'
import { format } from 'date-fns'
import { BackSvg } from '../components/svg/BackSvg'

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
  const [warehouseConfig] = useAtom(warehousesAtom)
  const shift = warehouseConfig?.use_shifts?.shifts?.find(shift => shift.id === orderDetails[0]?.Orders?.assembly_schedule)
  const totalQuantity = orderDetails.reduce((acc, product) => acc + product.quantity, 0)

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
      <DefaultHeader title="Detalle pedido" leftIcon={<BackSvg width={30} height={30} color="black" />} leftAction={handleBack} />
      <View style={styles.bodyContainer}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>Número de pedido</Text>
          <Text style={styles.value}>0000{orderId}</Text>
        </View>
        <View style={styles.infoBox}>
          <View style={styles.titleBox}>
            <Text style={styles.title}>Día</Text>
            <Text style={styles.value}>
              {orderDetails[0]?.Orders?.assembly_date ? format(new Date(orderDetails[0]?.Orders?.assembly_date), 'dd/MM/yyyy') : ''}
            </Text>
          </View>
          <View style={styles.titleBox}>
            <Text style={styles.title}>Turno</Text>
            <Text style={styles.value}>{shift?.name}</Text>
          </View>
        </View>
        <View style={styles.infoBox}>
          <View style={styles.titleBox}>
            <Text style={styles.title}>Picker</Text>
            <Text style={styles.value}>{orderDetails[0]?.Orders?.user_id}</Text>
          </View>
          <View style={styles.titleBox}>
            <Text style={styles.title}>Cantidad</Text>
            <Text style={styles.value}>{totalQuantity}</Text>
          </View>
        </View>
        <PositionsList positions={transformedPositions} isLoading={isLoading} />
      </View>
      <View style={styles.buttonContainer}>
        <DefaultButton label="VER DETALLE" backgroundColor={Colors.mainBlue} color={Colors.white} onPress={handleOrderDetailNavigation} />
        <DefaultButton label="DESCARGAR DETALLE" backgroundColor="transparent" color={Colors.black} onPress={generatePDF} />
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
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginVertical: 5,
    marginHorizontal: 10
  },
  title: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'Inter_400Regular'
  },
  value: {
    fontSize: 18,
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
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 40
  }
})
