import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Order, PickingStateEnum } from '../../../types/order'
import { WarningSvg } from '../../svg/Warning'
import Colors from '../../../constants/Colors'
import { styles } from './styles'

interface MultiSelectOrderItemProps {
  item: Order
  selectedTab: 'pending' | 'completed'
  isSelected: boolean
  onSelect: () => void
}

const MultiSelectOrderItem: React.FC<MultiSelectOrderItemProps> = ({ item, selectedTab, isSelected, onSelect }) => {
  const isIncomplete = item.state_picking_id === PickingStateEnum.INCOMPLETE
  const totalQuantity = item.OrderDetails?.reduce((acc, detail) => acc + (detail.quantity || 0), 0) || 0

  const truncateText = (text: string, maxLength: number = 20) => {
    if (!text) return '-'
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <TouchableOpacity style={[styles.orderItem, isIncomplete && styles.orderItemIncomplete, isSelected && styles.selectedOrderItem]} onPress={onSelect}>
      <View style={styles.orderContainer}>
        <View style={styles.orderBox}>
          <View>
            <Text style={styles.orderLabel}>Nro pedido</Text>
            <Text style={styles.orderNumber}>{item.order_tenant_id}</Text>
          </View>
        </View>
        <View style={styles.orderBox}>
          <View>
            <Text style={styles.orderLabel}>{selectedTab === 'pending' ? 'Cantidad' : 'Posición'}</Text>
            <Text style={styles.positionText} numberOfLines={1}>
              {selectedTab === 'pending' ? totalQuantity : truncateText(item.positions || '-', 25)}
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

export default MultiSelectOrderItem
