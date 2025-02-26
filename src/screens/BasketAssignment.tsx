// screens/BasketAssignmentScreen.tsx

import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { DefaultHeader } from '../components/DefaultHeader'
import Colors from '../constants/Colors'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useAtom } from 'jotai'
import ProductCard from '../components/ProductCard'
import { OrderDetails } from '../types/order'
import { basketsByOrderAtom, flowOrderDetailsAtom } from '../store'
import { BarcodeScannerSvg } from '../components/svg/BarcodeScanner'
import { DefaultModal } from '../components/DefaultModal'
import { WarningSvg } from '../components/svg/Warning'
import { BackSvg } from '../components/svg/BackSvg'
import { CrossSvg } from '../components/svg/CrossSvg'

type LocalSearchParams = {
  orderId: number
  tenantOrderId: number
}

const BasketAssignmentScreen = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const { orderId, tenantOrderId }: Partial<LocalSearchParams> = useLocalSearchParams()
  const [orderDetails] = useAtom(flowOrderDetailsAtom)
  const [basketsByOrder, setBasketsByOrder] = useAtom(basketsByOrderAtom)
  const [baskets, setBaskets] = useState<number[]>([])
  const inputRef = useRef<TextInput>(null)
  const [inputValue, setInputValue] = useState('')
  const router = useRouter()
  const [modalTitle, setModalTitle] = useState('Ya usaste este cajón')
  const [modalDescription, setModalDescription] = useState('Probá con otro.')

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (basketsByOrder[orderId!]) {
      setBaskets(basketsByOrder[orderId!])
    }
  }, [basketsByOrder, orderId])

  const handleAddBasket = (barcode: string) => {
    const basketId = parseInt(barcode, 10)

    // Verificar si el canasto ya está siendo usado en algún otro pedido
    const isBasketUsedInOtherOrder = Object.entries(basketsByOrder).some(([currentOrderId, baskets]) => {
      // Convertir a número para comparar correctamente
      const numericOrderId = parseInt(currentOrderId, 10)
      // Verificar si el canasto está en otro pedido (no en el actual)
      return numericOrderId !== orderId && baskets.includes(basketId)
    })

    if (isBasketUsedInOtherOrder) {
      setModalTitle('Cajón en uso')
      setModalDescription('Este cajón está siendo utilizado en otro pedido.')
      setModalVisible(true)
      // Resetear el input y mantener el foco
      setInputValue('')
      inputRef.current?.focus()
      return
    }

    // Verificar si el canasto ya está en el pedido actual
    if (!baskets.includes(basketId)) {
      const updatedBaskets = [...baskets, basketId]
      setBaskets(updatedBaskets)
      setBasketsByOrder(prev => ({ ...prev, [orderId!]: updatedBaskets }))
    } else {
      setModalVisible(true)
    }

    // Resetear el input y mantener el foco después de procesar el código
    setInputValue('')
    inputRef.current?.focus()
  }

  const handleRemoveBasket = (basketId: number) => {
    const updatedBaskets = baskets.filter(id => id !== basketId)
    setBaskets(updatedBaskets)
    setBasketsByOrder(prev => ({ ...prev, [orderId!]: updatedBaskets }))
  }

  const handleSave = () => {
    router.push('/basket-selection')
  }

  const filteredOrderDetails: OrderDetails[] = orderDetails.filter(detail => detail.order_id == orderId)

  const totalQuantity = filteredOrderDetails.reduce((acc, detail) => acc + detail.quantity, 0)

  return (
    <View style={styles.container}>
      <DefaultHeader
        title="Selección múltiple"
        leftIcon={<BackSvg width={30} height={30} color="black" />}
        leftAction={() => router.push('/basket-selection')}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.bodyContainer}>
          <View style={styles.orderInfo}>
            <View>
              <Text style={styles.orderLabel}>Número de pedido</Text>
              <Text style={styles.orderNumber}>{tenantOrderId || orderId}</Text>
            </View>
            <View>
              <Text style={styles.orderLabel}>Cantidad</Text>
              <Text style={styles.orderNumber}>{totalQuantity}</Text>
            </View>
          </View>
          <View style={styles.basketsContainer}>
            {baskets.map(basketId => (
              <View key={basketId} style={styles.basketTag}>
                <View style={styles.basketTop}>
                  <Text style={styles.basketText}>Cajón</Text>
                  <TouchableOpacity onPress={() => handleRemoveBasket(basketId)}>
                    <CrossSvg width={18} height={18} color={Colors.black} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.basketCode}>{basketId}</Text>
              </View>
            ))}
          </View>
          <View style={styles.scanBoxTitle}>
            <BarcodeScannerSvg width={38} height={38} color={Colors.black} />
            <Text style={styles.scanText} onPress={() => handleAddBasket('1235')}>
              Escaneá los canastos
            </Text>
          </View>
          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={e => {
              handleAddBasket(e.nativeEvent.text)
            }}
            blurOnSubmit={false}
          />
          <View style={styles.orderDetailsBox}>
            <TouchableOpacity onPress={() => handleAddBasket('1235')}>
              <Text style={styles.orderDetailsTitle}>Detalle del pedido</Text>
            </TouchableOpacity>
            {filteredOrderDetails.map(detail => (
              <ProductCard key={detail.id} product={detail} />
            ))}
          </View>
        </View>
      </ScrollView>
      {baskets.length > 0 && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>GUARDAR</Text>
        </TouchableOpacity>
      )}
      <DefaultModal
        visible={modalVisible}
        icon={<WarningSvg width={40} height={41} color={Colors.red} />}
        iconBackgroundColor={Colors.lightRed}
        title={modalTitle}
        description={modalDescription}
        primaryButtonText="VOLVER"
        primaryButtonColor={Colors.mainBlue}
        primaryButtonAction={() => {
          setModalVisible(false)
          // Asegurar que el input mantenga el foco después de cerrar el modal
          inputRef.current?.focus()
        }}
      />
    </View>
  )
}

export default BasketAssignmentScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey1
  },
  scrollContainer: {
    paddingBottom: 100
  },
  bodyContainer: {
    paddingTop: 30,
    paddingBottom: 20,
    flex: 1
  },
  scanBox: {
    padding: 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 16,
    height: 250,
    width: '100%'
  },
  scanBoxTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 24,
    marginBottom: 16
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    gap: 24
    // marginBottom: 16
  },
  orderLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.black,
    marginBottom: 8
  },
  orderNumber: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.black,
    marginBottom: 16
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.black
  },
  screenTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.black,
    marginBottom: 16,
    paddingHorizontal: 16
  },
  scanText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.grey5
  },
  hiddenInput: {
    height: 0,
    width: 0,
    opacity: 0
  },
  basketsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16
  },
  basketTag: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#DDEBF9',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    margin: 4
  },
  basketTop: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8
  },
  basketText: {
    fontSize: 16,
    marginRight: 20,
    color: Colors.black
  },
  basketCode: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold'
  },
  orderDetailsBox: {
    backgroundColor: Colors.grey2,
    borderRadius: 25,
    // marginHorizontal: 16,
    marginBottom: 16
  },
  orderDetailsTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.black,
    marginBottom: 16,
    textAlign: 'center',
    paddingTop: 20
  },
  orderDetailsQuantity: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.black,
    marginBottom: 16,
    textAlign: 'center'
  },
  saveButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.mainBlue,
    paddingVertical: 20,
    alignItems: 'center'
  },
  saveButtonText: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: 'white'
  }
})
