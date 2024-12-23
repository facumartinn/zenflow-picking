import { useImperativeHandle, forwardRef } from 'react'
import { usePdfGenerator } from '../../hooks/usePdfGenerator'
import { BarcodeTemplate } from '../../templates/BarcodeTemplate'
import * as FileSystem from 'expo-file-system'

type BarcodeData = {
  value: string
  label: string
}

type BarcodePdfProps = {
  barcodes: BarcodeData[]
}

const BarcodePdf = forwardRef(({ barcodes }: BarcodePdfProps, ref) => {
  const { generatePdf } = usePdfGenerator()

  useImperativeHandle(ref, () => ({
    generatePdf: async () => {
      try {
        return await generatePdf({ barcodes }, BarcodeTemplate, {
          fileName: 'multiple_barcodes.pdf',
          directory: `${FileSystem.documentDirectory}myBarcodes`
        })
      } catch (error) {
        console.error('Error al crear el PDF:', error)
        throw error
      }
    }
  }))

  return null
})

BarcodePdf.displayName = 'BarcodePdf'

export default BarcodePdf
