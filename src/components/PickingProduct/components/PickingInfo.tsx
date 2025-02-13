import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { ProgressBar } from 'react-native-paper'
import { RestartSvg } from '../../svg/Restart'
import Colors from '../../../constants/Colors'
import { CheckSvg } from '../../svg/Check'

interface PickingInfoProps {
  productId: number
  orderId: number
  quantity: number
  quantityPicked: number
  warehouseOrder: number
  onRestartQuantity: (productId: number, orderId: number) => void // Nueva prop para manejar el reinicio
  isCompleted?: boolean
}

const PickingInfo: React.FC<PickingInfoProps> = ({ productId, orderId, quantity, quantityPicked, warehouseOrder, onRestartQuantity, isCompleted }) => {
  // Asegurar que el progreso sea un número entre 0 y 1 con máximo 2 decimales
  const progress = quantity > 0 ? Math.min(Math.round((quantityPicked / quantity) * 100) / 100, 1) : 0

  return (
    <View style={styles.quantityBox}>
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityLabel}>Cant.</Text>
        <Text style={styles.quantityValue}>{quantity}</Text>
      </View>
      <View style={styles.orderProgressContainer}>
        <View style={styles.orderInfoContainer}>
          <Text style={styles.positionInfo}>Posición</Text>
          <Text style={styles.positionValue}>{warehouseOrder}</Text>
        </View>
        <View>
          <ProgressBar progress={progress} color={isCompleted ? Colors.green : Colors.mainBlue} indeterminate={false} style={styles.progressBar} />
          {!isCompleted ? (
            <View style={styles.quantityTotals}>
              <Text style={isCompleted ? { color: Colors.green } : undefined}>{quantityPicked}</Text>
              <Text>{quantity}</Text>
            </View>
          ) : (
            <View style={styles.completedContainer}>
              <CheckSvg width={24} height={24} color={Colors.green} />
              <Text style={{ color: Colors.green, marginLeft: 5, fontSize: 12, fontFamily: 'Inter_700Bold' }}>Productos levantados</Text>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.restartButton} onPress={() => onRestartQuantity(productId, orderId)}>
        <RestartSvg width={30} height={30} color={Colors.black} />
      </TouchableOpacity>
    </View>
  )
}

export default PickingInfo

const styles = StyleSheet.create({
  quantityBox: {
    borderWidth: 1,
    borderColor: Colors.mainBlue,
    borderRadius: 20,
    padding: 20,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center'
  },
  quantityContainer: {
    flexDirection: 'column',
    backgroundColor: Colors.mainBlue,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center'
  },
  quantityLabel: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: 'Inter_400Regular'
  },
  quantityValue: {
    fontSize: 28,
    color: Colors.white,
    fontFamily: 'Inter_700Bold'
  },
  orderProgressContainer: {
    marginLeft: 15,
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  orderInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  positionInfo: {
    fontSize: 22,
    fontFamily: 'Inter_400Regular',
    color: Colors.black
  },
  positionValue: {
    marginLeft: 6,
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  },
  progressBar: {
    marginTop: 10,
    width: 200,
    height: 14,
    backgroundColor: Colors.mainLightBlue2,
    borderRadius: 20
  },
  restartButton: {
    marginLeft: 10
  },
  quantityTotals: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5
  }
})
