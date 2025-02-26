/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import React, { useEffect, useState, useMemo } from 'react'
import { View, Text, Alert, StyleSheet } from 'react-native'
import { DefaultHeader } from '../components/DefaultHeader'
import { OrderDetailLoader } from '../store/OrderLoader'
import Colors from '../constants/Colors'
import { useAtom } from 'jotai'
import { orderDetailsAtom, warehousesAtom, orderResourcesAtom } from '../store'
import PositionsList from '../components/PositionCard'
import * as FileSystem from 'expo-file-system'
import { router, useLocalSearchParams } from 'expo-router'
import { usePdfGenerator, usePdfViewer } from '../hooks/usePdfGenerator'
import { OrderDetailTemplate } from '../templates/OrderDetailTemplate'
import { getResources } from '../services/order'
import { PickingDetailEnum } from '../types/order'
import { DefaultButton } from '../components/DefaultButton'
import { format } from 'date-fns'
import { BackSvg } from '../components/svg/BackSvg'

type LocalSearchParams = {
  orderId: number
  stateId: number
  quantity: number
  tenantOrderId: number
}

const CompletedOrderDetail = () => {
  const { orderId, stateId, quantity, tenantOrderId }: Partial<LocalSearchParams> = useLocalSearchParams()
  const [orderDetails] = useAtom(orderDetailsAtom)
  const [orderResources, setOrderResources] = useAtom(orderResourcesAtom)
  const { generatePdf } = usePdfGenerator()
  const { showPdf } = usePdfViewer()
  const [isLoading, setIsLoading] = useState(true)
  const [warehouseConfig] = useAtom(warehousesAtom)

  const resources = useMemo(() => {
    return orderResources[orderId?.toString() || ''] || []
  }, [orderResources, orderId])

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!orderId) return

        // Si ya tenemos los recursos para este pedido, no los volvemos a cargar
        if (orderResources[orderId.toString()]?.length > 0) {
          return
        }

        const resourcesResponse = await getResources(Number(orderId))
        setOrderResources(prev => ({
          ...prev,
          [orderId.toString()]: resourcesResponse.resources
        }))
      } catch (error) {
        console.error('Error al obtener datos:', error)
        Alert.alert('Error', 'No se pudieron cargar los datos del pedido')
      }
    }

    loadData()
  }, [orderId, orderResources, setOrderResources])

  useEffect(() => {
    if (orderDetails.length > 0 && resources.length > 0) {
      setIsLoading(false)
    }
  }, [orderDetails, resources])

  const shift = warehouseConfig?.use_shifts?.shifts?.find(shift => shift.id === orderDetails[0]?.Orders?.assembly_schedule)
  const totalQuantity = orderDetails.reduce((acc, product) => acc + product.quantity, 0)

  const transformedPositions = useMemo(() => {
    return resources.reduce(
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
  }, [resources])

  const handleBack = () => {
    router.push('/home')
  }

  const hasIncompleteProducts = orderDetails.some(detail => detail.state_picking_details_id === PickingDetailEnum.INCOMPLETE)

  const handleOrderDetailNavigation = () => {
    if (isLoading) return

    const route = hasIncompleteProducts ? '/incomplete-order-detail' : '/order-detail'
    router.push({
      pathname: route,
      params: {
        orderId,
        tenantOrderId: orderDetails[0]?.Orders?.order_tenant_id || 0,
        quantity,
        stateId
      }
    })
  }

  const generatePDF = async () => {
    if (isLoading) return

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

  const ScreenSkeleton = () => (
    <View style={styles.bodyContainer}>
      <View style={styles.titleBox}>
        <View style={[styles.placeholder, { width: 150, height: 20 }]} />
        <View style={[styles.placeholder, { width: 100, height: 24, marginTop: 5 }]} />
      </View>
      <View style={styles.infoBox}>
        <View style={styles.titleBox}>
          <View style={[styles.placeholder, { width: 80, height: 20 }]} />
          <View style={[styles.placeholder, { width: 120, height: 24, marginTop: 5 }]} />
        </View>
        <View style={styles.titleBox}>
          <View style={[styles.placeholder, { width: 80, height: 20 }]} />
          <View style={[styles.placeholder, { width: 100, height: 24, marginTop: 5 }]} />
        </View>
      </View>
      <View style={styles.infoBox}>
        <View style={styles.titleBox}>
          <View style={[styles.placeholder, { width: 80, height: 20 }]} />
          <View style={[styles.placeholder, { width: 120, height: 24, marginTop: 5 }]} />
        </View>
        <View style={styles.titleBox}>
          <View style={[styles.placeholder, { width: 80, height: 20 }]} />
          <View style={[styles.placeholder, { width: 100, height: 24, marginTop: 5 }]} />
        </View>
      </View>
      <View style={[styles.positionsContainer, { marginTop: 16 }]}>
        <View style={[styles.placeholder, { width: 100, height: 24, marginBottom: 16 }]} />
        <PositionsList positions={[]} isLoading={true} />
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <OrderDetailLoader orderId={orderId!} />
      <DefaultHeader title="Detalle pedido" leftIcon={<BackSvg width={30} height={30} color="black" />} leftAction={handleBack} />
      {isLoading ? (
        <ScreenSkeleton />
      ) : (
        <View style={styles.bodyContainer}>
          <View style={styles.titleBox}>
            <Text style={styles.title}>Número de pedido</Text>
            <Text style={styles.value}>{tenantOrderId}</Text>
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
          <View style={styles.positionsContainer}>
            <PositionsList positions={transformedPositions} isLoading={false} />
          </View>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <DefaultButton label="VER DETALLE" backgroundColor={Colors.mainBlue} color={Colors.white} onPress={handleOrderDetailNavigation} disabled={isLoading} />
        <DefaultButton label="DESCARGAR DETALLE" backgroundColor="transparent" color={Colors.black} onPress={generatePDF} disabled={isLoading} />
      </View>
    </View>
  )
}

export default CompletedOrderDetail

const styles = StyleSheet.create({
  container: {
    flex: 1
    // backgroundColor: Colors.white
  },
  bodyContainer: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 16
  },
  positionsContainer: {
    flex: 1
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
  buttonContainer: {
    padding: 20,
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 40
  },
  placeholder: {
    backgroundColor: Colors.grey3,
    borderRadius: 4
  }
})
