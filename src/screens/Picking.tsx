import React, { useCallback, useState, useRef, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useFocusEffect } from '@react-navigation/native'
import Colors from '../constants/Colors'
import { PickingHeader } from '../components/PickingHeader'
import { ManualPickingModal } from '../components/ManualPickingModal'
import { DefaultModal } from '../components/DefaultModal'
import { usePickingLogicV2 } from '../hooks/usePickingLogicV2'
import ProductInfo from '../components/PickingProduct'
import { WarningSvg } from '../components/svg/Warning'
import { router } from 'expo-router'

const PickingScreen = () => {
  const [quantityPicked, setQuantityPicked] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<TextInput>(null)
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
    handleRestartQuantity,
    isCompleted,
    checkAndUpdateCurrentProduct,
    isProductProcessed
  } = usePickingLogicV2()

  // Mantener el foco en el input oculto
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (!currentProduct || isProductProcessed(currentProduct.state_picking_details_id)) {
        checkAndUpdateCurrentProduct()
      }
      // Asegurar que el input tenga el foco cuando la pantalla está en foco
      inputRef.current?.focus()
    }, [currentProduct, isProductProcessed])
  )

  // Manejar el escaneo de códigos de barras
  const handleBarcodeScan = (barcode: string) => {
    if (currentProduct) {
      handleScan(barcode)
      // Resetear el input después de escanear
      setInputValue('')
      // Mantener el foco en el input
      inputRef.current?.focus()
    }
  }

  if (!currentProduct) {
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>No hay productos disponibles</Text>
      </View>
    )
  }

  const manualPickingAction = (quantity: number) => {
    setQuantityPicked(quantity)
    if (quantity === currentProduct?.quantity) {
      return handleManualPicking(quantity)
    } else {
      setIncompleteModalVisible(true)
    }
  }
  return (
    <LinearGradient
      colors={[Colors.mainLightBlue3, Colors.white]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      locations={[0.35, 0.35]}
    >
      <View style={styles.topBodyContainer}>
        <PickingHeader
          title="Escanear artículo"
          leftAction={() => handleBarcodeScan(currentProduct.weighable ? `${currentProduct.product_barcode}000500` : currentProduct.product_barcode ?? '')}
          rightAction={() => router.push('/picking-orders')}
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

      {/* Input oculto para escaneo de códigos de barras */}
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={inputValue}
        onChangeText={setInputValue}
        onSubmitEditing={e => handleBarcodeScan(e.nativeEvent.text)}
        blurOnSubmit={false}
      />

      <ManualPickingModal
        visible={modalVisible}
        quantityPicked={currentProduct?.quantity_picked ?? 0}
        maxQuantity={currentProduct.quantity}
        onConfirm={quantity => manualPickingAction(quantity)}
        onClose={() => {
          setModalVisible(false)
          // Asegurar que el input mantenga el foco después de cerrar el modal
          inputRef.current?.focus()
        }}
      />

      <DefaultModal
        visible={incompleteModalVisible}
        title="Artículos pendientes"
        description="Quedaron productos pendientes de escanear. Podrá levantar el producto al final de la preparación."
        primaryButtonText="SEGUIR SIN LEVANTAR"
        primaryButtonAction={() => {
          setIncompleteModalVisible(false)
          handleManualPicking(quantityPicked)
          // Asegurar que el input mantenga el foco después de cerrar el modal
          inputRef.current?.focus()
        }}
        secondaryButtonText="ATRÁS"
        secondaryButtonAction={() => {
          setIncompleteModalVisible(false)
          // Asegurar que el input mantenga el foco después de cerrar el modal
          inputRef.current?.focus()
        }}
      />

      <DefaultModal
        visible={errorModalVisible}
        title="Producto equivocado"
        description={`Código del producto: ${currentProduct.product_barcode}`}
        primaryButtonText="ATRÁS"
        primaryButtonColor={Colors.mainBlue}
        primaryButtonAction={() => {
          setErrorModalVisible(false)
          // Asegurar que el input mantenga el foco después de cerrar el modal
          inputRef.current?.focus()
        }}
        icon={<WarningSvg width={40} height={41} color={Colors.red} />}
        iconBackgroundColor={Colors.lightRed}
      />
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
  },
  hiddenInput: {
    height: 0,
    width: 0,
    opacity: 0
  }
})
