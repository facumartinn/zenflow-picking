// components/OrderCard.tsx

import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import { GroupedOrder } from '../../../helpers/groupOrders'
import Colors from '../../../constants/Colors'

interface OrderCardProps {
  order: GroupedOrder
  isOrderReady: boolean
}

const OrderCard: React.FC<OrderCardProps> = ({ order, isOrderReady }) => {
  return (
    <View style={[styles.card, isOrderReady && styles.readyOrder]}>
      <View style={styles.orderContainer}>
        <View style={styles.orderBox}>
          <View style={styles.orderBoxTitle}>
            <SimpleLineIcons name="social-dropbox" size={20} color="black" />
            <Text style={styles.orderText}>Pedido</Text>
          </View>
          <Text style={styles.orderNumber}>000{order.order_id}</Text>
        </View>
        <View style={styles.orderBox}>
          <Text style={styles.orderText}>Cantidad</Text>
          <Text style={styles.orderNumber}>{order.total_quantity}</Text>
        </View>
      </View>
      <View style={[styles.line, isOrderReady ? styles.lineCompleted : styles.linePending]}></View>
      <Text style={[styles.statusText, isOrderReady ? styles.readyStatusText : styles.pendingStatusText]}>{isOrderReady ? 'LISTO' : 'PENDIENTE'}</Text>
    </View>
  )
}

export default OrderCard

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: Colors.orange,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'white'
  },
  readyOrder: {
    borderColor: Colors.green
  },
  line: {
    display: 'flex',
    justifyContent: 'center',
    borderBottomWidth: 1,
    marginHorizontal: 40,
    marginTop: 10
  },
  linePending: {
    borderBottomColor: Colors.orange
  },
  lineCompleted: {
    borderBottomColor: Colors.green
  },
  orderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30
  },
  orderBox: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  orderBoxTitle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  orderText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'Inter_400Regular'
  },
  orderNumber: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  },
  statusText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center'
  },
  readyStatusText: {
    color: Colors.green
  },
  pendingStatusText: {
    color: Colors.orange
  }
})
