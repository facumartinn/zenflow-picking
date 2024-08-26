// screens/BasketSelectionScreen.tsx

import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { DefaultHeader } from '../components/DefaultHeader'
import { AntDesign } from '@expo/vector-icons'
import Colors from '../constants/Colors'
import { useRouter } from 'expo-router'
import { useAtom } from 'jotai'
import { flowOrderDetailsAtom, basketsByOrderAtom } from '../store'
import { groupOrderDetailsByOrderId } from '../helpers/groupOrders'
import OrderCard from '../components/BasketSelection/OrderCard'
import BottomButton from '../components/BottomButton' // Asegúrate de tener este componente
import { DefaultModal } from '../components/DefaultModal'
import LoadingScreen from '../components/LoadingScreen'
import { WarningSvg } from '../components/svg/Warning'

const BasketSelectionScreen = () => {
  const [orderDetails] = useAtom(flowOrderDetailsAtom)
  const [basketsByOrder] = useAtom(basketsByOrderAtom)
  const groupedOrders = groupOrderDetailsByOrderId(orderDetails)
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        router.push('/picking') // Navega a la pantalla de picking
      }, 3000) // 3 segundos de pantalla de carga
      return () => clearTimeout(timer) // Limpia el timer si el componente se desmonta
    }
  }, [loading, router])

  const handleCardPress = (orderId: number) => {
    router.push({ pathname: '/basket-assignment', params: { orderId } })
  }

  const allOrdersReady = groupedOrders.every(order => basketsByOrder[order.order_id]?.length > 0)

  const handleStartPicking = () => {
    setLoading(true)
  }

  const handleBack = () => {
    // Aca pegarle a la api para cancelar el flow de picking
    router.navigate('/home')
  }

  if (loading) {
    return <LoadingScreen message="Iniciando picking" color={Colors.mainLightBlue} />
  }

  return (
    <View style={styles.container}>
      <DefaultHeader
        title={<Text style={styles.headerTitle}>Selección múltiple</Text>}
        leftIcon={
          <View style={{ borderRadius: 100, backgroundColor: 'white', marginLeft: 10 }}>
            <AntDesign name="arrowleft" size={24} color="black" style={{ padding: 8 }} />
          </View>
        }
        leftAction={() => setModalVisible(true)}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.bodyContainer}>
          <Text style={styles.screenTitle}>Asignación de cajones</Text>
          {groupedOrders.map(order => {
            const isOrderReady = basketsByOrder[order.order_id]?.length > 0
            return (
              <TouchableOpacity key={order.order_id} onPress={() => handleCardPress(order.order_id)}>
                <OrderCard order={order} isOrderReady={isOrderReady} />
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
      {allOrdersReady && <BottomButton text="INICIAR PICKING" onPress={handleStartPicking} />}
      <DefaultModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        icon={<WarningSvg width={40} height={41} color={Colors.red} />}
        title="¿Volver al inicio?"
        description="Se perderán todos los avances y tendrás que volver a empezar."
        primaryButtonText="VOLVER AL INICIO"
        primaryButtonAction={handleBack}
        secondaryButtonText="ATRÁS"
        secondaryButtonAction={() => setModalVisible(false)}
      />
    </View>
  )
}

export default BasketSelectionScreen

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
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
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.black,
    marginBottom: 16
  }
})