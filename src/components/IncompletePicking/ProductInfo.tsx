import React from 'react'
import { View, StyleSheet, Dimensions, Text } from 'react-native'
import { OrderDetails } from '../../types/order'
import Colors from '../../constants/Colors'
import { BoxDetailSvg } from '../svg/BoxDetail'
import ProductDetails from '../PickingProduct/components/ProductDetails'
import PickingInfo from '../PickingProduct/components/PickingInfo'
import PickingInfoWeight from '../PickingProduct/components/PickingInfoWeight'

const { width } = Dimensions.get('window')

interface ProductInfoProps {
  item: OrderDetails
  positions: string
  onRestartQuantity: () => void
  isCompleted?: boolean
}

const IncompletePickingProductInfo: React.FC<ProductInfoProps> = ({ item, positions, onRestartQuantity, isCompleted }) => {
  return (
    <View style={styles.card}>
      <ProductDetails productPhoto={item.product_photo!} productName={item.product_name} productBarcode={item.product_barcode!} />
      {item.weighable ? (
        <PickingInfoWeight item={item} onRestartQuantity={onRestartQuantity} />
      ) : (
        <PickingInfo
          productId={item.id}
          orderId={item.order_id}
          quantity={item.quantity}
          quantityPicked={item.quantity_picked ?? 0}
          warehouseOrder={item.warehouse_order!}
          onRestartQuantity={onRestartQuantity}
          isCompleted={isCompleted}
        />
      )}
      <View style={styles.flowInfo}>
        <View style={styles.orderBox}>
          <View style={styles.orderContainer}>
            <BoxDetailSvg width={28} height={28} color={Colors.grey5} />
            <Text style={styles.orderInfo}>Nro pedido</Text>
          </View>
          <Text style={styles.orderNumber}>{item.Orders.order_tenant_id}</Text>
        </View>
        <View style={styles.orderBox}>
          <View style={styles.orderContainer}>
            <Text style={styles.orderInfo}>Posición de entrega</Text>
          </View>
          <Text style={styles.orderNumber}>{positions}</Text>
        </View>
      </View>
    </View>
  )
}

export default IncompletePickingProductInfo

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    paddingVertical: 10,
    marginHorizontal: width * 0.05,
    justifyContent: 'space-between'
  },
  flowInfo: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 30
  },
  orderBox: {
    padding: 10,
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: Colors.grey1
  },
  orderContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  orderInfo: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: Colors.grey5
  },
  orderNumber: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: Colors.black,
    textAlign: 'center'
  }
})
