// screens/OrderDetailProductPicking.tsx
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Colors from '../constants/Colors'
import { PickingHeader } from '../components/PickingHeader'
import { ManualPickingModal } from '../components/ManualPickingModal'
import { DefaultModal } from '../components/DefaultModal'
import { usePickingLogic } from '../hooks/usePickingLogic'
import ProductInfo from '../components/PickingProduct'
import { WarningSvg } from '../components/svg/Warning'
import { router, useLocalSearchParams } from 'expo-router'
import { flowOrderDetailsAtom } from '../store'
import { useAtom } from 'jotai'

const PickingProductOrderDetail = () => {
  const {
    currentProduct,
    modalVisible,
    setModalVisible,
    incompleteModalVisible,
    setIncompleteModalVisible,
    errorModalVisible,
    setErrorModalVisible,
    simulateScanForIncomplete,
    handleRestartQuantityIncomplete,
    handleConfirmQuantity,
    handleIncompleteConfirm
  } = usePickingLogic()
  const { productId, orderId }: Partial<{ productId: number; orderId: number }> = useLocalSearchParams() // Assuming productId is passed as a parameter
  const [flowOrderDetails] = useAtom(flowOrderDetailsAtom)

  // Validación temprana
  if (!flowOrderDetails || !productId || !orderId) {
    return null // O un componente de loading/error
  }

  const productInfo = flowOrderDetails.find(product => product.id == productId && product.order_id == orderId)

  if (!productInfo) {
    return null // O un componente de error
  }

  // We can load the specific product in usePickingLogic based on the productId passed, if needed
  const handlePicking = () => {
    simulateScanForIncomplete('123456789', productId!, orderId!)
    // router.back()
  }

  const handleNavigation = () => {
    // Asegúrate de limpiar el estado antes de navegar
    router.push('/picking-orders')
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
          leftAction={handlePicking}
          rightAction={handleNavigation} // Navigates back to the PickingOrderDetailScreen
        />
      </View>
      <View style={styles.bodyContainer}>
        {currentProduct ? (
          <View style={styles.productBox}>
            <ProductInfo item={productInfo!} onRestartQuantity={() => handleRestartQuantityIncomplete(productId!, orderId!)} />
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.sectionTitle}>CONTINUAR</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text>No hay más productos</Text>
        )}
      </View>
      {currentProduct && (
        <>
          <ManualPickingModal
            visible={modalVisible}
            quantityPicked={currentProduct?.quantity_picked ?? 0}
            maxQuantity={currentProduct?.quantity}
            onConfirm={handleConfirmQuantity}
            onClose={() => setModalVisible(false)}
          />
          <DefaultModal
            visible={errorModalVisible} // Modal para el error de producto incorrecto
            title="Producto equivocado"
            description={`Código del producto: `}
            subDescription={`${currentProduct?.product_barcode}`}
            primaryButtonText="ATRÁS"
            primaryButtonAction={() => setErrorModalVisible(false)}
            icon={<WarningSvg width={40} height={41} color={Colors.red} />}
            iconBackgroundColor={Colors.lightRed}
          />
        </>
      )}
      <DefaultModal
        visible={incompleteModalVisible}
        title="Artículos pendientes"
        description="Quedaron productos pendientes de escanear. Podrá levantar el producto al final de la preparación."
        primaryButtonText="SEGUIR SIN LEVANTAR"
        primaryButtonAction={handleIncompleteConfirm}
        secondaryButtonText="ATRÁS"
        secondaryButtonAction={() => setIncompleteModalVisible(false)}
      />
    </LinearGradient>
  )
}

export default PickingProductOrderDetail

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
  }
})
