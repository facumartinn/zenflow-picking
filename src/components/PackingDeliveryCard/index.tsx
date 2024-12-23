import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { BoxDetailSvg } from '../../components/svg/BoxDetail'
import Colors from '../../constants/Colors'
import { packingOrdersAtom } from '../../store/flowAtoms'
import { useAtom } from 'jotai'

interface PackingDeliveryCardProps {
  orderId: number
  onPress: () => void
}

export const PackingDeliveryCard: React.FC<PackingDeliveryCardProps> = ({ orderId, onPress }) => {
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
    <TouchableOpacity style={[styles.card, { borderColor: isDelivered ? Colors.green : Colors.orange }]} onPress={onPress}>
      <View style={styles.headerRow}>
        <View style={styles.headerItem}>
          <View style={styles.headerLabelContainer}>
            <BoxDetailSvg width={20} height={20} color={Colors.black} />
            <Text style={styles.headerLabel}>Pedido</Text>
          </View>
          <Text style={styles.headerValue}>{orderId}</Text>
        </View>
        {!isDelivered ? (
          <View style={styles.headerItem}>
            <Text style={styles.headerLabel}>Cant.</Text>
            <Text style={styles.headerValue}>{orderResources.length}</Text>
          </View>
        ) : (
          <View style={styles.headerItem}>
            <Text style={styles.headerLabel}>Posición</Text>
            <Text style={styles.headerValue}>{positions}</Text>
          </View>
        )}
      </View>
      {!isDelivered && <View style={styles.divider} />}

      {!isDelivered ? (
        <View style={styles.detailsContainer}>
          {Object.entries(
            orderResources.reduce(
              (acc, resource) => {
                acc[resource.resource_name] = (acc[resource.resource_name] || 0) + 1
                return acc
              },
              {} as Record<string, number>
            )
          ).map(([resourceName, count], index) => (
            <View style={styles.detailRow} key={index}>
              <Text style={styles.detailLabel}>{resourceName}</Text>
              <Text style={styles.detailValue}>{count}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Texto de estado dinámico */}
      <Text style={[styles.statusLabel, { color: isDelivered ? Colors.green : Colors.orange }]}>{isDelivered ? 'ENTREGADO' : 'PENDIENTE DE ENTREGA'}</Text>
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
    gap: 32,
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
  divider: {
    borderWidth: 0.7,
    borderColor: Colors.orange,
    marginVertical: 4,
    marginHorizontal: 20,
    backgroundColor: Colors.orange
  },
  detailsContainer: {
    gap: 8,
    marginTop: 12,
    marginHorizontal: 20
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center'
  }
})

export default PackingDeliveryCard
