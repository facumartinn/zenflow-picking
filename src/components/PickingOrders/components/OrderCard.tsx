import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Colors from '../../../constants/Colors'
import { WarningTriangleSvg } from '../../svg/WarningTriangle'
import { CheckSignSvg } from '../../svg/CheckSign'

interface OrderCardProps {
  tenantOrderId: number
  pickedQuantity: number
  totalQuantity: number
  state: 'INCOMPLETE' | 'IN_PROGRESS' | 'COMPLETED'
  onPress: () => void
}

export const OrderCard: React.FC<OrderCardProps> = ({ tenantOrderId, pickedQuantity, totalQuantity, state, onPress }) => {
  const getStateStyles = () => {
    switch (state) {
      case 'INCOMPLETE':
        return {
          borderColor: Colors.mainOrange,
          textColor: Colors.lightOrange2,
          label: 'Incompleto',
          icon: <WarningTriangleSvg width={20} height={20} color={Colors.mainOrange} />
        }
      case 'IN_PROGRESS':
        return { borderColor: 'transparent', textColor: Colors.grey5, label: null }
      case 'COMPLETED':
        return {
          borderColor: Colors.green,
          textColor: Colors.green,
          label: 'Listo para empaquetar',
          icon: <CheckSignSvg width={20} height={20} color={Colors.green} />
        }
      default:
        return { borderColor: 'transparent', textColor: Colors.grey5, label: 'En proceso' }
    }
  }

  const { borderColor, textColor, label, icon } = getStateStyles()

  return (
    <TouchableOpacity style={[styles.card, { borderColor }]} onPress={onPress}>
      <View style={styles.infoContainer}>
        <View style={styles.detailRow}>
          <View style={styles.detailRowText}>
            <Text style={styles.detailTitle}>Número de pedido</Text>
          </View>
          <Text style={styles.detailText}>{tenantOrderId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Cantidad</Text>
          <Text style={styles.detailText}>
            {pickedQuantity}/{totalQuantity}
          </Text>
        </View>
      </View>
      {label && (
        <View style={styles.stateContainer}>
          {icon}
          <Text style={[styles.stateLabel, { color: textColor }]}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
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
    gap: 10,
    width: '100%'
  },
  detailRow: {
    width: '49%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: Colors.grey1,
    padding: 10,
    borderRadius: 10
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
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.grey5
  },
  stateLabel: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    display: 'flex',
    alignItems: 'center',
    gap: 6
  },
  stateContainer: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  }
})
