import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Colors from '../../../constants/Colors'
import { packingOrdersAtom } from '../../../store/flowAtoms'
import { useAtom } from 'jotai'
import { TrashSvg } from '../../svg/Trash'

interface PositionProps {
  position: string
  barcode: string[]
  status?: number
}

interface SavedPositionCardProps {
  position: PositionProps
  orderId: number
  onDelete: () => void
}

const SavedPositionCard: React.FC<SavedPositionCardProps> = ({ position, orderId, onDelete }) => {
  const [packingOrderDetail] = useAtom(packingOrdersAtom)

  // Obtener todos los recursos asignados a esta posición
  const assignedResources = useMemo(() => {
    const orderData = packingOrderDetail[orderId]
    if (!orderData || !orderData.resources) return []
    return orderData.resources.filter(resource => resource.position === position.position)
  }, [packingOrderDetail, orderId, position.position])

  // Agrupar por resource_name y contar cuántos hay de cada uno
  const groupedResources = useMemo(() => {
    const map = new Map<string, number>()
    assignedResources.forEach(res => {
      map.set(res.resource_name, (map.get(res.resource_name) ?? 0) + 1)
    })
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }))
  }, [assignedResources])

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.positionContainer}>
          <View style={styles.positionNumberContainer}>
            <Text style={styles.label}>Posición</Text>
            <Text style={styles.position}>{position.position}</Text>
          </View>
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <TrashSvg width={32} height={32} color={Colors.red} />
          </TouchableOpacity>
        </View>

        {groupedResources.length > 0 && (
          <View style={styles.resourceList}>
            {groupedResources.map((item, index) => (
              <View key={index} style={styles.resourceItem}>
                <Text style={styles.resourceName}>{item.name}</Text>
                <Text style={styles.resourceCount}>{item.count}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.grey4,
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    backgroundColor: Colors.white
  },
  content: {
    gap: 14
  },
  positionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  positionNumberContainer: {
    backgroundColor: Colors.grey1,
    paddingLeft: 12,
    paddingVertical: 12,
    paddingRight: '60%',
    borderRadius: 16
  },
  label: {
    fontSize: 14,
    color: Colors.grey5,
    fontFamily: 'Inter_400Regular'
    // marginBottom: 4
  },
  position: {
    fontSize: 24,
    color: Colors.black,
    fontFamily: 'Inter_700Bold'
  },
  deleteButton: {
    padding: 12
  },
  resourceList: {
    paddingHorizontal: 10,
    gap: 12
  },
  resourceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
    // paddingBottom: 8
  },
  resourceName: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: Colors.black
  },
  resourceCount: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  }
})

export default SavedPositionCard
