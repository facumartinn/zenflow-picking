import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Colors from '../../constants/Colors'
import { PrintStatusEnum } from '../../types/flow'
import { CheckSignSvg } from '../svg/CheckSign'
import { WarningTriangleSvg } from '../svg/WarningTriangle'

interface PackingOrderCardProps {
  tenantOrderId: number
  printStatus: PrintStatusEnum
  quantity: number
  onPress: () => void
}

export const PackingOrderCard: React.FC<PackingOrderCardProps> = ({ tenantOrderId, quantity, onPress, printStatus }) => {
  const isReady = printStatus === PrintStatusEnum.PRINTED

  return (
    <TouchableOpacity style={[styles.card, isReady && styles.cardReady]} onPress={onPress}>
      <View style={styles.infoContainer}>
        <View style={styles.detailRow}>
          <View style={styles.detailRowText}>
            <Text style={styles.detailTitle}>Número de pedido</Text>
          </View>
          <Text style={styles.detailText}>{tenantOrderId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Cantidad</Text>
          <Text style={styles.detailText}>{quantity}</Text>
        </View>
      </View>
      <View style={styles.stateContainer}>
        {isReady ? <CheckSignSvg width={20} height={20} color={Colors.green} /> : <WarningTriangleSvg width={20} height={20} color={Colors.orange} />}
        <Text style={[styles.stateLabel, isReady && styles.stateLabelReady]}>{isReady ? 'Empaquetado' : 'Sin empaquetar'}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderColor: Colors.mainOrange,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginVertical: 8
  },
  cardReady: {
    borderColor: Colors.green
  },
  infoContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 15
  },
  detailRow: {
    backgroundColor: Colors.grey1,
    padding: 10,
    borderRadius: 10,
    alignItems: 'flex-start',
    width: '49%'
  },
  detailRowText: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 4
  },
  detailTitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.grey5
  },
  detailText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  },
  stateLabel: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: Colors.lightOrange2,
    textAlign: 'center'
  },
  stateLabelReady: {
    color: Colors.green
  },
  stateContainer: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  }
})
