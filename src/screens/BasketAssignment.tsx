// screens/BasketAssignmentScreen.tsx

import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { DefaultHeader } from '../components/DefaultHeader'
import { AntDesign } from '@expo/vector-icons'
import Ionicons from '@expo/vector-icons/Ionicons'
import Colors from '../constants/Colors'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useAtom } from 'jotai'
import ProductCard from '../components/ProductCard'
import { OrderDetails } from '../types/order'
import { basketsByOrderAtom, flowOrderDetailsAtom } from '../store'
import { BarcodeScannerSvg } from '../components/svg/BarcodeScanner'

type LocalSearchParams = {
  orderId: number
}

const BasketAssignmentScreen = () => {
  const { orderId }: Partial<LocalSearchParams> = useLocalSearchParams()
  const [orderDetails] = useAtom(flowOrderDetailsAtom)
  const [basketsByOrder, setBasketsByOrder] = useAtom(basketsByOrderAtom)
  const [baskets, setBaskets] = useState<number[]>([])
  const inputRef = useRef<TextInput>(null)
  const router = useRouter()

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
    if (!baskets.includes(basketId)) {
      const updatedBaskets = [...baskets, basketId]
      setBaskets(updatedBaskets)
      setBasketsByOrder(prev => ({ ...prev, [orderId!]: updatedBaskets }))
    }
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

  return (
    <View style={styles.container}>
      <DefaultHeader
        title={<Text style={styles.headerTitle}>Selección múltiple</Text>}
        leftIcon={
          <View style={{ borderRadius: 100, backgroundColor: 'white', marginLeft: 10 }}>
            <AntDesign name="arrowleft" size={24} color="black" style={{ padding: 8 }} />
          </View>
        }
        leftAction={() => router.navigate('/basket-selection')}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.bodyContainer}>
          <Text style={styles.screenTitle}>Cajones estimados: {Math.ceil(filteredOrderDetails.reduce((acc, detail) => acc + detail.quantity, 0) / 20)}</Text>
          {baskets.length === 0 ? (
            <View style={styles.scanBox}>
              <BarcodeScannerSvg width={38} height={38} color={Colors.black} />
              <Text style={styles.scanText} onPress={() => handleAddBasket('1234')}>
                Escaneá los canastos
              </Text>
            </View>
          ) : (
            <View style={styles.basketsContainer}>
              {baskets.map(basketId => (
                <View key={basketId} style={styles.basketTag}>
                  <View style={styles.basketTop}>
                    <Ionicons name="basket-outline" size={20} color={Colors.black} />
                    <Text style={styles.basketText}>Cajón</Text>
                    <TouchableOpacity onPress={() => handleRemoveBasket(basketId)}>
                      <AntDesign name="close" size={16} color={Colors.black} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.basketCode}>{basketId}</Text>
                </View>
              ))}
            </View>
          )}
          <TextInput ref={inputRef} style={styles.hiddenInput} onSubmitEditing={e => handleAddBasket(e.nativeEvent.text)} blurOnSubmit={false} />
          <View style={styles.orderDetailsBox}>
            <Text style={styles.orderDetailsTitle}>Detalle del pedido</Text>
            <Text style={styles.orderDetailsQuantity}>Cantidad {filteredOrderDetails.reduce((acc, detail) => acc + detail.quantity, 0)}</Text>
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
    </View>
  )
}

export default BasketAssignmentScreen

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: Colors.grey1
  },
  scrollContainer: {
    paddingBottom: 80
  },
  bodyContainer: {
    paddingTop: 30,
    flex: 1
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
  scanBox: {
    margin: 25,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16
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
    alignItems: 'center',
    backgroundColor: Colors.lightOrange,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    margin: 4
  },
  basketTop: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  basketText: {
    fontSize: 16,
    marginLeft: 8,
    marginRight: 20,
    color: Colors.black
  },
  basketCode: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold'
  },
  orderDetailsBox: {
    backgroundColor: Colors.grey2,
    borderRadius: 25
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
