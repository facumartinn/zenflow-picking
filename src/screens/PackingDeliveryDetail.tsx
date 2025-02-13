import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import Colors from '../constants/Colors'
import { DefaultHeader } from '../components/DefaultHeader'
import { LinearGradient } from 'expo-linear-gradient'
import { BarcodeScannerSvg } from '../components/svg/BarcodeScanner'
import SavedPositionCard from '../components/PackingPositionCard/SavedPositionCard'
import PositionScanner from '../components/PackingPositionCard'
import { usePackingDeliveryDetail } from '../hooks/usePackingDeliveryDetail'
import BottomButton from '../components/BottomButton'
import { DefaultInputModal } from '../components/DefaultInputModal'
import { BackSvg } from '../components/svg/BackSvg'

const PackingDeliveryDetail = () => {
  const router = useRouter()
  const { orderId } = useLocalSearchParams<{ orderId: string }>()
  const parsedOrderId = parseInt(orderId!)
  const [modalVisible, setModalVisible] = useState(false)

  const {
    // currentOrder,
    currentPosition,
    currentPositionResources,
    savedPositions,
    resourcesLength,
    resourcesScanned,
    allResourcesScanned,
    handleAddPosition,
    handleAddResourceToPosition,
    handleSavePosition,
    handleDeletePosition,
    handleCompleteOrder
  } = usePackingDeliveryDetail({ orderId: parsedOrderId })

  const handleConfirm = async () => {
    handleCompleteOrder()
    router.push('/packing-delivery')
  }

  return (
    <LinearGradient
      colors={[Colors.mainLightBlue2, Colors.grey1]}
      style={styles.container}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.2, y: 1 }}
      locations={[0.25, 0.25]}
    >
      <DefaultHeader title="Entrega" leftIcon={<BackSvg width={30} height={30} color="black" />} leftAction={() => router.back()} />
      <ScrollView style={styles.content}>
        <View style={styles.orderInfoContainer}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderLabel}>Pedido</Text>
            <Text style={styles.orderId}>000{orderId}</Text>
          </View>
          <View style={styles.orderResourcesContainer}>
            <Text style={styles.orderResourcesScanned}>{resourcesScanned}</Text>
            <Text style={styles.orderResourcesTotal}>/{resourcesLength}</Text>
          </View>
        </View>

        <View style={styles.deliverySection}>
          {/* Mostrar posiciones ya guardadas */}
          {savedPositions.map((item, index) => (
            <SavedPositionCard key={`${item.position}-${index}`} position={item} orderId={parsedOrderId} onDelete={() => handleDeletePosition(item.position)} />
          ))}

          {/* Mostrar la posición actual (si existe y status=0), permitiendo escanear recursos y guardar */}
          {currentPosition && currentPosition.status === 0 && (
            <PositionScanner
              scannedPosition={currentPosition}
              orderId={parsedOrderId}
              resources={currentPositionResources}
              savedPositions={savedPositions}
              onDelete={() => handleDeletePosition(currentPosition.position)}
              onSave={() => handleSavePosition(currentPosition.position)}
              onPositionScanned={barcode => handleAddResourceToPosition(currentPosition.position, barcode)}
            />
          )}

          {/* Mostrar botones para agregar nueva posición si no se completó todo */}
          {!allResourcesScanned && !currentPosition && (
            <>
              <TouchableOpacity style={styles.scannerSection} onPress={() => handleAddPosition('A22')}>
                <BarcodeScannerSvg width={40} height={40} color={Colors.black} />
                <Text style={styles.scannerTitle}>Posición de entrega</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.manualEntryText}>Ingresar manualmente</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <DefaultInputModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={e => {
            handleAddPosition(e)
            setModalVisible(false)
          }}
        />
      </ScrollView>

      {/* Botón final "ENTREGAR PEDIDO" */}
      {allResourcesScanned && <BottomButton text="ENTREGAR PEDIDO" onPress={handleConfirm} />}

      {/* Modal de ingreso manual */}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  backButton: {
    borderRadius: 100,
    backgroundColor: Colors.mainLightBlue2,
    marginLeft: 10
  },
  content: {},
  orderInfoContainer: {
    width: '100%',
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  orderResourcesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    backgroundColor: Colors.mainBlue,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 28
  },
  orderResourcesScanned: {
    fontSize: 24,
    color: Colors.white,
    fontFamily: 'Inter_700Bold'
  },
  orderResourcesTotal: {
    fontSize: 18,
    color: Colors.white,
    fontFamily: 'Inter_400Regular'
  },
  orderInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 10,
    marginVertical: 30,
    alignSelf: 'flex-start'
  },
  orderLabel: {
    fontSize: 15,
    marginRight: 8,
    fontFamily: 'Inter_400Regular'
  },
  orderId: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold'
  },
  deliverySection: {
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 40
  },
  scannerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12
  },
  scannerTitle: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: 'Inter_400Regular'
  },
  manualEntryText: {
    fontSize: 16,
    color: Colors.mainBlue,
    fontFamily: 'Inter_700Bold',
    textDecorationLine: 'underline'
  },
  completeOrderButton: {
    alignSelf: 'center',
    width: '50%',
    backgroundColor: Colors.mainBlue,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 30,
    marginBottom: 36
  },
  completeOrderText: {
    fontSize: 18,
    color: Colors.white,
    fontFamily: 'Inter_700Bold'
  }
})

export default PackingDeliveryDetail
