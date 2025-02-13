import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Colors from '../constants/Colors'
import { PickingHeader } from '../components/PickingHeader'
import { ManualPickingModal } from '../components/ManualPickingModal'
import { DefaultModal } from '../components/DefaultModal'
import { usePickingLogicV2 } from '../hooks/usePickingLogicV2'
import ProductInfo from '../components/PickingProduct'
import { WarningSvg } from '../components/svg/Warning'
import { router } from 'expo-router'

const PickingScreen = () => {
  const {
    currentProduct,
    modalVisible,
    setModalVisible,
    incompleteModalVisible,
    setIncompleteModalVisible,
    errorModalVisible,
    setErrorModalVisible,
    handleScan,
    handleManualPicking,
    handleIncompleteConfirm,
    handleRestartQuantity,
    isCompleted
  } = usePickingLogicV2()

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
          leftAction={() => handleScan(currentProduct?.weighable ? `${currentProduct.product_barcode}000500` : currentProduct?.product_barcode ?? '')}
          rightAction={() => router.navigate('/picking-orders')}
        />
      </View>
      <View style={styles.bodyContainer}>
        {currentProduct ? (
          <View style={styles.productBox}>
            <ProductInfo item={currentProduct} onRestartQuantity={handleRestartQuantity} isCompleted={isCompleted} />
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.sectionTitle}>CONTINUAR MANUAL</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No hay productos disponibles</Text>
          </View>
        )}
      </View>
      {currentProduct && (
        <>
          <ManualPickingModal
            visible={modalVisible}
            quantityPicked={0}
            maxQuantity={currentProduct.quantity}
            onConfirm={handleManualPicking}
            onClose={() => setModalVisible(false)}
          />
          <DefaultModal
            visible={incompleteModalVisible}
            title="Artículos pendientes"
            description="Quedaron productos pendientes de escanear. Podrá levantar el producto al final de la preparación."
            primaryButtonText="SEGUIR SIN LEVANTAR"
            primaryButtonAction={handleIncompleteConfirm}
            secondaryButtonText="ATRÁS"
            secondaryButtonAction={() => setIncompleteModalVisible(false)}
          />
          <DefaultModal
            visible={errorModalVisible}
            title="Producto equivocado"
            description={`Código del producto: ${currentProduct.product_barcode}`}
            primaryButtonText="ATRÁS"
            primaryButtonColor={Colors.mainBlue}
            primaryButtonAction={() => setErrorModalVisible(false)}
            icon={<WarningSvg width={40} height={41} color={Colors.red} />}
            iconBackgroundColor={Colors.lightRed}
          />
        </>
      )}
    </LinearGradient>
  )
}

export default PickingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.mainBlue,
    marginTop: 14,
    marginBottom: 14,
    marginLeft: 10
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.grey3,
    textAlign: 'center'
  }
})
