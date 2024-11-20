import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { OrderDetails, PickingDetailEnum } from '../../../types/order'
import Colors from '../../../constants/Colors'

interface PickingOrderItemProps {
  product: OrderDetails
  onPress: () => void
}

const PickingOrderItem: React.FC<PickingOrderItemProps> = ({ product, onPress }) => {
  const isCompleted = product.state_picking_details_id == PickingDetailEnum.COMPLETED
  const isIncomplete = product.state_picking_details_id == PickingDetailEnum.INCOMPLETE
  const isPending = product.state_picking_details_id == PickingDetailEnum.PENDING

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <Image
        source={{
          uri:
            product.product_photo ??
            'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQzIgNSJRiNbQ0WT32ES38A_jFSdxswvdxyzpmKkt7gIllBHxmvHsx_84WNQpYOK7wvKOUoT0IjSw0FVqwraFdovM3RoJI3YkdxErPvVUQ3V4c6tC7zTw6d_0RpYwSfSyKOpYFk9g&usqp=CAc'
        }}
        style={styles.productImage}
      />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{product.product_name}</Text>
        <View style={styles.productInfo}>
          <View style={styles.barcodeContainer}>
            <Text style={styles.infoLabel}>Código</Text>
            <Text style={styles.infoValue}>{product.product_barcode}</Text>
          </View>
          {isCompleted ? (
            <View style={styles.orderQuantityBox}>
              <Text style={styles.orderText}>Cant</Text>
              <Text style={styles.orderQuantity}>{product.quantity}</Text>
            </View>
          ) : isPending ? (
            <View style={styles.pendingQuantityNumber}>
              <Text style={styles.orderTextPending}>Cant</Text>
              <Text style={styles.orderTotalQuantityPending}>{product.quantity}</Text>
            </View>
          ) : isIncomplete ? (
            <View style={styles.orderQuantityIncompleteBox}>
              <Text style={styles.orderTextIncomplete}>Cant</Text>
              <View style={styles.incompleteQuantityNumber}>
                <Text style={styles.orderQuantityIncomplete}>{product.quantity_picked}</Text>
                <Text style={styles.orderTotalQuantityIncomplete}>/{product.quantity}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.pendingQuantityNumber}>
              <Text style={styles.orderTextPending}>Cant</Text>
              <Text style={styles.orderTotalQuantityPending}>{product.quantity}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default PickingOrderItem

const styles = StyleSheet.create({
  cardContainer: {
    height: 130,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  productImage: {
    width: 110,
    height: 110,
    borderRadius: 8
  },
  productDetails: {
    flex: 1,
    marginLeft: 10
  },
  productName: {
    height: 44,
    fontSize: 18
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.grey5
  },
  infoValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18
  },
  barcodeContainer: {
    width: '75%',
    padding: 5,
    backgroundColor: Colors.grey1,
    borderRadius: 10
  },
  quantityContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '20%',
    padding: 5,
    backgroundColor: Colors.grey1,
    borderRadius: 10
  },
  orderQuantityIncompleteBox: {
    backgroundColor: Colors.red,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  orderQuantityIncomplete: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.white
  },
  orderTotalQuantityPending: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  },
  orderTotalQuantityIncomplete: {
    fontSize: 18,
    color: Colors.white
  },
  incompleteQuantityNumber: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.grey1
  },
  orderQuantityBox: {
    backgroundColor: Colors.green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pendingQuantityNumber: {
    backgroundColor: Colors.grey1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  orderQuantity: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.white
  },
  orderText: {
    fontSize: 16,
    marginBottom: 4,
    color: Colors.white
  },
  orderTextIncomplete: {
    fontSize: 16,
    marginBottom: 4,
    color: Colors.white
  },
  orderTextPending: {
    fontSize: 16,
    marginBottom: 4,
    color: Colors.black
  }
})
