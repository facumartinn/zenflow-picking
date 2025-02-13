/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useMemo, useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { DefaultHeader } from '../components/DefaultHeader'
import Colors from '../constants/Colors'
import ProductCard from '../components/ProductCard'
import { OrderStateEnum, OrderDetails } from '../types/order'
import { OrderDetailLoader } from '../store/OrderLoader'
import { orderDetailsAtom, warehousesAtom } from '../store'
import { useAtom } from 'jotai'
import { router, useLocalSearchParams } from 'expo-router'
import OrderDetailSkeleton from '../components/OrderDetailSkeleton'
import { BackSvg } from '../components/svg/BackSvg'

type LocalSearchParams = {
  orderId: number
  orderNumber: string
  stateId: number
}

const OrderDetailScreen = () => {
  const { orderId, orderNumber, stateId }: Partial<LocalSearchParams> = useLocalSearchParams()
  const [orderDetails, setOrderDetails] = useAtom(orderDetailsAtom)
  const [warehouseConfig] = useAtom(warehousesAtom)
  const [isLoading, setIsLoading] = useState(true)

  // Limpiar el estado cuando cambia el orderId o cuando se desmonta el componente
  useEffect(() => {
    setIsLoading(true)
    setOrderDetails([])

    return () => {
      setOrderDetails([])
    }
  }, [orderId, setOrderDetails])

  // Efecto para controlar cuando los datos están cargados
  useEffect(() => {
    if (orderDetails.length > 0) {
      setIsLoading(false)
    }
  }, [orderDetails])

  // Memorizar el array de orderDetails
  const orderDetailsArray = useMemo(() => {
    return Array.isArray(orderDetails) ? orderDetails : []
  }, [orderDetails])

  // Memorizar la cantidad total
  const totalQuantity = useMemo(() => {
    return orderDetails.reduce((acc, product) => acc + product.quantity, 0)
  }, [orderDetails])

  // Memorizar el turno
  const shift = useMemo(() => {
    return warehouseConfig?.use_shifts?.shifts?.find(shift => shift.id === orderDetails[0]?.Orders?.assembly_schedule)
  }, [warehouseConfig?.use_shifts?.shifts, orderDetails])

  const handleBack = useCallback(() => {
    setOrderDetails([]) // Limpiar el estado antes de navegar
    router.back()
  }, [setOrderDetails])

  const renderItem = useCallback(({ item }: { item: OrderDetails }) => {
    return <ProductCard product={item} />
  }, [])

  const keyExtractor = useCallback((item: OrderDetails) => item?.product_id?.toString(), [])

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 80,
      offset: 80 * index,
      index
    }),
    []
  )

  return (
    <View style={{ flex: 1 }}>
      <DefaultHeader title="Detalle pedido" leftIcon={<BackSvg width={30} height={30} color="black" />} leftAction={handleBack} />
      <OrderDetailLoader orderId={orderId!} />

      {isLoading || orderDetails.length === 0 ? (
        <OrderDetailSkeleton />
      ) : (
        <>
          <View style={styles.container}>
            <View style={styles.titleBox}>
              <Text style={styles.title}>Número de pedido</Text>
              <Text style={styles.value}>{orderNumber}</Text>
            </View>
            <View style={styles.infoBox}>
              <View style={styles.titleBox}>
                <Text style={styles.title}>Cantidad</Text>
                <Text style={styles.value}>{totalQuantity}</Text>
              </View>
              <View style={styles.titleBox}>
                <Text style={styles.title}>Turno</Text>
                <Text style={styles.value}>{shift?.name}</Text>
              </View>
            </View>
          </View>
          <FlatList
            data={orderDetailsArray}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            windowSize={3}
            initialNumToRender={5}
            updateCellsBatchingPeriod={50}
          />
          {stateId == OrderStateEnum.READY_TO_PICK ? (
            <TouchableOpacity style={styles.startPickingButton}>
              <Text style={styles.startPickingText}>INICIAR PICKING</Text>
            </TouchableOpacity>
          ) : null}
        </>
      )}
    </View>
  )
}

export default OrderDetailScreen

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 10
  },
  title: {
    fontSize: 14,
    marginLeft: 15,
    marginBottom: 8,
    color: Colors.grey5,
    fontFamily: 'Inter_400Regular'
  },
  value: {
    fontSize: 20,
    marginLeft: 15,
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  },
  startPickingButton: {
    backgroundColor: Colors.mainBlue,
    padding: 20,
    height: 66,
    alignItems: 'center'
  },
  startPickingText: {
    color: 'white',
    fontFamily: 'Inter_700Bold',
    fontSize: 16
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 40
  }
})
