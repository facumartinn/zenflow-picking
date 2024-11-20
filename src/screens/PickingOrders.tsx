// screens/PickingOrderDetailScreen.tsx
import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import Colors from '../constants/Colors'
import { AntDesign } from '@expo/vector-icons'
import { DefaultHeader } from '../components/DefaultHeader'
import { basketsByOrderAtom, flowOrderDetailsAtom } from '../store'
import { useAtom } from 'jotai'
import { OrderCard } from '../components/PickingOrders/components/OrderCard'
import { groupOrderDetailsByOrderId } from '../helpers/groupOrders'

export const PickingOrdersScreen = () => {
  const [flowOrderDetails] = useAtom(flowOrderDetailsAtom)
  const [basketsByOrder] = useAtom(basketsByOrderAtom)

  const groupedOrders = groupOrderDetailsByOrderId(flowOrderDetails)

  const router = useRouter()

  const handleCardPress = (orderId: number) => {
    // Navegar a la pantalla de detalle de pedido
    router.push({ pathname: '/picking-order-detail', params: { orderId } })
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBodyContainer}>
        <DefaultHeader
          title={<Text style={styles.headerTitle}>Pedidos</Text>}
          leftIcon={
            <View style={{ borderRadius: 100, backgroundColor: 'white', marginLeft: 10 }}>
              <AntDesign name="arrowleft" size={24} color="black" style={{ padding: 8 }} />
            </View>
          }
          leftAction={() => router.back()}
          rightIcon={null}
        />
      </View>
      <ScrollView style={styles.bodyContainer}>
        {groupedOrders.map((orderDetail, index) => {
          const state =
            orderDetail.total_quantity === orderDetail.picked_quantity
              ? 'COMPLETED'
              : orderDetail.total_quantity > orderDetail.picked_quantity
                ? 'IN_PROGRESS'
                : 'INCOMPLETE'

          return (
            <OrderCard
              key={index}
              orderId={orderDetail.order_id}
              basketCount={basketsByOrder[orderDetail.order_id].toString()}
              pickedQuantity={orderDetail.picked_quantity ?? 0}
              totalQuantity={orderDetail.total_quantity}
              state={state}
              onPress={() => handleCardPress(orderDetail.order_id)}
            />
          )
        })}
      </ScrollView>
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
  }
})
