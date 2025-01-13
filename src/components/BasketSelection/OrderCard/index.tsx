// components/OrderCard.tsx

import React from 'react'
import { View, Text } from 'react-native'
import { GroupedOrder } from '../../../helpers/groupOrders'
import { styles } from './styles'
import Colors from '../../../constants/Colors'
import { WarningTriangleSvg } from '../../svg/WarningTriangle'
import { CheckSignSvg } from '../../svg/CheckSign'

interface OrderCardProps {
  order: GroupedOrder
  isOrderReady: boolean
}

const OrderCard: React.FC<OrderCardProps> = ({ order, isOrderReady }) => {
  return (
    <View style={[styles.orderItem, isOrderReady && styles.readyOrder, !isOrderReady && styles.incompleteOrder]}>
      <View style={styles.orderContainer}>
        <View style={styles.orderBox}>
          <View>
            <Text style={styles.orderLabel}>Nro pedido</Text>
            <Text style={styles.orderNumber}>000{order.order_id}</Text>
          </View>
        </View>
        <View style={styles.orderBox}>
          <View>
            <Text style={styles.orderLabel}>Cantidad</Text>
            <Text style={styles.orderNumber}>{order.total_quantity}</Text>
          </View>
        </View>
      </View>
      <View style={styles.statusContainer}>
        {!isOrderReady ? <WarningTriangleSvg width={16} height={16} color={Colors.orange} /> : <CheckSignSvg width={16} height={16} color={Colors.green} />}
        <Text style={[styles.statusText, isOrderReady ? styles.readyStatusText : styles.pendingStatusText]}>{isOrderReady ? 'Asignado' : 'Sin asignar'}</Text>
      </View>
    </View>
  )
}

export default OrderCard
