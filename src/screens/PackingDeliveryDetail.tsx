import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import Colors from '../constants/Colors'
import { ProgressBar } from 'react-native-paper'
import { DefaultHeader } from '../components/DefaultHeader'
import { LinearGradient } from 'expo-linear-gradient'
import { BarcodeScannerSvg } from '../components/svg/BarcodeScanner'
import SavedPositionCard from '../components/PackingPositionCard/SavedPositionCard'
import PositionScanner from '../components/PackingPositionCard'
import { usePackingDeliveryDetail } from '../hooks/usePackingDeliveryDetail'
import BottomButton from '../components/BottomButton'
import { DefaultInputModal } from '../components/DefaultInputModal'
import { BackSvg } from '../components/svg/BackSvg'
import { basketsByOrderAtom, packingOrdersAtom } from '../store'
import { useAtom } from 'jotai'
import { CheckSvg } from '../components/svg/Check'

type LocalSearchParams = {
  orderId: number
  tenantOrderId: number
}

const PackingDeliveryDetail = () => {
  const router = useRouter()
  const { orderId, tenantOrderId }: Partial<LocalSearchParams> = useLocalSearchParams()
  const parsedOrderId = orderId!
  const [baskets] = useAtom(basketsByOrderAtom)
  const [packingOrders] = useAtom(packingOrdersAtom)
  const [modalVisible, setModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<TextInput>(null)
  const [activeScanner, setActiveScanner] = useState<'position' | 'resource' | null>('position')
  const [isScanning, setIsScanning] = useState(false)

  const {
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

  // Mantener el foco en el input oculto
  useEffect(() => {
    // Usar un pequeño retraso para asegurar que el componente esté completamente montado
    const focusTimer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 300)

    return () => clearTimeout(focusTimer)
  }, [])

  // Mantener el foco cuando cambia el escáner activo
  useEffect(() => {
    const focusTimer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 300)

    return () => clearTimeout(focusTimer)
  }, [activeScanner])

  // Asegurar que el input mantenga el foco periódicamente
  useEffect(() => {
    const focusInterval = setInterval(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 1000)

    return () => clearInterval(focusInterval)
  }, [])

  useEffect(() => {
    if (!packingOrders || Object.keys(packingOrders).length === 0) {
      router.push('/home')
    }
    setIsLoading(false)
  }, [packingOrders, router])

  // Manejar el escaneo según el escáner activo
  const handleScan = (barcode: string) => {
    // Validar que el código de barras no esté vacío y tenga un formato válido
    if (!barcode || barcode.trim() === '') {
      return
    }

    // Indicar que estamos escaneando para deshabilitar el botón de retroceso
    setIsScanning(true)

    if (activeScanner === 'position') {
      handleAddPosition(barcode)
      setActiveScanner('resource')
    } else if (activeScanner === 'resource' && currentPosition) {
      handleAddResourceToPosition(currentPosition.position, barcode)
    }

    // Resetear el input después de escanear
    setInputValue('')

    // Mantener el foco en el input y restablecer el estado de escaneo después de un tiempo
    setTimeout(() => {
      inputRef.current?.focus()
      setIsScanning(false)
    }, 300)
  }

  const handleConfirm = async () => {
    handleCompleteOrder()
    router.push('/packing-delivery')
  }

  // Función segura para volver atrás
  const handleGoBack = () => {
    if (!isScanning) {
      router.back()
    }
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <DefaultHeader title="Entrega" leftIcon={<BackSvg width={30} height={30} color="black" />} leftAction={() => router.push('/home')} />
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ fontSize: 16, color: Colors.grey4 }}>Cargando...</Text>
        </View>
      </View>
    )
  }

  if (!packingOrders || Object.keys(packingOrders).length === 0) {
    return null
  }

  const basketByComma = baskets[parsedOrderId]?.join(',')

  return (
    <LinearGradient colors={[Colors.white, '#D8D8E959']} style={styles.container} start={{ x: 0.2, y: 0 }} end={{ x: 0.2, y: 1 }} locations={[0.2, 0.25]}>
      <DefaultHeader title="Entrega" leftIcon={<BackSvg width={30} height={30} color={isScanning ? Colors.grey3 : 'black'} />} leftAction={handleGoBack} />
      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.orderInfoContainer}>
          <View style={styles.orderGeneralInfoContainer}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderLabel}>Número de pedido</Text>
              <Text style={styles.orderId}>{tenantOrderId}</Text>
            </View>
            <View style={styles.orderInfo}>
              <Text style={styles.orderLabel}>Cajones</Text>
              <Text style={styles.orderId}>{basketByComma}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.orderResourcesLabel}>Empaques en posición</Text>
            <ProgressBar
              progress={resourcesLength > 0 ? Math.min(1, Math.round((resourcesScanned / resourcesLength) * 100) / 100) : 0}
              color={resourcesScanned / resourcesLength === 1 ? Colors.green : Colors.mainBlue}
              indeterminate={false}
              style={styles.progressBar}
            />
            {!allResourcesScanned ? (
              <View style={styles.quantityTotals}>
                <Text style={allResourcesScanned ? { color: Colors.green } : undefined}>{resourcesScanned}</Text>
                <Text>{resourcesLength}</Text>
              </View>
            ) : (
              <View style={styles.completedContainer}>
                <CheckSvg width={24} height={24} color={Colors.green} />
                <Text style={{ color: Colors.green, marginLeft: 5, fontSize: 12, fontFamily: 'Inter_700Bold' }}>Pedido en posición</Text>
              </View>
            )}
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
              setActiveScanner={setActiveScanner}
              setIsScanning={setIsScanning}
            />
          )}

          {/* Mostrar botones para agregar nueva posición si no se completó todo */}
          {!allResourcesScanned && !currentPosition && (
            <>
              <TouchableOpacity
                style={styles.scannerSection}
                onPress={() => {
                  handleAddPosition('A24')
                  setActiveScanner('resource')
                }}
              >
                <BarcodeScannerSvg width={30} height={30} color={Colors.black} />
                <Text style={styles.scannerTitle}>Escanear posición de entrega</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.manualEntryText}>INGRESAR POSICIÓN</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Input oculto para escaneo de códigos de barras */}
        <TextInput
          ref={inputRef}
          style={styles.hiddenInput}
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={e => handleScan(e.nativeEvent.text)}
          blurOnSubmit={false}
          autoCapitalize="none"
          keyboardType="default"
          returnKeyType="done"
        />

        <DefaultInputModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false)
            // Asegurar que el input mantenga el foco después de cerrar el modal
            inputRef.current?.focus()
          }}
          onConfirm={e => {
            handleAddPosition(e)
            setModalVisible(false)
            setActiveScanner('resource')
            // Asegurar que el input mantenga el foco después de cerrar el modal
            inputRef.current?.focus()
          }}
        />
      </ScrollView>

      {/* Botón final "ENTREGAR PEDIDO" */}
      {allResourcesScanned && <BottomButton text="CONTINUAR" onPress={handleConfirm} />}
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
    backgroundColor: Colors.white,
    paddingBottom: 14,
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'column'
  },
  orderResourcesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    width: '48%',
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
    // paddingHorizontal: 10,
    marginVertical: 10,
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
    fontFamily: 'Inter_700Bold'
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
  },
  orderResourcesLabel: {
    fontSize: 14,
    marginBottom: 10,
    color: Colors.grey4,
    fontFamily: 'Inter_400Regular'
  },
  orderGeneralInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 15
  },
  progressBar: {
    width: '100%',
    height: 20,
    borderRadius: 10,
    marginBottom: 10
  },
  quantityTotals: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  completedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  hiddenInput: {
    height: 0,
    width: 0,
    opacity: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: -1
  }
})

export default PackingDeliveryDetail
