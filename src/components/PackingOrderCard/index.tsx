import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { BoxDetailSvg } from '../svg/BoxDetail'
import { BasketSvg } from '../svg/Basket'
import Colors from '../../constants/Colors'
import { PrintStatusEnum } from '../../types/flow'

interface PackingOrderCardProps {
  orderId: number
  printStatus: PrintStatusEnum
  basketCount: string
  quantity: number
  onPress: () => void
}

export const PackingOrderCard: React.FC<PackingOrderCardProps> = ({ orderId, basketCount, quantity, onPress, printStatus }) => {
  const isReady = printStatus === PrintStatusEnum.PRINTED

  return (
    <TouchableOpacity style={[styles.card, isReady && styles.cardReady]} onPress={onPress}>
      <View style={styles.infoContainer}>
        <View style={styles.detailRow}>
          <View style={styles.detailRowText}>
            <BoxDetailSvg width={20} height={20} color={Colors.black} />
            <Text style={styles.detailTitle}>Pedido</Text>
          </View>
          <Text style={styles.detailText}>000{orderId}</Text>
        </View>
        {basketCount && (
          <View style={styles.detailRow}>
            <View style={styles.detailRowText}>
              <BasketSvg width={20} height={20} color={Colors.black} />
              <Text style={styles.detailTitle}>Canasto</Text>
            </View>
            <Text style={styles.detailText}>{basketCount}</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Cant.</Text>
          <Text style={styles.detailText}>{quantity}</Text>
        </View>
      </View>
      <Text style={[styles.stateLabel, isReady && styles.stateLabelReady]}>{isReady ? 'LISTO' : 'PENDIENTE DE PACKING'}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: Colors.orange,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginVertical: 8
  },
  cardReady: {
    borderColor: Colors.green
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 50,
    alignItems: 'center',
    marginBottom: 12
  },
  detailRow: {
    alignItems: 'center'
  },
  detailRowText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  detailTitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.grey5,
    marginLeft: 4
  },
  detailText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  },
  stateLabel: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: Colors.orange,
    textAlign: 'center'
  },
  stateLabelReady: {
    color: Colors.green
  }
})
