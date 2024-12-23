import * as Print from 'expo-print'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { Alert } from 'react-native'

export type PdfTemplate<T = unknown> = {
  generateHtml: (data: T) => string | Promise<string>
}

export const usePdfGenerator = () => {
  const generatePdf = async <T>(
    data: T,
    template: PdfTemplate<T>,
    options?: {
      fileName?: string
      directory?: string
    }
  ) => {
    try {
      // Generar contenido HTML usando el template proporcionado
      const htmlContent = await template.generateHtml(data)

      // Generar PDF
      const { uri: pdfUri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false
      })

      // Configurar directorio y nombre de archivo
      const pdfDirectory = options?.directory || `${FileSystem.documentDirectory}pdfs`
      const fileName = options?.fileName || 'document.pdf'
      const filePath = `${pdfDirectory}/${fileName}`

      // Crear directorio si no existe
      const directoryInfo = await FileSystem.getInfoAsync(pdfDirectory)
      if (!directoryInfo.exists) {
        await FileSystem.makeDirectoryAsync(pdfDirectory, { intermediates: true })
      }

      // Mover archivo a ubicación final
      await FileSystem.moveAsync({
        from: pdfUri,
        to: filePath
      })

      return filePath
    } catch (error) {
      console.error('Error al generar PDF:', error)
      throw error
    }
  }

  return { generatePdf }
}

export const usePdfViewer = () => {
  const showPdf = async (filePath: string) => {
    try {
      const canShare = await Sharing.isAvailableAsync()

      if (canShare) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'application/pdf',
          dialogTitle: 'Guardar etiquetas',
          UTI: 'com.adobe.pdf'
        })
        return true
      } else {
        Alert.alert('Error', 'No se puede compartir en este dispositivo')
        return false
      }
    } catch (error) {
      console.error('Error al mostrar PDF:', error)
      Alert.alert('Error', 'Ocurrió un error al intentar mostrar el PDF')
      return false
    }
  }

  const deletePdf = async (filePath: string) => {
    try {
      await FileSystem.deleteAsync(filePath, { idempotent: true })
      return true
    } catch (error) {
      console.error('Error al eliminar PDF:', error)
      return false
    }
  }

  return { showPdf, deletePdf }
}
