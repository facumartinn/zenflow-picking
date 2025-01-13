import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { DefaultHeader } from '../components/DefaultHeader'
import AntDesign from '@expo/vector-icons/AntDesign'
import Colors from '../constants/Colors'
import ProductCard from '../components/ProductCard'
import { OrderStateEnum } from '../types/order'
import { OrderDetailLoader } from '../store/OrderLoader'
import { orderDetailsAtom, warehousesAtom } from '../store'
import { useAtom } from 'jotai'
import { router, useLocalSearchParams } from 'expo-router'

type LocalSearchParams = {
  orderId: number
  stateId: number
  quantity: number
}

const OrderDetailScreen = () => {
  const { orderId, stateId, quantity }: Partial<LocalSearchParams> = useLocalSearchParams()
  const [orderDetails] = useAtom(orderDetailsAtom)
  const [warehouseConfig] = useAtom(warehousesAtom)
  const orderDetailsArray = Array.isArray(orderDetails) ? orderDetails : []

  const handleBack = () => {
    // setOrderDetails([])
    return [OrderStateEnum.NEW, OrderStateEnum.READY_TO_PICK, OrderStateEnum.SCHEDULED].includes(Number(stateId) as OrderStateEnum)
      ? router.navigate('/home')
      : router.navigate({ pathname: '/completed-order-detail', params: { orderId, stateId, quantity } })
  }
  // obtener la cantidad total de productos
  const totalQuantity = orderDetails.reduce((acc, product) => acc + product.quantity, 0)

  const shift = warehouseConfig?.use_shifts?.shifts?.find(shift => shift.id === orderDetails[0]?.Orders?.assembly_schedule)

  return (
    <View style={{ flex: 1 }}>
      <OrderDetailLoader orderId={orderId!} />
      <DefaultHeader
        title={<Text style={styles.headerTitle}>Detalle pedido</Text>}
        leftIcon={
          <View style={{ borderRadius: 100, backgroundColor: 'white', marginLeft: 10 }}>
            <AntDesign name="arrowleft" size={24} color="black" style={{ padding: 8 }} />
          </View>
        }
        leftAction={handleBack}
      />
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>Número de pedido</Text>
          <Text style={styles.value}>0000{orderId}</Text>
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
      {/* <Text>{JSON.stringify(orderDetails)}</Text> */}
      <FlatList data={orderDetailsArray} renderItem={({ item }) => <ProductCard product={item} />} keyExtractor={item => item?.product_id?.toString()} />
      {stateId == OrderStateEnum.READY_TO_PICK ? (
        <TouchableOpacity style={styles.startPickingButton}>
          <Text style={styles.startPickingText}>INICIAR PICKING</Text>
        </TouchableOpacity>
      ) : null}
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
