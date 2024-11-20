// components/OrderCard.tsx
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Colors from '../../../constants/Colors'
import { BoxDetailSvg } from '../../svg/BoxDetail'
import { BasketSvg } from '../../svg/Basket'

interface OrderCardProps {
  orderId: number
  basketCount: string
  pickedQuantity: number
  totalQuantity: number
  state: 'INCOMPLETE' | 'IN_PROGRESS' | 'COMPLETED'
  onPress: () => void
}

export const OrderCard: React.FC<OrderCardProps> = ({ orderId, basketCount, pickedQuantity, totalQuantity, state, onPress }) => {
  const getStateStyles = () => {
    switch (state) {
      case 'INCOMPLETE':
        return { borderColor: Colors.red, textColor: Colors.red, label: 'INCOMPLETO' }
      case 'IN_PROGRESS':
        return { borderColor: Colors.grey5, textColor: Colors.grey5, label: 'EN PROCESO' }
      case 'COMPLETED':
        return { borderColor: Colors.green, textColor: Colors.green, label: 'LISTO' }
      default:
        return { borderColor: Colors.grey5, textColor: Colors.grey5, label: 'EN PROCESO' }
    }
  }

  const { borderColor, textColor, label } = getStateStyles()

  return (
    <TouchableOpacity style={[styles.card, { borderColor }]} onPress={onPress}>
      <View style={styles.infoContainer}>
        <View style={styles.detailRow}>
          <View style={styles.detailRowText}>
            <BoxDetailSvg width={20} height={20} color={Colors.black} />
            <Text style={styles.detailTitle}>Pedido</Text>
          </View>
          <Text style={styles.detailText}>000{orderId}</Text>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.detailRowText}>
            <BasketSvg width={20} height={20} color={Colors.black} />
            <Text style={styles.detailTitle}>Cajón</Text>
          </View>

          <Text style={styles.detailText}>{basketCount}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Cant.</Text>
          <Text style={styles.detailText}>
            {pickedQuantity}/{totalQuantity}
          </Text>
        </View>
      </View>
      <Text style={[styles.stateLabel, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20
  },
  detailRow: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6
  },
  detailRowText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  detailText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  },
  detailTitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.grey5
  },
  stateLabel: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    marginTop: 10
  }
})
