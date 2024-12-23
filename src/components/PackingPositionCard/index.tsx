import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SimpleLineIcons } from '@expo/vector-icons'
import Colors from '../../constants/Colors'
import { BarcodeScannerSvg } from '../svg/BarcodeScanner'

interface PositionScannerProps {
  scannedPosition: {
    position: string
    barcode: string[]
    status: number
  }
  savedPositions: { position: string; barcode: string[] }[]
  orderId: number
  resources: { resource_id: number; resource_name: string; barcode: number; position?: string }[]
  onDelete: () => void
  onSave?: () => void
  onPositionScanned: (barcode: string) => void
}

const PositionScanner: React.FC<PositionScannerProps> = ({ scannedPosition, resources, onDelete, onSave, onPositionScanned }) => {
  // Barcodes asignados a esta posición
  const positionBarcodes = scannedPosition?.barcode

  // Filtrar los recursos que coincidan con los barcodes asignados
  const assignedResources = useMemo(() => {
    return resources.filter(r => positionBarcodes.includes(r.barcode.toString()))
  }, [positionBarcodes, resources])

  // Agrupar por resource_name y contar cuántos hay de cada uno
  const groupedResources = useMemo(() => {
    const map = new Map<string, number>()
    assignedResources.forEach(res => {
      map.set(res.resource_name, (map.get(res.resource_name) ?? 0) + 1)
    })
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }))
  }, [assignedResources])

  const totalResources = groupedResources.length

  const handleMockScanResource = (barcode: number) => {
    onPositionScanned(barcode.toString())
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.positionContainer}>
          <View style={styles.positionNumberContainer}>
            <Text style={styles.label}>Posición</Text>
            <Text style={styles.position}>{scannedPosition?.position}</Text>
          </View>
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <SimpleLineIcons name="trash" size={24} color={Colors.red} />
          </TouchableOpacity>
        </View>

        {/* Botón para simular escaneo de un recurso */}
        {scannedPosition?.status === 0 && (
          <TouchableOpacity style={styles.scanButton} onPress={() => handleMockScanResource(1734706902692)}>
            <BarcodeScannerSvg width={28} height={28} color={Colors.black} />
            <Text style={styles.scanText}>{totalResources === 0 ? 'Escaneá el packing' : 'Escaneá más recursos'}</Text>
          </TouchableOpacity>
        )}

        {/* Lista de recursos agrupados por nombre y su cantidad */}
        {groupedResources?.length > 0 && (
          <View style={styles.resourceList}>
            {groupedResources?.map((item, index) => (
              <View key={index} style={styles.resourceItem}>
                <Text style={styles.resourceName}>{item.name}</Text>
                <Text style={styles.resourceCount}>{item.count}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Mostrar el botón GUARDAR sólo si hay al menos un recurso asignado */}
        {groupedResources?.length > 0 && onSave && (
          <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Text style={styles.saveButtonText}>GUARDAR</Text>
          </TouchableOpacity>
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
    gap: 24
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
    fontFamily: 'Inter_400Regular',
    marginBottom: 4
  },
  position: {
    fontSize: 24,
    color: Colors.black,
    fontFamily: 'Inter_700Bold'
  },
  deleteButton: {
    padding: 12
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  },
  scanText: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: 'Inter_400Regular'
  },
  resourceList: {
    padding: 10,
    gap: 12
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8
  },
  resourceName: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: Colors.black
  },
  resourceCount: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: Colors.black
  },
  saveButton: {
    alignSelf: 'center',
    width: '50%',
    backgroundColor: Colors.mainBlue,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 30
  },
  saveButtonText: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Inter_700Bold'
  }
})

export default PositionScanner
