import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { DefaultHeader } from '../components/DefaultHeader'
import Colors from '../constants/Colors'
import { useRouter } from 'expo-router'
import { useAtom } from 'jotai'
import { flowOrderDetailsAtom, basketsByOrderAtom, flowAtom, resetAllFlowAtoms } from '../store'
import { groupOrderDetailsByOrderId } from '../helpers/groupOrders'
import OrderCard from '../components/BasketSelection/OrderCard'
import BottomButton from '../components/BottomButton' // Asegúrate de tener este componente
import { DefaultModal } from '../components/DefaultModal'
import LoadingPickingScreen from '../components/LoadingPickingScreen'
import { WarningSvg } from '../components/svg/Warning'
import { assignBasketsToOrders, updateFlowStatus } from '../services/flow'
import { OrderStateEnum } from '../types/order'
import { FlowStateEnum } from '../types/flow'
import { updateOrderStatus } from '../services/order'
import { BasketSvg } from '../components/svg/Basket'
import { BackSvg } from '../components/svg/BackSvg'
// import { updateOrderStatus } from '../services/order'
// import { OrderStateEnum } from '../types/order'

const BasketSelectionScreen = () => {
  const [flow] = useAtom(flowAtom)
  const [, setResetFlow] = useAtom(resetAllFlowAtoms)
  const [orderDetails] = useAtom(flowOrderDetailsAtom)
  const [basketsByOrder] = useAtom(basketsByOrderAtom)
  const groupedOrders = groupOrderDetailsByOrderId(orderDetails)
  const [modalVisible, setModalVisible] = useState(false)
  const [startPickingModalVisible, setStartPickingModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCardPress = (orderId: number, tenantOrderId: number) => {
    router.push({ pathname: '/basket-assignment', params: { orderId, tenantOrderId } })
  }

  const allOrdersReady = groupedOrders.every(order => basketsByOrder[order.order_id]?.length > 0)
  const orderIds = Object.keys(basketsByOrder).map(Number)

  const handleStartPicking = async () => {
    setLoading(true)
    try {
      await assignBasketsToOrders(basketsByOrder)
      await updateOrderStatus(OrderStateEnum.IN_PREPARATION, orderIds)
      router.push('/picking')
    } catch (error) {
      console.error('Error al asignar cajones a las órdenes', error)
      setLoading(false)
    }
  }

  const handleBack = async () => {
    // Aca pegarle a la api para cancelar el flow de picking
    await updateFlowStatus(flow.id, FlowStateEnum.CANCELLED, OrderStateEnum.READY_TO_PICK)
    router.push('/multi-picking')
    setResetFlow()
  }

  if (loading) {
    return <LoadingPickingScreen message="Iniciando picking" color={Colors.mainLightBlue} />
  }

  return (
    <View style={styles.container}>
      <DefaultHeader title="Picking múltiple" leftIcon={<BackSvg width={24} height={24} color={Colors.black} />} leftAction={() => setModalVisible(true)} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.bodyContainer}>
          <Text style={styles.screenTitle}>Asignación de cajones</Text>
          <Text style={styles.screenSubtitle}>Asigna 1 ó más cajones para cada pedido.</Text>
          {groupedOrders.map(order => {
            const isOrderReady = basketsByOrder[order.order_id]?.length > 0
            return (
              <TouchableOpacity key={order.order_id} onPress={() => handleCardPress(order.order_id, order.order_tenant_id)}>
                <OrderCard order={order} isOrderReady={isOrderReady} />
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
      {allOrdersReady && <BottomButton text="INICIAR PICKING" onPress={() => setStartPickingModalVisible(true)} />}
      <DefaultModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        icon={<WarningSvg width={40} height={41} color={Colors.red} />}
        iconBackgroundColor={Colors.lightRed}
        title="¿Volver al inicio?"
        description="Se perderán todos los avances y tendrás que volver a empezar."
        primaryButtonText="VOLVER AL INICIO"
        primaryButtonColor={Colors.mainBlue}
        primaryButtonAction={handleBack}
        secondaryButtonText="ATRÁS"
        secondaryButtonAction={() => setModalVisible(false)}
      />
      <DefaultModal
        visible={startPickingModalVisible}
        icon={<BasketSvg width={40} height={41} color={Colors.mainBlue} />}
        title="¿Iniciar picking?"
        description={`Pedido: ${flow.id}`}
        primaryButtonText="EMPEZAR"
        primaryButtonColor={Colors.mainBlue}
        primaryButtonAction={handleStartPicking}
        secondaryButtonText="ATRÁS"
        secondaryButtonAction={() => setStartPickingModalVisible(false)}
      />
    </View>
  )
}

export default BasketSelectionScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey1
  },
  scrollContainer: {
    paddingBottom: 80
  },
  bodyContainer: {
    paddingTop: 30,
    paddingHorizontal: 16,
    flex: 1
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.black
  },
  screenTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: Colors.black,
    marginBottom: 8
  },
  screenSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.black,
    marginBottom: 16
  }
})
