import React, { useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import Colors from '../constants/Colors'
import { flowOrderDetailsAtom, packingOrdersAtom } from '../store'
import { useAtom } from 'jotai'
import { PackingOrderCard } from '../components/PackingOrderCard'
import { groupOrderDetailsByOrderId } from '../helpers/groupOrders'
import { PrintStatusEnum } from '../types/flow'

const PackingOrdersScreen = () => {
  const [flowOrderDetails] = useAtom(flowOrderDetailsAtom)
  const [packingOrders] = useAtom(packingOrdersAtom)
  const router = useRouter()
  const groupedOrders = groupOrderDetailsByOrderId(flowOrderDetails)

  const handleCardPress = (orderId: number) => {
    router.push({ pathname: '/packing-order-detail', params: { orderId } })
  }

  const getPrintStatus = (orderId: number): PrintStatusEnum => {
    return packingOrders[orderId]?.print_status || PrintStatusEnum.NOT_PRINTED
  }

  const allOrdersPrinted = useMemo(() => {
    return groupedOrders.every(order => getPrintStatus(order.order_id) === PrintStatusEnum.PRINTED)
  }, [groupedOrders, packingOrders])

  const handleContinue = () => {
    // Aquí puedes agregar la lógica para continuar con el proceso
    console.log('Continuando con el proceso...')
    // Por ejemplo, podrías navegar a una nueva pantalla:
    // router.push('/next-screen')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Elegí un pedido para empaquetar</Text>
      <Text style={styles.subtitle}>Tendrás que indicar que vas a utilizar para entregar el pedido.</Text>
      <ScrollView style={styles.bodyContainer}>
        {groupedOrders.map((order, index) => (
          <PackingOrderCard
            key={index}
            orderId={order.order_id}
            printStatus={getPrintStatus(order.order_id)}
            basketCount={'15/16'}
            quantity={order.picked_quantity}
            onPress={() => handleCardPress(order.order_id)}
          />
        ))}
        {allOrdersPrinted && (
          <View style={styles.continueButtonContainer}>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>CONTINUAR</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: Colors.background
  },
  title: {
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
