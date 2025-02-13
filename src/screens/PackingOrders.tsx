import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import Colors from '../constants/Colors'
import { basketsByOrderAtom, flowOrderDetailsAtom, packingOrdersAtom } from '../store'
import { useAtom } from 'jotai'
import { PackingOrderCard } from '../components/PackingOrderCard'
import { groupOrderDetailsByOrderId } from '../helpers/groupOrders'
import { PrintStatusEnum } from '../types/flow'
import LoadingPackingScreen from '../components/LoadingPackingScreen'
import { OrderStateEnum } from '../types/order'
import { updateOrderStatus } from '../services/order'

const PackingOrdersScreen = () => {
  const [flowOrderDetails] = useAtom(flowOrderDetailsAtom)
  const [packingOrders] = useAtom(packingOrdersAtom)
  const [basketsByOrder] = useAtom(basketsByOrderAtom)
  const router = useRouter()
  const groupedOrders = groupOrderDetailsByOrderId(flowOrderDetails)
  const [loading, setLoading] = useState(false)

  const handleCardPress = (orderId: number) => {
    router.push({ pathname: '/packing-order-detail', params: { orderId } })
  }

  const getPrintStatus = (orderId: number): PrintStatusEnum => {
    return packingOrders[orderId]?.print_status || PrintStatusEnum.NOT_PRINTED
  }

  const allOrdersPrinted = useMemo(() => {
    return groupedOrders.every(order => getPrintStatus(order.order_id) === PrintStatusEnum.PRINTED)
  }, [groupedOrders, packingOrders])

  const orderIds = Object.keys(basketsByOrder).map(Number)

  const handleContinue = async () => {
    try {
      setLoading(true)
      await updateOrderStatus(OrderStateEnum.DELIVERING, orderIds)
      // Si todo se ejecutó correctamente, navegar a la siguiente pantalla
      router.push('/packing-delivery')
    } catch (error) {
      console.error('Error al actualizar el estado de los pedidos:', error)
      setLoading(false)
      // Aquí podrías mostrar un modal de error o un mensaje al usuario
    }
  }

  if (loading) {
    return <LoadingPackingScreen title="PICKING FINALIZADO" subtitle="EMPAQUETADO FINALIZADO" message="INICIANDO ENTREGA" color={Colors.green} />
  }

  if (!groupedOrders.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No hay pedidos disponibles</Text>
      </View>
    )
  }

  const basketCountSeparatedByComma = basketsByOrder[groupedOrders[0].order_id]?.join('/') || ''

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
            basketCount={basketCountSeparatedByComma}
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
