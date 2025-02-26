/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import Colors from '../constants/Colors'
import { useAtom } from 'jotai'
import { packingOrdersAtom } from '../store'
import { DefaultHeader } from '../components/DefaultHeader'
import BottomButton from '../components/BottomButton'

const PackingOrderCompletedScreen = () => {
  const router = useRouter()

  const { orderId } = useLocalSearchParams<{ orderId: string }>()
  const [packingOrderDetail] = useAtom(packingOrdersAtom)

  const totalItems = packingOrderDetail[parseInt(orderId as string)]?.resources?.length || 0

  const handleContinue = () => {
    router.push('/packing-orders')
  }

  const handlePrintAgain = () => {
    router.back()
  }

  return (
    <LinearGradient colors={[Colors.lightGreen2, Colors.white]} style={styles.container} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} locations={[0.2, 0.2]}>
      <DefaultHeader title="Empaquetado" backgroundColor="transparent" />

      <ScrollView style={styles.content}>
        <View style={styles.summaryWrapper}>
          <View style={styles.summaryContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Etiquetas impresas</Text>
              <Text style={styles.totalQuantity}>{totalItems}</Text>
            </View>
          </View>
          <Text style={styles.summaryText}>Pegá cada etiqueta a los empaques correspondientes</Text>
        </View>
      </ScrollView>
      <View style={styles.printAgainButtonContainer}>
        <TouchableOpacity style={styles.printAgainButton} onPress={handlePrintAgain}>
          <Text style={styles.printAgainButtonText}>VOLVER A IMPRIMIR</Text>
        </TouchableOpacity>
      </View>

      <BottomButton text="YA ETIQUETE EL PEDIDO" onPress={handleContinue} />
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    // paddingTop: 20,
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    flex: 1,
    padding: 16
  },
  backButton: {
    marginRight: 16
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold'
  },
  orderInfo: {
    width: '40%',
    padding: 10,
    borderRadius: 20,
    backgroundColor: Colors.lightGreen,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24
  },
  orderLabel: {
    fontSize: 16,
    marginRight: 8,
    fontFamily: 'Inter_400Regular'
  },
  orderId: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold'
  },
  summaryWrapper: {
    alignItems: 'center',
    width: '100%'
  },
  summaryContainer: {
    width: '60%',
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 10,
    marginVertical: 24,
    borderWidth: 1,
    borderColor: Colors.green
  },
  summaryTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 16
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  itemName: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular'
  },
  itemQuantity: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: Colors.green
  },
  totalRow: {
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalLabel: {
    width: '60%',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: Colors.green
  },
  totalQuantity: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: Colors.green
  },
  printButton: {
    backgroundColor: Colors.mainBlue,
    padding: 16,
    alignItems: 'center',
    borderRadius: 8
  },
  printButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Inter_700Bold'
  },
  continueButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  continueButton: {
    backgroundColor: Colors.mainBlue,
    paddingHorizontal: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 36,
    borderRadius: 30
  },
  continueButtonText: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: 'Inter_700Bold'
  },
  printAgainButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 80
  },
  printAgainButton: {
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 36
  },
  printAgainButtonText: {
    color: Colors.mainBlue,
    fontSize: 18,
    fontFamily: 'Inter_700Bold'
  },
  summaryText: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: Colors.black2,
    textAlign: 'center',
    marginTop: 10
  }
})

export default PackingOrderCompletedScreen
