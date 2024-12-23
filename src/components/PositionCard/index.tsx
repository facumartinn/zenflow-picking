import React from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import Colors from '../../constants/Colors'
import { styles } from './styles'
import { PrinterSvg } from '../svg/Printer'
import { usePdfGenerator, usePdfViewer } from '../../hooks/usePdfGenerator'
import { BarcodeTemplate } from '../../templates/BarcodeTemplate'
import * as FileSystem from 'expo-file-system'

interface PositionCardProps {
  position: string
  details: Array<{ type: string; quantity: number }>
  barcodes?: Array<{ barcode: string; resource_name: string }>
}

const PositionCard = ({ position, details, barcodes = [] }: PositionCardProps) => {
  const { generatePdf } = usePdfGenerator()
  const { showPdf } = usePdfViewer()

  const handlePrintBarcodes = async () => {
    try {
      if (barcodes.length === 0) return

      const barcodesData = barcodes.map(item => ({
        value: item.barcode,
        label: item.resource_name
      }))

      const filePath = await generatePdf({ barcodes: barcodesData }, BarcodeTemplate, {
        fileName: `barcodes_position_${position}.pdf`,
        directory: `${FileSystem.documentDirectory}barcodes`
      })

      await showPdf(filePath)
    } catch (error) {
      console.error('Error al generar PDF de códigos de barras:', error)
    }
  }

  return (
    <View style={styles.positionContainer}>
      <View style={styles.leftContainer}>
        <View style={styles.positionLabelContainer}>
          <Text style={styles.positionLabel}>Posición</Text>
          <Text style={styles.position}>{position}</Text>
        </View>
        <View style={styles.detailBox}>
          {details.map((detail, index) => (
            <View key={index} style={styles.detailContainer}>
              <Text style={styles.detailType}>{detail.type}</Text>
              <Text style={styles.detailQuantity}>{detail.quantity}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity
          style={[styles.iconContainer, barcodes.length === 0 && styles.iconContainerDisabled]}
          onPress={handlePrintBarcodes}
          disabled={barcodes.length === 0}
        >
          <PrinterSvg width={30} height={30} color={barcodes.length === 0 ? Colors.grey3 : Colors.grey5} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

interface PositionsListProps {
  positions: Array<{
    id: number
    position: string
    details: Array<{ type: string; quantity: number }>
    barcodes?: Array<{ barcode: string; resource_name: string }>
  }>
  isLoading?: boolean
}

const PositionsList = ({ positions, isLoading = false }: PositionsListProps) => (
  <View style={styles.container}>
    <Text style={styles.sectionTitle}>Entrega</Text>
    {isLoading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.mainBlue} />
      </View>
    ) : positions.length > 0 ? (
      positions.map((position, index) => (
        <View key={position.id}>
          <PositionCard position={position.position} details={position.details} barcodes={position.barcodes} />
          {index < positions.length - 1 && <View style={styles.separator} />}
        </View>
      ))
    ) : (
      <Text style={styles.noResourcesText}>No hay recursos asignados</Text>
    )}
  </View>
)

export default PositionsList
