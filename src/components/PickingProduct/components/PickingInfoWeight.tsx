import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Colors from '../../../constants/Colors'
import { OrderDetails } from '../../../types/order'
import { RestartSvg } from '../../svg/Restart'

interface PickingInfoWeightProps {
  item: OrderDetails
  onRestartQuantity: (productId: number, orderId: number) => void
}

const ensureNumber = (value: number | undefined | null): number => {
  const num = Number(value)
  return isNaN(num) ? 0 : num
}

const formatWeight = (weightInGrams: number | undefined | null): { value: string; unit: string } => {
  const grams = ensureNumber(weightInGrams)

  // Si el peso es mayor o igual a 1kg (1000g), mostrar en kg
  if (grams >= 1000) {
    return {
      value: (grams / 1000).toFixed(3), // 3 decimales para kg
      unit: 'kg'
    }
  } else {
    return {
      value: grams.toFixed(0), // Sin decimales para gramos
      unit: 'gr'
    }
  }
}

const PickingInfoWeight = ({ item, onRestartQuantity }: PickingInfoWeightProps) => {
  // Todos los cálculos internos en gramos
  const weightPerUnit = ensureNumber(item.sales_unit) * 1000 // Convertir la unidad base (kg) a gramos
  const totalRequiredWeight = ensureNumber(item.quantity) * weightPerUnit
  const currentWeight = ensureNumber(item.final_weight)
  // Asegurar que el progreso sea un número entre 0 y 1 con máximo 2 decimales

  // Formatear los pesos para mostrar
  const formattedRequired = formatWeight(totalRequiredWeight)
  const formattedCurrent = formatWeight(currentWeight)

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.positionText}>
          Posición <Text style={styles.boldText}>{item.warehouse_order}</Text>
        </Text>
        <TouchableOpacity style={styles.restartButton} onPress={() => onRestartQuantity(item.id, item.order_id)}>
          <RestartSvg width={30} height={30} color={Colors.grey3} />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.weightContainer}>
          <View style={styles.weightBox}>
            <Text style={styles.weightTitle}>Peso</Text>
            <Text style={styles.weightValue}>
              {formattedRequired.value} {formattedRequired.unit}
            </Text>
          </View>
          <View style={[styles.weightRealBox, Number(formattedCurrent.value) > 0 && { backgroundColor: Colors.mainLightBlue3 }]}>
            <Text style={[styles.weightRealTitle, Number(formattedCurrent.value) > 0 && { color: Colors.black }]}>Peso real</Text>
            <Text style={[styles.weightRealValue, Number(formattedCurrent.value) > 0 ? { color: Colors.black } : { color: Colors.grey5 }]}>
              {Number(formattedCurrent.value) > 0 ? formattedCurrent.value : '--'} {formattedCurrent.unit || 'gr'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.mainBlue,
    borderRadius: 20,
    backgroundColor: Colors.white
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  positionText: {
    fontSize: 20,
    fontFamily: 'Inter_400Regular'
  },
  boldText: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold'
  },
  progressContainer: {
    width: '100%'
  },
  quantityInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  quantityLabel: {
    fontSize: 16,
    color: Colors.grey5,
    fontFamily: 'Inter_400Regular'
  },
  quantityValues: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  currentValue: {
    fontSize: 20,
    color: Colors.mainBlue,
    fontFamily: 'Inter_700Bold'
  },
  separator: {
    fontSize: 20,
    color: Colors.grey3,
    marginHorizontal: 5,
    fontFamily: 'Inter_400Regular'
  },
  totalValue: {
    fontSize: 20,
    color: Colors.grey3,
    fontFamily: 'Inter_700Bold'
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.mainLightBlue2,
    marginBottom: 15
  },
  weightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  weightBox: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.mainBlue,
    borderRadius: 10,
    marginHorizontal: 5
  },
  weightTitle: {
    fontSize: 14,
    color: Colors.white,
    marginBottom: 5,
    fontFamily: 'Inter_400Regular'
  },
  weightValue: {
    fontSize: 24,
    color: Colors.white,
    fontFamily: 'Inter_700Bold'
  },
  weightRealBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: Colors.grey1,
    borderRadius: 10,
    marginHorizontal: 5
  },
  weightRealTitle: {
    fontSize: 14,
    color: Colors.grey5,
    marginBottom: 5,
    fontFamily: 'Inter_400Regular'
  },
  weightRealValue: {
    fontSize: 24,
    color: Colors.grey5,
    fontFamily: 'Inter_700Bold'
  },
  restartButton: {
    padding: 5
  }
})

export default PickingInfoWeight
