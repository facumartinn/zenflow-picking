// ProductCard.tsx
import React from 'react'
import { View, Text, Image } from 'react-native'
import { styles } from './styles'
import { OrderDetails, OrderStateEnum } from '../../types/order'

interface ProductCardProps {
  product: OrderDetails
}

const ProductCard = ({ product }: ProductCardProps) => {
  const isFullPicked = OrderStateEnum.FINISHED && product.quantity_picked === product?.quantity_picked

  return (
    <View style={styles.cardContainer}>
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
          <View style={isFullPicked ? styles.orderQuantityBox : styles.orderQuantityIncompleteBox}>
            <Text style={isFullPicked ? styles.orderText : styles.orderTextIncomplete}>Cant</Text>
            {isFullPicked ? (
              <Text style={styles.orderQuantity}>{product.quantity}</Text>
            ) : (
              <View style={styles.incompleteQuantityNumber}>
                <Text style={styles.orderQuantityIncomplete}>{product.quantity_picked}</Text>
                <Text style={styles.orderTotalQuantityIncomplete}>/{product.quantity}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

export default ProductCard
