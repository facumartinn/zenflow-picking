// src/screens/PickingProductOrderDetail.tsx
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Colors from '../constants/Colors'
import { PickingHeader } from '../components/PickingHeader'
import { ManualPickingModal } from '../components/ManualPickingModal'
import { DefaultModal } from '../components/DefaultModal'
import { usePickingProductDetailLogic } from '../hooks/usePickingProductDetailLogic'
import ProductInfo from '../components/PickingProduct'
import { WarningSvg } from '../components/svg/Warning'
import { router, useLocalSearchParams } from 'expo-router'

const PickingProductOrderDetail = () => {
  const { productId } = useLocalSearchParams<{ productId: string }>()

  const { product, modalVisible, setModalVisible, errorModalVisible, setErrorModalVisible, handleScan, handleManualPicking, handleRestartQuantity } =
    usePickingProductDetailLogic(productId)

  if (!product) {
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>Producto no encontrado</Text>
      </View>
    )
  }

  return (
    <LinearGradient
      colors={[Colors.mainLightBlue2, Colors.grey1]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      locations={[0.35, 0.35]}
    >
      <View style={styles.topBodyContainer}>
        <PickingHeader
          title="Escanear artículo"
          leftAction={() => handleScan(product.weighable ? `${product.product_barcode}000500` : product.product_barcode ?? '')}
          rightAction={() => router.back()}
        />
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.productBox}>
          <ProductInfo item={product} onRestartQuantity={handleRestartQuantity} />
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

export default PickingProductOrderDetail

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey1
  },
  topBodyContainer: {
    height: 80,
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
