import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Colors from '../../constants/Colors'
import { packingOrdersAtom } from '../../store/flowAtoms'
import { useAtom } from 'jotai'
import { WarningTriangleSvg } from '../svg/WarningTriangle'
import { CheckSignSvg } from '../svg/CheckSign'

interface PackingDeliveryCardProps {
  orderId: number
  onPress: () => void
  tenantOrderId: number
}

export const PackingDeliveryCard: React.FC<PackingDeliveryCardProps> = ({ orderId, onPress, tenantOrderId }) => {
  const [packingOrderDetail] = useAtom(packingOrdersAtom)
  // const [flowOrderDetails] = useAtom(flowOrderDetailsAtom)

  // Obtener los detalles del pedido
  // const order = flowOrderDetails.filter(order => order.id === orderId)

  // Obtener el estado de entrega del pedido
  const packingDeliveryStatus = packingOrderDetail[orderId]?.packing_delivery_status

  // Verificar si el pedido está entregado
  const isDelivered = packingDeliveryStatus === 1

  // Recursos del pedido
  const orderResources = packingOrderDetail[orderId]?.resources || []

  // Agrupar las posiciones de los recursos por nombre
  const positions = Array.from(new Set(orderResources.map(resource => resource.position))).join(', ')

  return (
    <TouchableOpacity style={[styles.card, { borderColor: isDelivered ? Colors.green : Colors.mainOrange }]} onPress={onPress}>
      <View style={styles.headerRow}>
        <View style={styles.infoContainer}>
          <View style={styles.detailRow}>
            <View style={styles.detailRowText}>
              <Text style={styles.detailTitle}>Número de pedido</Text>
            </View>
            <Text style={styles.detailText}>{tenantOrderId}</Text>
          </View>
          {!isDelivered ? (
            <View style={styles.detailRow}>
              <View style={styles.detailRowText}>
                <Text style={styles.detailTitle}>Cantidad</Text>
              </View>
              <Text style={styles.detailText}>{orderResources.length}</Text>
            </View>
          ) : (
            <View style={styles.detailRow}>
              <View style={styles.detailRowText}>
                <Text style={styles.detailTitle}>Posición</Text>
              </View>
              <Text style={styles.detailText}>{positions}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Texto de estado dinámico */}
      {isDelivered ? (
        <View style={styles.statusContainer}>
          <CheckSignSvg width={16} height={16} color={Colors.green} />
          <Text style={styles.statusLabel}>Entregado</Text>
        </View>
      ) : (
        <View style={styles.statusContainer}>
          <WarningTriangleSvg width={16} height={16} color={Colors.orange} />
          <Text style={styles.statusWarningLabel}>Sin entregar</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    marginVertical: 8
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  headerItem: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8
  },
  headerLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  headerLabel: {
    fontSize: 14,
    color: Colors.grey5,
    fontFamily: 'Inter_400Regular'
  },
  headerValue: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  detailRow: {
    width: '49%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 8,
    padding: 8,
    borderRadius: 10,
    backgroundColor: Colors.grey0
  },
  detailRowText: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // gap: 8
  },
  detailTitle: {
    fontSize: 14,
    color: Colors.grey5,
    fontFamily: 'Inter_400Regular'
  },
  detailText: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  },

  divider: {
    borderWidth: 0.7,
    borderColor: Colors.mainOrange,
    marginVertical: 4,
    marginHorizontal: 20,
    backgroundColor: Colors.mainOrange
  },
  detailsContainer: {
    gap: 8,
    marginTop: 12,
    marginHorizontal: 20
  },
  detailLabel: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'Inter_400Regular'
  },
  detailValue: {
    fontSize: 18,
    fontFamily: 'Inter_500Medium',
    color: Colors.black
  },
  statusLabel: {
    fontSize: 12,
    color: Colors.green,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center'
  },
  statusWarningLabel: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    color: Colors.orange
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 12
  }
})

export default PackingDeliveryCard
