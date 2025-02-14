import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { styles } from './styles'
import { Order, PickingStateEnum } from '../../../types/order'
import { router } from 'expo-router'
import { WarningSvg } from '../../svg/Warning'
import Colors from '../../../constants/Colors'

interface OrderItemProps {
  item: Order
  selectedTab: 'pending' | 'completed'
}

const OrderItem: React.FC<OrderItemProps> = ({ item, selectedTab }) => {
  const isIncomplete = item.state_picking_id === PickingStateEnum.INCOMPLETE

  const truncateText = (text: string, maxLength: number = 20) => {
    if (!text) return '-'
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <TouchableOpacity
      style={[styles.orderItem, isIncomplete && styles.orderItemIncomplete]}
      onPress={() =>
        router.navigate({
          pathname: selectedTab === 'pending' ? '/order-detail' : '/completed-order-detail',
          params: {
            orderId: item.id,
            stateId: item.state_id || undefined
          }
        })
      }
    >
      <View style={styles.orderContainer}>
        <View style={styles.orderBox}>
          <View>
            <Text style={styles.orderLabel}>Nro pedido</Text>
            <Text style={styles.orderNumber}>000{item.id}</Text>
          </View>
        </View>
        <View style={styles.orderBox}>
          <View>
            <Text style={styles.orderLabel}>{selectedTab === 'pending' ? 'Cantidad' : 'Posición'}</Text>
            <Text style={styles.positionText} numberOfLines={1}>
              {selectedTab === 'pending' ? item.total_products : truncateText(item.positions || '-', 25)}
            </Text>
          </View>
        </View>
      </View>
      {isIncomplete && (
        <View style={styles.warningContainer}>
          <WarningSvg width={20} height={20} color={Colors.orange} />
          <Text style={styles.warningText}>Incompleto</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

export default OrderItem
