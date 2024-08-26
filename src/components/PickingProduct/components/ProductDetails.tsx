import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import Colors from '../../../constants/Colors'

interface ProductDetailsProps {
  productPhoto: string
  productName: string
  productBarcode: string
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productPhoto, productName, productBarcode }) => {
  return (
    <View style={styles.productInfoContainer}>
      <View style={styles.productImageContainer}>
        <Image source={{ uri: productPhoto }} style={styles.productImage} />
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{productName}</Text>
        <Text style={styles.barcode}>{productBarcode}</Text>
      </View>
    </View>
  )
}

export default ProductDetails

const styles = StyleSheet.create({
  productInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20
  },
  productImageContainer: {
    backgroundColor: Colors.white,
    padding: 5,
    borderRadius: 12,
    marginRight: 20
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain'
  },
  productDetails: {
    flex: 1
  },
  productName: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  },
  barcode: {
    fontSize: 18,
    color: Colors.black
  }
})
