import React, { useRef, useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import Colors from '../constants/Colors'
import { DefaultHeader } from '../components/DefaultHeader'
import { basketsByOrderAtom, flowOrderDetailsAtom, currentProductAtom, currentProductIndexAtom } from '../store'
import { OrderDetails, PickingDetailEnum, PickingUpdate } from '../types/order'
import { useAtom } from 'jotai'
import { LinearGradient } from 'expo-linear-gradient'
import { BarcodeScannerSvg } from '../components/svg/BarcodeScanner'
import { BoxDetailSvg } from '../components/svg/BoxDetail'
import { BasketSvg } from '../components/svg/Basket'
import { DefaultModal } from '../components/DefaultModal'
import { useToast } from '../context/toast'
import { WarningSvg } from '../components/svg/Warning'
import LoadingPackingScreen from '../components/LoadingPackingScreen'
import { updateOrderDetails } from '../services/orderDetail'
import { updateOrders } from '../services/order'
import { calculateOrdersPickingState, groupOrderDetailsByOrderId } from '../helpers/groupOrders'
import { BackSvg } from '../components/svg/BackSvg'

const BasketValidationScreen = () => {
  const [flowOrderDetails, setFlowOrderDetails] = useAtom(flowOrderDetailsAtom)
  const [basketsByOrder] = useAtom(basketsByOrderAtom)
  const [currentProduct] = useAtom(currentProductAtom)
  const [currentProductIndex, setCurrentProductIndex] = useAtom(currentProductIndexAtom)
  const router = useRouter()
  const [modalVisible, setModalVisible] = useState(false)
  const [modalIncompleteVisible, setModalIncompleteVisible] = useState(false)
  const [modalSkipBasketVisible, setModalSkipBasketVisible] = useState(false)
  const [scannedBasketCode, setScannedBasketCode] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<TextInput>(null)
  const { showToast } = useToast()
  const isPickingIncomplete = flowOrderDetails.some(detail => detail.state_picking_details_id === PickingDetailEnum.INCOMPLETE)

  useEffect(() => {
    // Enfocar el input invisible automáticamente al cargar la pantalla
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleFinishPicking = async () => {
    try {
      setLoading(true)
      const transformOrderDetailsForUpdate = (details: OrderDetails[]): PickingUpdate[] => {
        return details.map(detail => ({
          order_id: detail.order_id,
          product_id: detail.product_id,
          quantity: detail.quantity,
          quantity_picked: detail.quantity_picked!,
          final_weight: detail.final_weight,
          state_picking_details_id: detail.state_picking_details_id!
        }))
      }

      const groupedOrders = Object.fromEntries(groupOrderDetailsByOrderId(flowOrderDetails).map(group => [group.order_id, group.details]))
      const ordersPickingState = calculateOrdersPickingState(groupedOrders)

      await updateOrderDetails(transformOrderDetailsForUpdate(flowOrderDetails))
      await updateOrders({ orders: ordersPickingState })

      // Navegar a la pantalla correspondiente después de que todo se complete exitosamente
      router.push('/packing-orders')
    } catch (error) {
      console.error('Error al finalizar el picking:', error)
      setLoading(false)
      // Aquí podrías mostrar un modal de error o un mensaje al usuario
    }
  }

  if (loading) {
    return <LoadingPackingScreen title="PICKING FINALIZADO" message="INICIANDO EMPAQUETADO" color={Colors.green} />
  }

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

  const handleBasket = () => {
    if (!basketsByOrder[currentProduct.order_id]?.includes(scannedBasketCode as number)) {
      // Mostrar modal de error si el canasto no coincide
      setModalVisible(true)
      // Reset input
      setScannedBasketCode(undefined)
      return
    }
    handleBasketValidation()
  }

  const handleBasketValidation = async () => {
    const updatedFlowOrderDetails = flowOrderDetails.map((detail, index) => {
      if (index === currentProductIndex) {
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
      showToast(`${currentProduct.quantity_picked!} productos levantados`, currentProduct.order_id, Colors.green, Colors.white)
      setCurrentProductIndex(currentProductIndex + 1)
      router.replace('/picking')
    } else {
      if (isPickingIncomplete) {
        setModalIncompleteVisible(true)
        return
      }
      handleFinishPicking()
    }
  }

  const handleSkipBasket = () => {
    handleBasketValidation()
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
        <DefaultHeader title="Guardado" leftIcon={<BackSvg width={30} height={30} color="black" />} leftAction={() => router.back()} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.productName}>{currentProduct?.product_name}</Text>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>{currentProduct?.weighable ? 'Peso' : 'Cant.'}</Text>
          <Text style={styles.quantityValue}>{currentProduct?.weighable ? `${currentProduct.final_weight!} gr` : currentProduct.quantity_picked}</Text>
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
        <TouchableOpacity style={styles.scanContainer} onPress={handleBasket}>
          <BarcodeScannerSvg width={40} height={40} color={Colors.black} />
          <Text style={styles.scanText}>Escaneá el cajón</Text>
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          style={styles.invisibleInput}
          value={scannedBasketCode?.toString()}
          onChangeText={text => setScannedBasketCode(Number(text))}
          onSubmitEditing={handleBasket}
          autoFocus={true}
        />
      </View>
      <TouchableOpacity style={styles.skipButton} onPress={() => setModalSkipBasketVisible(true)}>
        <Text style={styles.skipText}>Omitir</Text>
      </TouchableOpacity>

      <DefaultModal
        visible={modalVisible}
        title="Cajón equivocado"
        description={`Cajón/es correcto/s: ${baskets}`}
        icon={<WarningSvg width={40} height={41} color={Colors.red} />}
        iconBackgroundColor={Colors.lightRed}
        primaryButtonText="ATRÁS"
        primaryButtonAction={() => setModalVisible(false)}
        primaryButtonColor={Colors.mainBlue}
        primaryButtonTextColor={Colors.white}
      />
      <DefaultModal
        visible={modalIncompleteVisible}
        title="¡Pedidos incompetos!"
        description={'Algunos de los pedidos le falta algún articulo'}
        icon={<WarningSvg width={40} height={41} color={Colors.red} />}
        iconBackgroundColor={Colors.lightRed}
        primaryButtonText="VER PEDIDOS"
        primaryButtonAction={() => router.replace('/picking-orders')}
        primaryButtonColor={Colors.mainBlue}
        primaryButtonTextColor={Colors.white}
        secondaryButtonText="SEGUIR SIN COMPLETAR"
        secondaryButtonAction={handleFinishPicking}
        secondaryButtonColor={Colors.white}
        secondaryButtonTextColor={Colors.red}
      />
      <DefaultModal
        visible={modalSkipBasketVisible}
        title="¡Ciudado!"
        description={'Escanear el cajón donde se colocan los artículos reduce las posibilidades de mezclar los pedidos.'}
        icon={<WarningSvg width={40} height={41} color={Colors.red} />}
        iconBackgroundColor={Colors.lightRed}
        primaryButtonText="SEGUIR SIN ESCANEAR"
        primaryButtonAction={handleSkipBasket}
        primaryButtonColor={Colors.mainBlue}
        primaryButtonTextColor={Colors.white}
        secondaryButtonText="ATRÁS"
        secondaryButtonAction={() => setModalSkipBasketVisible(false)}
        secondaryButtonColor={Colors.white}
        secondaryButtonTextColor={Colors.red}
      />
    </LinearGradient>
  )
}

export default BasketValidationScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 20,
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
    width: 170,
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
