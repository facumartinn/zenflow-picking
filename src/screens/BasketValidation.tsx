import React, { useRef, useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import Colors from '../constants/Colors'
import { AntDesign } from '@expo/vector-icons'
import { DefaultHeader } from '../components/DefaultHeader'
import { basketsByOrderAtom, flowOrderDetailsAtom, currentProductAtom, currentProductIndexAtom } from '../store'
import { PickingDetailEnum } from '../types/order'
import { useAtom } from 'jotai'
import { LinearGradient } from 'expo-linear-gradient'
import { BarcodeScannerSvg } from '../components/svg/BarcodeScanner'
import { BoxDetailSvg } from '../components/svg/BoxDetail'
import { BasketSvg } from '../components/svg/Basket'
import { DefaultModal } from '../components/DefaultModal'

const BasketValidationScreen = () => {
  const [flowOrderDetails, setFlowOrderDetails] = useAtom(flowOrderDetailsAtom)
  const [basketsByOrder] = useAtom(basketsByOrderAtom)
  const [currentProduct] = useAtom(currentProductAtom)
  const [currentProductIndex, setCurrentProductIndex] = useAtom(currentProductIndexAtom)
  const router = useRouter()
  const [modalVisible, setModalVisible] = useState(false)
  const [scannedBasketCode, setScannedBasketCode] = useState(0)
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    // Enfocar el input invisible automáticamente al cargar la pantalla
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  if (!currentProduct) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No hay productos en progreso.</Text>
        <TouchableOpacity onPress={() => router.replace('/picking')}>
          <Text style={styles.backButtonText}>Volver a la pantalla de picking</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const baskets = basketsByOrder[currentProduct!.order_id]?.join(', ') || 'N/A'

  const handleBasketValidation = () => {
    console.log(basketsByOrder[currentProduct.order_id], scannedBasketCode)
    if (!basketsByOrder[currentProduct.order_id]?.includes(scannedBasketCode)) {
      // Mostrar modal de error si el canasto no coincide
      setModalVisible(true)
      return
    }

    const updatedFlowOrderDetails = flowOrderDetails.map((detail, index) => {
      if (index === currentProductIndex) {
        // Verificar si la cantidad es incompleta
        if (detail.quantity_picked! < detail.quantity) {
          return { ...detail, state_picking_details_id: PickingDetailEnum.INCOMPLETE }
        } else {
          return { ...detail, state_picking_details_id: PickingDetailEnum.COMPLETED }
        }
      } else if (index === currentProductIndex + 1) {
        return { ...detail, state_picking_details_id: PickingDetailEnum.IN_PROGRESS }
      } else {
        return detail
      }
    })

    setFlowOrderDetails(updatedFlowOrderDetails)

    if (currentProductIndex < flowOrderDetails.length - 1) {
      // Navegar de vuelta al PickingScreen después de que el estado se actualice
      setCurrentProductIndex(currentProductIndex + 1)
      router.replace('/picking')
    } else {
      console.log('Picking process completed.')
      router.replace('/picking-completed') // Pantalla de proceso completado
    }
  }

  const handleOnChangeText = (text: string) => {
    setScannedBasketCode(parseInt(text))
  }

  return (
    <LinearGradient
      colors={[Colors.lightOrange, Colors.grey1]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      locations={[0.35, 0.35]}
    >
      <View style={styles.topBodyContainer}>
        <DefaultHeader
          title={<Text style={styles.headerTitle}>Guardado</Text>}
          leftIcon={
            <View style={{ borderRadius: 100, backgroundColor: 'white', marginLeft: 10 }}>
              <AntDesign name="arrowleft" size={24} color="black" style={{ padding: 8 }} />
            </View>
          }
          leftAction={() => router.back()}
          rightIcon={null}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.productName}>{currentProduct?.product_name}</Text>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Cant.</Text>
          <Text style={styles.quantityValue}>{currentProduct?.quantity_picked}</Text>
        </View>
        <View style={styles.orderInfoContainer}>
          <View style={styles.orderBox}>
            <View style={styles.orderBoxName}>
              <BoxDetailSvg width={20} height={20} color={Colors.black} />
              <Text style={styles.orderBoxLabel}>Nro pedido</Text>
            </View>
            <Text style={styles.orderBoxValue}>000{currentProduct?.order_id}</Text>
          </View>
          <View style={styles.orderBox}>
            <View style={styles.orderBoxName}>
              <BasketSvg width={20} height={20} color={Colors.black} />
              <Text style={styles.orderBoxLabel}>Cajón</Text>
            </View>
            <Text style={styles.orderBoxValue}>{baskets}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.scanContainer} onPress={handleBasketValidation}>
          <BarcodeScannerSvg width={40} height={40} color={Colors.black} />
          <Text style={styles.scanText}>Escaneá el cajón</Text>
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          style={styles.invisibleInput}
          value={scannedBasketCode.toString()}
          onChangeText={text => setScannedBasketCode(Number(text))}
          onSubmitEditing={handleBasketValidation}
          autoFocus={true}
        />
      </View>
      <TouchableOpacity style={styles.skipButton} onPress={() => console.log('Omitir')}>
        <Text style={styles.skipText}>Omitir</Text>
      </TouchableOpacity>

      <DefaultModal
        visible={modalVisible}
        title="Producto equivocado"
        description={`Cajón/es correcto/s: ${baskets}`}
        primaryButtonText="ATRÁS"
        primaryButtonAction={() => setModalVisible(false)}
        primaryButtonColor={Colors.mainBlue}
        primaryButtonTextColor={Colors.white}
      />
    </LinearGradient>
  )
}

export default BasketValidationScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: Colors.grey1,
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.black
  },
  topBodyContainer: {
    height: 80,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  errorText: {
    fontSize: 18,
    color: Colors.red,
    textAlign: 'center'
  },
  backButtonText: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.mainBlue,
    textAlign: 'center'
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  productName: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: Colors.black,
    marginBottom: 40
  },
  quantityContainer: {
    backgroundColor: Colors.lightOrange,
    width: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    padding: 5,
    borderRadius: 20
  },
  quantityLabel: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: Colors.black,
    marginRight: 8
  },
  quantityValue: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  },
  orderInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginBottom: 40
  },
  orderBoxName: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  orderBox: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: Colors.orange,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center'
  },
  orderBoxLabel: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.grey5
  },
  orderBoxValue: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  },
  scanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  scanText: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: Colors.grey5,
    marginLeft: 10
  },
  skipButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center'
  },
  skipText: {
    bottom: 0,
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: Colors.mainBlue
  },
  invisibleInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0
  }
})
