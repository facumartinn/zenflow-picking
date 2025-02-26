import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
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

const PositionCardSkeleton = () => (
  <View style={styles.positionContainer}>
    <View style={styles.leftContainer}>
      <View style={styles.positionLabelContainer}>
        <View style={[styles.placeholder, { width: 80, height: 16, marginBottom: 4 }]} />
        {/* <View style={[styles.placeholder, { width: 120, height: 20 }]} /> */}
      </View>
      <View style={styles.detailBox}>
        <View style={styles.detailContainer}>
          <View style={[styles.placeholder, { width: 150, height: 16, marginBottom: 4 }]} />
        </View>
        <View style={styles.detailContainer}>
          <View style={[styles.placeholder, { width: 130, height: 16, marginBottom: 4 }]} />
        </View>
      </View>
    </View>
  </View>
)

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
      <>
        <PositionCardSkeleton />
        <View style={styles.separator} />
        <PositionCardSkeleton />
      </>
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
