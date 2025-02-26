import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import Colors from '../constants/Colors'
import { flowOrderDetailsAtom, packingOrdersAtom } from '../store'
import { useAtom } from 'jotai'
import { PackingDeliveryCard } from '../components/PackingDeliveryCard'
import { groupOrderDetailsByOrderId } from '../helpers/groupOrders'
import { transformPackingOrdersToPayload } from '../helpers/packingOrdersTransform'
import { registerOrderResources, updateOrderStatus } from '../services/order'
import { OrderStateEnum } from '../types/order'
import { DefaultHeader } from '../components/DefaultHeader'
import BottomButton from '../components/BottomButton'

const PackingOrdersScreen = () => {
  const [flowOrderDetails] = useAtom(flowOrderDetailsAtom)
  const [packingOrders] = useAtom(packingOrdersAtom)
  const router = useRouter()
  const groupedOrders = groupOrderDetailsByOrderId(flowOrderDetails)

  const handleCardPress = (orderId: number) => {
    router.push({ pathname: '/packing-delivery-detail', params: { orderId } })
  }

  const orderIds = Object.keys(packingOrders!).map(Number)

  const handleContinue = async () => {
    try {
      const payload = transformPackingOrdersToPayload(packingOrders)
      await registerOrderResources(payload)
      await updateOrderStatus(OrderStateEnum.FINISHED, orderIds)
      router.push('/flow-finished')
    } catch (error) {
      console.error('Error registering resources:', error)
    }
  }
  const allOrdersDelivered = groupedOrders?.every(order => packingOrders[order.order_id]?.packing_delivery_status === 1)

  return (
    <View style={styles.container}>
      <DefaultHeader title="Entrega" />
      <Text style={styles.title}>Elegí un pedido para entregar</Text>
      <Text style={styles.subtitle}>Indicá donde vas a guardar los pedidos.</Text>
      <ScrollView style={styles.bodyContainer}>
        {groupedOrders?.map((order, index) => (
          <PackingDeliveryCard
            key={index}
            orderId={order.order_id}
            tenantOrderId={order.order_tenant_id || order.order_id}
            onPress={() => handleCardPress(order.order_id)}
          />
        ))}
      </ScrollView>
      {allOrdersDelivered && <BottomButton text="FINALIZAR PICKING" onPress={handleContinue} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  title: {
    paddingTop: 20,
    fontSize: 20,
    marginHorizontal: 16,
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.grey5,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16
  },
  bodyContainer: {
    paddingHorizontal: 16
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
  continueButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  }
})

export default PackingOrdersScreen
