// screens/PickingOrderDetailScreen.tsx
import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native'
import { useRouter } from 'expo-router'
import Colors from '../constants/Colors'
import { DefaultHeader } from '../components/DefaultHeader'
import { flowAtom, flowOrderDetailsAtom, resetAllFlowAtoms } from '../store'
import { useAtom } from 'jotai'
import { OrderCard } from '../components/PickingOrders/components/OrderCard'
import { groupOrderDetailsByOrderId, calculateOrdersPickingState } from '../helpers/groupOrders'
import { DefaultModal } from '../components/DefaultModal'
import { WarningSvg } from '../components/svg/Warning'
import { cancelFlow } from '../services/flow'
import { BackSvg } from '../components/svg/BackSvg'
import BottomButton from '../components/BottomButton'
import { OrderStateEnum, PickingUpdate, OrderDetails, PickingDetailEnum } from '../types/order'
import { updateOrderDetails } from '../services/orderDetail'
import { updateOrders } from '../services/order'
import LoadingPackingScreen from '../components/LoadingPackingScreen'
import { WarningTriangleSvg } from '../components/svg/WarningTriangle'

export const PickingOrdersScreen = () => {
  const [flowOrderDetails, setFlowOrderDetails] = useAtom(flowOrderDetailsAtom)
  const [flow] = useAtom(flowAtom)
  const [, setResetFlow] = useAtom(resetAllFlowAtoms)
  const [cancelPickingModalVisible, setCancelPickingModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pendingProductsModalVisible, setPendingProductsModalVisible] = useState(false)

  const groupedOrders = groupOrderDetailsByOrderId(flowOrderDetails)

  const router = useRouter()

  const isPickingCompleted = flowOrderDetails.every(
    detail => detail.state_picking_details_id === PickingDetailEnum.COMPLETED || detail.state_picking_details_id === PickingDetailEnum.INCOMPLETE
  )

  const handleCardPress = (orderId: number) => {
    // Navegar a la pantalla de detalle de pedido
    router.push({ pathname: '/picking-order-detail', params: { orderId } })
  }

  const handleCancelPicking = async () => {
    await cancelFlow(flow.id)
    setCancelPickingModalVisible(false)
    setResetFlow()
    router.push('/home')
  }

  const handleFinishPicking = async () => {
    if (!isPickingCompleted) {
      setPendingProductsModalVisible(true)
      return
    }

    try {
      setLoading(true)
      const transformOrderDetailsForUpdate = (details: OrderDetails[]): PickingUpdate[] => {
        return details.map(detail => ({
          order_id: detail.order_id,
          product_id: detail.product_id,
          quantity: detail.quantity,
          quantity_picked: detail.quantity_picked!,
          final_weight: detail.final_weight,
          state_picking_details_id: detail.state_picking_details_id!
        }))
      }

      const groupedOrders = Object.fromEntries(groupOrderDetailsByOrderId(flowOrderDetails).map(group => [group.order_id, group.details]))
      const ordersPickingState = calculateOrdersPickingState(groupedOrders)

      await updateOrderDetails(transformOrderDetailsForUpdate(flowOrderDetails))
      await updateOrders({ orders: ordersPickingState })

      const updatedFlowOrderDetails = flowOrderDetails.map(detail => ({
        ...detail,
        Orders: {
          ...detail.Orders,
          state_id: OrderStateEnum.PACKING
        }
      }))
      setFlowOrderDetails(updatedFlowOrderDetails)

      // try {
      //   await updateFlowStatus(flow.id, FlowStateEnum.COMPLETED, OrderStateEnum.IN_PREPARATION)
      //   console.log('updateFlowStatus completado exitosamente')
      // } catch (error: unknown) {
      //   const err = error as { response?: { data: unknown }; message?: string }
      //   console.error('Error específico en updateFlowStatus:', err.response?.data || err.message)
      //   throw error
      // }

      router.push('/packing-orders')
    } catch (error) {
      console.error('Error al finalizar el picking:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingPackingScreen title="PICKING FINALIZADO" message="INICIANDO EMPAQUETADO" color={Colors.green} />
  }

  const isGroupedOrderCompleted = (orderId: number) => {
    const order = groupedOrders.find(order => order.order_id === orderId)
    return order?.details.every(detail => detail.state_picking_details_id === PickingDetailEnum.COMPLETED)
      ? 'COMPLETED'
      : order?.details.some(detail => detail.state_picking_details_id === PickingDetailEnum.INCOMPLETE)
        ? 'INCOMPLETE'
        : 'IN_PROGRESS'
  }
  return (
    <View style={styles.container}>
      <View style={styles.topBodyContainer}>
        <DefaultHeader title="Pedidos" leftIcon={<BackSvg width={30} height={30} color="black" />} leftAction={() => router.back()} />
      </View>
      <ScrollView style={styles.bodyContainer}>
        {groupedOrders.map((orderDetail, index) => {
          const state = isGroupedOrderCompleted(orderDetail.order_id)
          return (
            <OrderCard
              key={index}
              tenantOrderId={orderDetail.order_tenant_id}
              pickedQuantity={orderDetail.picked_quantity ?? 0}
              totalQuantity={orderDetail.total_quantity}
              state={state}
              onPress={() => handleCardPress(orderDetail.order_id)}
            />
          )
        })}
      </ScrollView>
      <DefaultModal
        visible={cancelPickingModalVisible}
        title="¿Cancelar picking?"
        iconBackgroundColor={Colors.lightRed}
        icon={<WarningSvg width={40} height={41} color={Colors.red} />}
        description="Se perderán todos los avances y tendrás que volver a empezar."
        primaryButtonText="ATRAS"
        primaryButtonColor={Colors.mainBlue}
        primaryButtonAction={() => {
          setCancelPickingModalVisible(false)
        }}
        secondaryButtonText="CANCELAR PICKING"
        secondaryButtonAction={handleCancelPicking}
        secondaryButtonTextColor={Colors.red}
      />
      <DefaultModal
        visible={pendingProductsModalVisible}
        title="Productos pendientes"
        iconBackgroundColor={Colors.lightRed}
        icon={<WarningTriangleSvg width={40} height={41} color={Colors.red} />}
        description="Hay productos que aún no han sido pickeados. Debes completar todos los productos antes de iniciar el empaquetado."
        primaryButtonText="ENTENDIDO"
        primaryButtonColor={Colors.mainBlue}
        primaryButtonAction={() => setPendingProductsModalVisible(false)}
        secondaryButtonText="INICIAR EMPAQUETADO"
        secondaryButtonAction={handleFinishPicking}
        secondaryButtonTextColor={Colors.red}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => setCancelPickingModalVisible(true)}>
          <Text style={styles.buttonText}>CANCELAR PICKING</Text>
        </TouchableOpacity>
      </View>
      {isPickingCompleted && <BottomButton text="INICIAR EMPAQUETADO" onPress={handleFinishPicking} />}
    </View>
  )
}

export default PickingOrdersScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 20,
    backgroundColor: Colors.background
  },
  topBodyContainer: {
    height: 80,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  bodyContainer: {
    marginTop: 20,
    paddingHorizontal: 16
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.black
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 120,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    gap: 10,
    borderRadius: 10
  },
  buttonText: {
    color: Colors.red,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    fontSize: 18
  }
})
