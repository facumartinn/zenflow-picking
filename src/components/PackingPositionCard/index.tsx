import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import { BarcodeScannerSvg } from '../svg/BarcodeScanner'
import Colors from '../../constants/Colors'
import { TrashSvg } from '../svg/Trash'

interface PositionScannerProps {
  scannedPosition: { position: string; barcode: string[]; status: number }
  orderId: number
  resources: { resource_id: number; resource_name: string; barcode: string; position?: string }[]
  savedPositions: { position: string; barcode: string[] }[]
  onDelete: () => void
  onSave?: () => void
  onPositionScanned: (barcode: string) => void
  setActiveScanner?: (scanner: 'position' | 'resource' | null) => void
  setIsScanning?: (isScanning: boolean) => void
}

const PositionScanner: React.FC<PositionScannerProps> = ({
  scannedPosition,
  resources,
  onDelete,
  onSave,
  onPositionScanned,
  setActiveScanner,
  setIsScanning
}) => {
  const positionBarcodes = scannedPosition?.barcode || []
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<TextInput>(null)

  // Activar el escáner de recursos cuando se monta el componente
  useEffect(() => {
    if (setActiveScanner) {
      setActiveScanner('resource')
    }
    inputRef.current?.focus()
  }, [setActiveScanner])

  const assignedResources = useMemo(() => {
    return resources.filter(r => positionBarcodes.includes(r.barcode))
  }, [positionBarcodes, resources])

  const groupedResources = useMemo(() => {
    const map = new Map<string, number>()
    assignedResources.forEach(res => {
      map.set(res.resource_name, (map.get(res.resource_name) ?? 0) + 1)
    })
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }))
  }, [assignedResources])

  const handleScanResource = useCallback(
    (barcode: string) => {
      if (onPositionScanned && barcode && barcode.trim() !== '') {
        // Indicar que estamos escaneando
        if (setIsScanning) {
          setIsScanning(true)
        }

        onPositionScanned(barcode)

        // Resetear el input después de escanear
        setInputValue('')

        // Mantener el foco en el input y restablecer el estado de escaneo
        setTimeout(() => {
          inputRef.current?.focus()
          if (setIsScanning) {
            setIsScanning(false)
          }
        }, 300)
      }
    },
    [onPositionScanned, setIsScanning]
  )

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave()
      // Cambiar el escáner activo a posición después de guardar
      if (setActiveScanner) {
        setActiveScanner('position')
      }
    }
  }, [onSave, setActiveScanner])

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.positionContainer}>
          <View style={styles.positionNumberContainer}>
            <Text style={styles.label}>Posición</Text>
            <Text style={styles.position}>{scannedPosition.position}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              onDelete()
              // Cambiar el escáner activo a posición después de eliminar
              if (setActiveScanner) {
                setActiveScanner('position')
              }
            }}
            style={styles.deleteButton}
          >
            <TrashSvg width={32} height={32} color={Colors.red} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => {
            if (setIsScanning) {
              setIsScanning(true)
            }
            handleScanResource('1739902121984')
            setTimeout(() => {
              if (setIsScanning) {
                setIsScanning(false)
              }
            }, 300)
          }}
        >
          <BarcodeScannerSvg width={30} height={30} color={Colors.black} />
          <Text style={styles.scanText}>Escanear etiqueta</Text>
        </TouchableOpacity>

        {/* Input oculto para escaneo de recursos */}
        <TextInput
          ref={inputRef}
          style={styles.hiddenInput}
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={e => handleScanResource(e.nativeEvent.text)}
          blurOnSubmit={false}
          autoCapitalize="none"
          keyboardType="default"
          returnKeyType="done"
        />

        {groupedResources?.length > 0 && <View style={styles.divider}></View>}
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

        {groupedResources?.length > 0 && onSave && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
    borderRadius: 15,
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
    paddingLeft: 12,
    paddingVertical: 12,
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
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  },
  resourceCount: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: Colors.black
  },
  saveButton: {
    alignSelf: 'center',
    width: '100%',
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
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grey4
  },
  hiddenInput: {
    height: 0,
    width: 0,
    opacity: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: -1
  }
})

export default PositionScanner
