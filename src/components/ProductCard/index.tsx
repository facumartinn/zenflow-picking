// ProductCard.tsx
import React, { memo } from 'react'
import { View, Text, Image, TouchableOpacity, StyleProp, ViewStyle } from 'react-native'
import { styles } from './styles'
import { OrderDetails, PickingDetailEnum } from '../../types/order'
import { WarningTriangleSvg } from '../svg/WarningTriangle'
import Colors from '../../constants/Colors'

type ProductCardProps = {
  product: OrderDetails
  onPress?: () => void
  style?: StyleProp<ViewStyle>
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, style }) => {
  const isFullPicked = product.state_picking_details_id === PickingDetailEnum.COMPLETED
  const isIncomplete = product.state_picking_details_id === PickingDetailEnum.INCOMPLETE

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress} disabled={!onPress}>
      <View style={[styles.cardContainer, isIncomplete ? styles.cardContainerIncomplete : styles.cardContainerNormal]}>
        <View style={styles.contentContainer}>
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
              <View style={isFullPicked ? styles.orderQuantityBox : isIncomplete ? styles.orderQuantityIncompleteBox : styles.quantityContainer}>
                <Text style={isFullPicked ? styles.orderText : styles.orderTextIncomplete}>Cant</Text>
                {isFullPicked ? (
                  <Text style={styles.orderQuantity}>{product.quantity}</Text>
                ) : isIncomplete ? (
                  <View style={styles.incompleteQuantityNumber}>
                    <Text style={styles.orderQuantityIncomplete}>{product.quantity_picked}/</Text>
                    <Text style={styles.orderTotalQuantityIncomplete}>{product.quantity}</Text>
                  </View>
                ) : (
                  <Text style={styles.orderNullQuantity}>{product.quantity}</Text>
                )}
              </View>
            </View>
          </View>
        </View>
        {isIncomplete && (
          <View style={styles.warningContainer}>
            <WarningTriangleSvg width={16} height={16} color={Colors.mainOrange} />
            <Text style={styles.warningText}>Incompleto</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default memo(ProductCard, (prevProps, nextProps) => {
  // Solo re-renderizar si cambian los datos relevantes del producto
  return (
    prevProps.product.product_name === nextProps.product.product_name &&
    prevProps.product.product_barcode === nextProps.product.product_barcode &&
    prevProps.product.quantity === nextProps.product.quantity &&
    prevProps.product.quantity_picked === nextProps.product.quantity_picked
  )
})
