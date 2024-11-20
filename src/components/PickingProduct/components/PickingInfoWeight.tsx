import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Colors from '../../../constants/Colors'
import { OrderDetails } from '../../../types/order'
import { RestartSvg } from '../../svg/Restart'

interface PickingInfoWeightProps {
  item: OrderDetails
  onRestartQuantity: (productId: number, orderId: number) => void // Nueva prop para manejar el reinicio
}

const PickingInfoWeight = ({ item, onRestartQuantity }: PickingInfoWeightProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.positionText}>
          Posición <Text style={styles.boldText}>000{item.warehouse_order}</Text>
        </Text>
        <TouchableOpacity style={styles.restartButton} onPress={() => onRestartQuantity(item.id, item.order_id)}>
          <RestartSvg width={30} height={30} color={Colors.grey3} />
        </TouchableOpacity>
      </View>
      <View style={styles.weightContainer}>
        <View style={styles.weightBox}>
          <Text style={styles.weightTitle}>Peso</Text>
          <Text style={styles.weightValue}>{item.quantity * item.sales_unit! * 1000} gr</Text>
        </View>
        <View style={item.final_weight! > 0 ? { ...styles.realWeightBoxWithWeight } : { ...styles.realWeightBox }}>
          <Text style={item.final_weight! > 0 ? { ...styles.realWeightTitleWithWeight } : { ...styles.realWeightTitle }}>Peso real</Text>
          <Text style={item.final_weight! > 0 ? { ...styles.realWeightValueWithWeight } : { ...styles.realWeightValue }}>
            {item.final_weight ? `${item.final_weight} gr` : '-- gr'}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.mainBlue,
    borderRadius: 20,
    backgroundColor: Colors.white
  },
  positionText: {
    fontSize: 20,
    marginBottom: 15
  },
  boldText: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  weightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  weightBox: {
    flex: 1,
    backgroundColor: Colors.mainBlue,
    paddingVertical: 15,
    borderRadius: 20,
    marginRight: 5,
    alignItems: 'center'
  },
  realWeightBox: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.grey4,
    paddingVertical: 15,
    borderRadius: 20,
    marginLeft: 5,
    alignItems: 'center'
  },
  realWeightBoxWithWeight: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.mainBlue,
    paddingVertical: 15,
    borderRadius: 20,
    marginLeft: 5,
    alignItems: 'center'
  },
  weightTitle: {
    color: Colors.white,
    fontSize: 14
  },
  realWeightTitle: {
    color: Colors.grey4,
    fontSize: 14
  },
  realWeightTitleWithWeight: {
    color: Colors.mainBlue,
    fontSize: 14
  },
  weightValue: {
    fontSize: 24,
    color: Colors.white,
    fontWeight: 'bold'
  },
  realWeightValue: {
    fontSize: 24,
    color: Colors.grey4,
    fontWeight: 'bold'
  },
  realWeightValueWithWeight: {
    fontSize: 24,
    color: Colors.mainBlue,
    fontWeight: 'bold'
  },
  restartButton: {
    // marginLeft: 10
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

export default PickingInfoWeight
