import React from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import Colors from '../constants/Colors'
import { DefaultHeader } from '../components/DefaultHeader'
import { router, useLocalSearchParams } from 'expo-router'
import { flowOrderDetailsAtom } from '../store'
import { useAtom } from 'jotai'
import PickingOrderItem from '../components/PickingOrderDetail/components/PickingOrderItem'
import { OrderDetails, PickingDetailEnum } from '../types/order'
import { BoxDetailSvg } from '../components/svg/BoxDetail'
import { BackSvg } from '../components/svg/BackSvg'

type LocalSearchParams = {
  orderId: number
}

export const PickingOrderDetailScreen = () => {
  const { orderId }: Partial<LocalSearchParams> = useLocalSearchParams()
  const [flowOrderDetails] = useAtom(flowOrderDetailsAtom)

  const filterOrderDetailById = flowOrderDetails.filter(order => order.order_id == orderId)
  const getTotalQuantity = filterOrderDetailById.reduce((acc, order) => acc + order.quantity, 0)

  const handleProductPress = (product: OrderDetails) => {
    if (
      product.state_picking_details_id === PickingDetailEnum.INCOMPLETE ||
      product.state_picking_details_id === PickingDetailEnum.PENDING ||
      product.state_picking_details_id === PickingDetailEnum.IN_PROGRESS ||
      product.state_picking_details_id === null
    ) {
      router.push({ pathname: '/picking-product-order-detail', params: { productId: product.id, orderId } })
    }
  }

  const renderHeader = () => (
    <View>
      <View style={styles.orderContainer}>
        <BoxDetailSvg height={32} width={32} color={Colors.grey5} />
        <Text style={styles.orderIdTitle}>Nro pedido</Text>
        <Text style={styles.orderId}>000{orderId}</Text>
      </View>
      <Text style={styles.orderLength}>{getTotalQuantity} articulos</Text>
    </View>
  )

  const renderItem = ({ item }: { item: OrderDetails }) => <PickingOrderItem product={item} onPress={() => handleProductPress(item)} />

  return (
    <View style={styles.container}>
      <View style={styles.topBodyContainer}>
        <DefaultHeader title="Detalle Pedido" leftIcon={<BackSvg width={30} height={30} color="black" />} leftAction={() => router.back()} />
      </View>
      <FlatList
        data={filterOrderDetailById}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  )
}

export default PickingOrderDetailScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey1
  },
  listContainer: {
    padding: 16
  },
  orderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10
  },
  orderIdTitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.grey5
  },
  orderId: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold'
  },
  orderLength: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.black,
    marginBottom: 10
  },
  topBodyContainer: {
    height: 80,
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
})
