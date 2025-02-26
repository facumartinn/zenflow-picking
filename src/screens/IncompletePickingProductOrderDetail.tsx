import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Colors from '../constants/Colors'
import { ManualPickingModal } from '../components/ManualPickingModal'
import { DefaultModal } from '../components/DefaultModal'
import { WarningSvg } from '../components/svg/Warning'
import { router, useLocalSearchParams } from 'expo-router'
import { useIncompletePickingProductDetailLogic } from '../hooks/useIncompletePickingProductDetailLogic'
import { OrderDetails } from '../types/order'
import IncompletePickingProductInfo from '../components/IncompletePicking/ProductInfo'
import { BackSvg } from '../components/svg/BackSvg'
import { BarcodeScannerSvg } from '../components/svg/BarcodeScanner'
import { DefaultHeader } from '../components/DefaultHeader'

const IncompletePickingProductOrderDetail = () => {
  const { product: productString } = useLocalSearchParams<{ product: string }>()
  const initialProduct = JSON.parse(productString) as OrderDetails

  const orderResourcesByComma = initialProduct?.Orders?.OrderResources?.map(resource => resource.position).join(', ')

  const { product, modalVisible, setModalVisible, errorModalVisible, setErrorModalVisible, handleScan, handleManualPicking, handleRestartQuantity } =
    useIncompletePickingProductDetailLogic(initialProduct)

  if (!product) {
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>Producto no encontrado</Text>
      </View>
    )
  }

  return (
    <LinearGradient
      colors={[Colors.mainLightBlue3, Colors.white]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      locations={[0.35, 0.35]}
    >
      <DefaultHeader
        title="Picking"
        rightIcon={<BarcodeScannerSvg width={30} height={30} color="black" />}
        rightAction={() => handleScan(product.weighable ? `${product.product_barcode}000500` : product.product_barcode ?? '')}
        leftIcon={<BackSvg width={30} height={30} color="black" />}
        leftAction={() => router.back()}
        backgroundColor="transparent"
      />
      <View style={styles.bodyContainer}>
        <View style={styles.productBox}>
          <IncompletePickingProductInfo item={product} positions={orderResourcesByComma} onRestartQuantity={handleRestartQuantity} />
          <View style={styles.actionsContainer}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.actionButton}>CONTINUAR MANUAL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ManualPickingModal
        visible={modalVisible}
        quantityPicked={product.quantity_picked ?? 0}
        maxQuantity={product.quantity}
        onConfirm={handleManualPicking}
        onClose={() => setModalVisible(false)}
      />
      <DefaultModal
        visible={errorModalVisible}
        title="Producto equivocado"
        description={`Código del producto: ${product.product_barcode}`}
        primaryButtonText="ATRÁS"
        primaryButtonColor={Colors.mainBlue}
        primaryButtonAction={() => setErrorModalVisible(false)}
        icon={<WarningSvg width={40} height={41} color={Colors.red} />}
        iconBackgroundColor={Colors.lightRed}
      />
    </LinearGradient>
  )
}

export default IncompletePickingProductOrderDetail

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey1
  },
  topBodyContainer: {
    // height: 80,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  bodyContainer: {
    marginTop: 20
  },
  productBox: {
    height: '90%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20
  },
  actionButton: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.mainBlue,
    marginTop: 14
  },
  incompleteButton: {
    color: Colors.red
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: Colors.grey1
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.grey3,
    textAlign: 'center'
  }
})
