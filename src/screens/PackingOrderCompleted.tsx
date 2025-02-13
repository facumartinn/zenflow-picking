/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import Colors from '../constants/Colors'
import { useAtom } from 'jotai'
import { packingOrdersAtom } from '../store'
import { DefaultHeader } from '../components/DefaultHeader'
import { BackSvg } from '../components/svg/BackSvg'

const PackingOrderCompletedScreen = () => {
  const router = useRouter()

  const { orderId } = useLocalSearchParams<{ orderId: string }>()
  const [packingOrderDetail] = useAtom(packingOrdersAtom)

  const totalItems = packingOrderDetail[parseInt(orderId as string)]?.resources?.length || 0

  const handleContinue = () => {
    router.navigate('/packing-orders')
  }

  const handlePrintAgain = () => {
    router.back()
  }

  return (
    <LinearGradient
      colors={[Colors.lightGreen, Colors.background]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      locations={[0.35, 0.35]}
    >
      <DefaultHeader title="Empaquetado" leftIcon={<BackSvg width={30} height={30} color="black" />} leftAction={() => router.navigate('/packing-orders')} />

      <ScrollView style={styles.content}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderLabel}>Pedido</Text>
          <Text style={styles.orderId}>000{orderId}</Text>
        </View>
        <View style={styles.summaryWrapper}>
          <View style={styles.summaryContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Etiquetas impresas</Text>
              <Text style={styles.totalQuantity}>{totalItems}</Text>
            </View>
          </View>
        </View>
        <View style={styles.continueButtonContainer}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>CONTINUAR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.printAgainButtonContainer}>
        <TouchableOpacity style={styles.printAgainButton} onPress={handlePrintAgain}>
          <Text style={styles.printAgainButtonText}>Volver a imprimir</Text>
        </TouchableOpacity>
      </View>
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
    width: '70%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
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
    fontSize: 18,
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
    marginTop: 20
  },
  printAgainButton: {
    paddingHorizontal: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 36,
    borderRadius: 30
  },
  printAgainButtonText: {
    color: Colors.mainBlue,
    fontSize: 18,
    fontFamily: 'Inter_400Regular'
  }
})

export default PackingOrderCompletedScreen
