import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'
import Colors from '../constants/Colors'
import { DefaultHeader } from '../components/DefaultHeader'
import { LinearGradient } from 'expo-linear-gradient'
import { BarcodeScannerSvg } from '../components/svg/BarcodeScanner'
import { useAtom } from 'jotai'
import { basketsByOrderAtom, packingOrdersAtom, warehousesAtom } from '../store'
import { PackingOrder, PrintStatusEnum } from '../types/flow'

const PackingOrderDetailScreen = () => {
  const router = useRouter()
  const [warehouseConfig] = useAtom(warehousesAtom)
  const [basketsByOrder] = useAtom(basketsByOrderAtom)
  const [packingOrderDetail, setPackingOrderDetail] = useAtom(packingOrdersAtom)
  const resourceList: PackingOrder['resources'] = warehouseConfig.use_resources!.resources!.map(resource => ({
    resource_id: resource.id,
    resource_name: resource.name,
    barcodes: []
  }))
  const { orderId } = useLocalSearchParams<{ orderId: string }>()
  const [drawerNumber, setDrawerNumber] = useState(basketsByOrder[parseInt(orderId as string)])
  const [packagingItems, setPackagingItems] = useState<PackingOrder['resources']>(resourceList)

  const handleQuantityChange = (index: number, increment: boolean) => {
    setPackagingItems(items =>
      items.map((item, i) =>
        i === index
          ? {
              ...item,
              barcodes: increment
                ? [...item.barcodes, Date.now()] // Añadimos un número único como código de barras
                : item.barcodes.slice(0, -1) // Eliminamos el último código de barras
            }
          : item
      )
    )
  }
  console.log(packagingItems)

  const handleConfirm = () => {
    setPackingOrderDetail({
      ...packingOrderDetail,
      [orderId as string]: {
        print_status: PrintStatusEnum.NOT_PRINTED,
        resources: packagingItems
      }
    })
    router.push({ pathname: '/packing-order-overview', params: { orderId } })
  }
  console.log(packingOrderDetail, 'packingOrderDetail')

  return (
    <LinearGradient
      colors={[Colors.mainLightBlue2, Colors.grey1]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      locations={[0.35, 0.35]}
    >
      <DefaultHeader
        title="Empaquetado"
        leftIcon={
          <View style={{ borderRadius: 100, backgroundColor: Colors.yellow, marginLeft: 10 }}>
            <AntDesign name="arrowleft" size={24} color="black" style={{ padding: 8 }} />
          </View>
        }
        leftAction={() => router.navigate('/packing-orders')}
      />
      <ScrollView style={styles.content}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderLabel}>Pedido</Text>
          <Text style={styles.orderId}>000{orderId}</Text>
        </View>
        <View style={styles.scannerSection}>
          <BarcodeScannerSvg width={40} height={40} color={Colors.black} />
          <Text style={styles.scannerText}>Escaneá los cajones</Text>
        </View>
        <View style={styles.drawerSection}>
          <Text style={styles.drawerLabel}>Cajón</Text>
          <View style={styles.drawerInfo}>
            <Text style={styles.drawerNumber}>{drawerNumber}</Text>
            <TouchableOpacity onPress={() => setDrawerNumber([])}>
              <AntDesign name="delete" size={24} color={Colors.red} />
            </TouchableOpacity>
          </View>
        </View>
        {packagingItems.map((item, index) => (
          <View key={item.resource_name} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.resource_name}</Text>
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={[styles.quantityButton, item.barcodes.length === 0 && styles.quantityButtonDisabled]}
                onPress={() => handleQuantityChange(index, false)}
                disabled={item.barcodes.length === 0}
              >
                <AntDesign name="minus" size={20} color={item.barcodes.length > 0 ? Colors.mainBlue : Colors.grey3} />
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.barcodes.length}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={() => handleQuantityChange(index, true)}>
                <AntDesign name="plus" size={20} color={Colors.mainBlue} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.continueButtonContainer}>
        <TouchableOpacity style={styles.continueButton} onPress={() => handleConfirm()}>
          <Text style={styles.continueButtonText}>CONTINUAR</Text>
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
  backButton: {
    marginRight: 16
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  content: {
    flex: 1,
    padding: 16
  },
  orderInfo: {
    width: '35%',
    padding: 10,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
    backgroundColor: Colors.mainLightBlue2
  },
  orderLabel: {
    fontSize: 15,
    marginRight: 8
  },
  orderId: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  scannerSection: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24
  },
  scannerText: {
    marginLeft: 14,
    fontSize: 20,
    color: Colors.black
  },
  drawerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 24
  },
  drawerLabel: {
    fontSize: 20
  },
  drawerInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  drawerNumber: {
    fontSize: 26,
    fontWeight: 'bold',
    marginRight: 16
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  itemName: {
    fontSize: 20
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.mainLightBlue2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  quantityButtonDisabled: {
    backgroundColor: Colors.grey2
  },
  quantity: {
    fontSize: 26,
    fontWeight: 'bold',
    marginHorizontal: 16
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
    fontWeight: 'bold'
  }
})

export default PackingOrderDetailScreen
