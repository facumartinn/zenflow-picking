import React from 'react'
import { View, StyleSheet, Dimensions, Text } from 'react-native'
import { OrderDetails } from '../../types/order'
import Colors from '../../constants/Colors'
import { BoxDetailSvg } from '../svg/BoxDetail'
import { BasketSvg } from '../svg/Basket'
import ProductDetails from './components/ProductDetails'
import PickingInfo from './components/PickingInfo'
import { useAtom } from 'jotai'
import { basketsByOrderAtom } from '../../store'

const { width } = Dimensions.get('window')

interface ProductInfoProps {
  item: OrderDetails
  onRestartQuantity: () => void
}

const ProductInfo: React.FC<ProductInfoProps> = ({ item, onRestartQuantity }) => {
  const [basketsByOrder] = useAtom(basketsByOrderAtom)
  const baskets = basketsByOrder[item!.order_id]?.join(', ') || 'N/A'
  const basketTag = `Caj${basketsByOrder[item!.order_id].length > 1 ? 'ones' : 'ón'}`

  return (
    <View style={styles.card}>
      <ProductDetails productPhoto={item.product_photo!} productName={item.product_name} productBarcode={item.product_barcode!} />
      <PickingInfo
        quantity={item.quantity}
        quantityPicked={item.quantity_picked ?? 0}
        warehouseOrder={item.warehouse_order!}
        onRestartQuantity={onRestartQuantity}
      />
      <View style={styles.flowInfo}>
        <View style={styles.orderBox}>
          <View style={styles.orderContainer}>
            <BoxDetailSvg width={28} height={28} color={Colors.grey5} />
            <Text style={styles.orderInfo}>Nro pedido</Text>
          </View>
          <Text style={styles.orderNumber}>0000{item.order_id}</Text>
        </View>
        <View style={styles.orderBox}>
          <View style={styles.orderContainer}>
            <BasketSvg width={28} height={26} color={Colors.grey5} />
            <Text style={styles.orderInfo}>{basketTag}</Text>
          </View>
          <Text style={styles.orderNumber}>{baskets}</Text>
        </View>
      </View>
    </View>
  )
}

export default ProductInfo

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
    flexDirection: 'column',
    justifyContent: 'center'
  },
  orderContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  orderInfo: {
    marginLeft: 6,
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: Colors.grey5
  },
  orderNumber: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: Colors.grey5,
    textAlign: 'center'
  }
})