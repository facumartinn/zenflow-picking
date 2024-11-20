import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Colors from '../constants/Colors'
import { AntDesign } from '@expo/vector-icons'
import { DefaultHeader } from '../components/DefaultHeader'
import { router, useLocalSearchParams } from 'expo-router'
import { flowOrderDetailsAtom } from '../store'
import { useAtom } from 'jotai'
import PickingOrderItem from '../components/PickingOrderDetail/components/PickingOrderItem'
import { OrderDetails, PickingDetailEnum } from '../types/order'
import { BoxDetailSvg } from '../components/svg/BoxDetail'

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
      product.state_picking_details_id === PickingDetailEnum.IN_PROGRESS
    ) {
      router.push({ pathname: '/picking-product-order-detail', params: { productId: product.id, orderId } }) // Navigate to the new picking screen
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBodyContainer}>
        <DefaultHeader
          title={<Text style={styles.headerTitle}>Detalle Pedido</Text>}
          leftIcon={
            <View style={{ borderRadius: 100, backgroundColor: 'white', marginLeft: 10 }}>
              <AntDesign name="arrowleft" size={24} color="black" style={{ padding: 8 }} />
            </View>
          }
          leftAction={() => router.back()}
          rightIcon={null}
        />
      </View>
      <View style={styles.bodyContainer}>
        <View>
          <View style={styles.orderContainer}>
            <BoxDetailSvg height={32} width={32} color={Colors.grey5} />
            <Text style={styles.orderIdTitle}>Nro pedido</Text>
            <Text style={styles.orderId}>000{orderId}</Text>
          </View>
          <Text style={styles.orderLength}>{getTotalQuantity} articulos</Text>
        </View>
        {filterOrderDetailById.map((orderDetail, index) => {
          return <PickingOrderItem key={index} product={orderDetail} onPress={() => handleProductPress(orderDetail)} />
        })}
      </View>
    </View>
  )
}

export default PickingOrderDetailScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 20,
    backgroundColor: Colors.grey1
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
