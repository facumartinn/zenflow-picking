// screens/PickingOrderDetailScreen.tsx
import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import Colors from '../constants/Colors'
import { AntDesign } from '@expo/vector-icons'
import { DefaultHeader } from '../components/DefaultHeader'
import { basketsByOrderAtom, flowAtom, flowOrderDetailsAtom, resetAllFlowAtoms } from '../store'
import { useAtom } from 'jotai'
import { OrderCard } from '../components/PickingOrders/components/OrderCard'
import { groupOrderDetailsByOrderId } from '../helpers/groupOrders'
import { DefaultModal } from '../components/DefaultModal'
import { WarningSvg } from '../components/svg/Warning'
import { cancelFlow } from '../services/flow'
import { BackSvg } from '../components/svg/BackSvg'

export const PickingOrdersScreen = () => {
  const [flowOrderDetails] = useAtom(flowOrderDetailsAtom)
  const [flow] = useAtom(flowAtom)
  const [, setResetFlow] = useAtom(resetAllFlowAtoms)
  const [basketsByOrder] = useAtom(basketsByOrderAtom)
  const [cancelPickingModalVisible, setCancelPickingModalVisible] = useState(false)

  const groupedOrders = groupOrderDetailsByOrderId(flowOrderDetails)

  const router = useRouter()

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

  return (
    <View style={styles.container}>
      <View style={styles.topBodyContainer}>
        <DefaultHeader title="Pedidos" leftIcon={<BackSvg width={30} height={30} color="black" />} leftAction={() => router.back()} />
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
        <TouchableOpacity style={styles.buttonContainer} onPress={() => setCancelPickingModalVisible(true)}>
          <AntDesign name="close" size={24} color={Colors.red} />
          <Text style={styles.buttonText}>Cancelar picking</Text>
        </TouchableOpacity>
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
    marginTop: 20,
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
    textAlign: 'center',
    fontSize: 18
  }
})
