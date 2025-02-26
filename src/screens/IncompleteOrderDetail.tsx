/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useMemo, useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { DefaultHeader } from '../components/DefaultHeader'
import Colors from '../constants/Colors'
import ProductCard from '../components/ProductCard'
import { OrderDetails, PickingDetailEnum, PickingStateEnum } from '../types/order'
import { OrderDetailLoader } from '../store/OrderLoader'
import { orderDetailsAtom, warehousesAtom } from '../store'
import { incompleteOrderAtom, incompleteOrderLoadingAtom } from '../store/incomplete-order'
import { useAtom } from 'jotai'
import { router, useLocalSearchParams } from 'expo-router'
import OrderDetailSkeleton from '../components/OrderDetailSkeleton'
import { BackSvg } from '../components/svg/BackSvg'
import BottomButton from '../components/BottomButton'
import { DefaultModal } from '../components/DefaultModal'
import { WarningTriangleSvg } from '../components/svg/WarningTriangle'
import { updateIncompleteProducts } from '../services/orderDetail'
import { useToast } from '../context/toast'

type LocalSearchParams = {
  orderId: number
  tenantOrderId: number
  stateId?: number
}

const IncompleteOrderDetail = () => {
  const { orderId, tenantOrderId }: Partial<LocalSearchParams> = useLocalSearchParams()
  const [orderDetails] = useAtom(orderDetailsAtom)
  const [warehouseConfig] = useAtom(warehousesAtom)
  const [incompleteOrder, setIncompleteOrder] = useAtom(incompleteOrderAtom)
  const [isLoading, setIncompleteOrderLoading] = useAtom(incompleteOrderLoadingAtom)
  const [initialIncompleteProducts, setInitialIncompleteProducts] = useState<OrderDetails[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const { showToast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (orderId && orderDetails?.length > 0) {
      setIncompleteOrderLoading(true)
      // Guardamos los productos que inicialmente están incompletos
      const incompleteProducts = orderDetails.filter(product => product.state_picking_details_id === PickingDetailEnum.INCOMPLETE)
      setInitialIncompleteProducts(incompleteProducts)

      const newState = {
        orderId: Number(orderId),
        orderNumber: tenantOrderId?.toString() || `${orderId}`,
        products: [...orderDetails],
        isLoading: false
      }

      setIncompleteOrder(newState)
      setIncompleteOrderLoading(false)
    }

    return () => {
      setIncompleteOrder({
        orderId: null,
        orderNumber: null,
        products: [],
        isLoading: false
      })
      setInitialIncompleteProducts([])
    }
  }, [orderId, tenantOrderId, orderDetails, setIncompleteOrder, setIncompleteOrderLoading])

  const totalQuantity = useMemo(() => {
    return incompleteOrder.products
      .filter(product => product.state_picking_details_id === PickingDetailEnum.INCOMPLETE)
      .reduce((acc, product) => acc + (product.quantity - (product.quantity_picked || 0)), 0)
  }, [incompleteOrder.products])

  const shift = useMemo(() => {
    const firstProduct = incompleteOrder.products[0]
    return warehouseConfig?.use_shifts?.shifts?.find(shift => shift.id === firstProduct?.Orders?.assembly_schedule)
  }, [warehouseConfig?.use_shifts?.shifts, incompleteOrder.products])

  const handleProductPress = useCallback(
    (product: OrderDetails) => {
      router.push({
        pathname: '/incomplete-picking-product-order-detail',
        params: {
          product: JSON.stringify(product),
          orderId: incompleteOrder.orderId
        }
      })
    },
    [incompleteOrder.orderId]
  )

  const renderItem = useCallback(
    ({ item }: { item: OrderDetails }) => {
      const isIncomplete = item.state_picking_details_id === PickingDetailEnum.INCOMPLETE
      return <ProductCard product={item} onPress={isIncomplete ? () => handleProductPress(item) : undefined} />
    },
    [handleProductPress]
  )

  const keyExtractor = useCallback((item: OrderDetails) => item?.product_id?.toString(), [])

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 80,
      offset: 80 * index,
      index
    }),
    []
  )

  const hasCompletedProducts = useMemo(() => {
    if (!initialIncompleteProducts.length) return false

    // Verificamos si algún producto que estaba inicialmente incompleto
    // ahora está completado
    return initialIncompleteProducts.some(initialProduct => {
      const currentProduct = incompleteOrder.products.find(p => p.product_id === initialProduct.product_id)
      return currentProduct?.state_picking_details_id === PickingDetailEnum.COMPLETED
    })
  }, [initialIncompleteProducts, incompleteOrder.products])

  const handleSaveChanges = useCallback(async () => {
    try {
      setIsSaving(true)
      // Solo guardamos los productos que estaban inicialmente incompletos
      // y ahora están completados
      const completedProducts = initialIncompleteProducts
        .map(initialProduct => {
          const currentProduct = incompleteOrder.products.find(p => p.product_id === initialProduct.product_id)
          return currentProduct
        })
        .filter((product): product is OrderDetails => product !== undefined && product.state_picking_details_id === PickingDetailEnum.COMPLETED)

      if (!incompleteOrder.orderId) {
        throw new Error('No se encontró el ID del pedido')
      }

      // Verificar si aún quedan productos incompletos
      const hasRemainingIncompleteProducts = incompleteOrder.products.some(product => product.state_picking_details_id === PickingDetailEnum.INCOMPLETE)

      // Si no hay productos incompletos, el pedido está completo
      const orderState = hasRemainingIncompleteProducts ? PickingStateEnum.INCOMPLETE : PickingStateEnum.COMPLETE

      await updateIncompleteProducts(completedProducts, incompleteOrder.orderId, orderState)
      showToast('Cambios guardados correctamente', incompleteOrder.orderId, Colors.green, Colors.white)
      router.back()
    } catch (error) {
      console.error('Error al guardar cambios:', error)
      showToast('Error al guardar los cambios', incompleteOrder.orderId || 0, Colors.red, Colors.white)
    } finally {
      setIsSaving(false)
    }
  }, [initialIncompleteProducts, incompleteOrder.products, incompleteOrder.orderId, showToast])

  const handleBack = useCallback(() => {
    if (hasCompletedProducts) {
      router.back()
      setModalVisible(false)
    } else {
      router.back()
    }
  }, [hasCompletedProducts, setModalVisible])

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <DefaultHeader title="Completar pedido" leftIcon={<BackSvg width={30} height={30} color="black" />} leftAction={handleBack} />
        <OrderDetailSkeleton />
      </View>
    )
  }

  return (
    <View style={styles.mainContainer}>
      <DefaultHeader title="Completar pedido" leftIcon={<BackSvg width={30} height={30} color="black" />} leftAction={handleBack} />
      <OrderDetailLoader orderId={orderId!} />
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>Número de pedido</Text>
          <Text style={styles.value}>{tenantOrderId}</Text>
        </View>
        <View style={styles.infoBox}>
          <View style={styles.titleBox}>
            <Text style={styles.title}>Cantidad pendiente</Text>
            <Text style={styles.value}>{totalQuantity}</Text>
          </View>
          <View style={styles.titleBox}>
            <Text style={styles.title}>Turno</Text>
            <Text style={styles.value}>{shift?.name}</Text>
          </View>
        </View>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={incompleteOrder.products}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          windowSize={3}
          initialNumToRender={5}
          updateCellsBatchingPeriod={50}
          contentContainerStyle={styles.listContent}
        />
      </View>
      {hasCompletedProducts && (
        <BottomButton
          text={isSaving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
          onPress={handleSaveChanges}
          backgroundColor={Colors.mainBlue}
          textColor={Colors.white}
          // disabled={isSaving}
        />
      )}
      <DefaultModal
        icon={<WarningTriangleSvg width={40} height={40} color={Colors.mainOrange} />}
        iconBackgroundColor="transparent"
        visible={modalVisible}
        title="¿Salir sin guardar?"
        description="No se van a guardar los cambios que hiciste sobre el pedido"
        primaryButtonText="SALIR"
        primaryButtonColor={Colors.mainBlue}
        primaryButtonTextColor={Colors.white}
        primaryButtonAction={handleBack}
        secondaryButtonText="VOLVER"
        secondaryButtonColor="transparent"
        secondaryButtonTextColor={Colors.mainBlue}
        secondaryButtonAction={() => {
          setModalVisible(false)
        }}
      />
    </View>
  )
}

export default IncompleteOrderDetail

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
    // backgroundColor: Colors.white
  },
  container: {
    paddingTop: 30,
    paddingHorizontal: 16
  },
  listContainer: {
    flex: 1
    // marginBottom: 80 // Espacio para el botón
  },
  listContent: {
    // paddingBottom: 20
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
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 40
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.grey5,
    textAlign: 'center'
  }
})
