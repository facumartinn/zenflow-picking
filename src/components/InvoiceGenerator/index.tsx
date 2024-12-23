import { useImperativeHandle, forwardRef } from 'react'
import * as Print from 'expo-print'
import * as FileSystem from 'expo-file-system'
import { Order } from '../../types/order'
import { generateInvoiceHTML } from '../../utils/generateInvoice'

type InvoiceGeneratorProps = {
  order: Order
}

const InvoiceGenerator = forwardRef(({ order }: InvoiceGeneratorProps, ref) => {
  useImperativeHandle(ref, () => ({
    generateInvoice: async () => {
      try {
        const htmlContent = generateInvoiceHTML(order)

        // Generar el PDF
        const { uri: pdfUri } = await Print.printToFileAsync({
          html: htmlContent,
          base64: false
          //   pageOrientation: 'portrait',
          //   pageSize: 'A4'
        })

        // Mover el archivo a la ubicación final
        const pdfDirectory = `${FileSystem.documentDirectory}invoices`
        const filePath = `${pdfDirectory}/invoice_${order.id}.pdf`

        const directoryInfo = await FileSystem.getInfoAsync(pdfDirectory)
        if (!directoryInfo.exists) {
          await FileSystem.makeDirectoryAsync(pdfDirectory, { intermediates: true })
        }

        await FileSystem.moveAsync({
          from: pdfUri,
          to: filePath
        })

        return filePath
      } catch (error) {
        console.error('Error al crear el PDF del recibo/factura:', error)
        throw error
      }
    }
  }))

  // El componente no necesita renderizar nada visible
  return null
})

InvoiceGenerator.displayName = 'InvoiceGenerator'

export default InvoiceGenerator
