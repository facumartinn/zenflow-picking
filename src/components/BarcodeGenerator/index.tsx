// components/BarcodeGenerator.js
import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import * as Print from 'expo-print'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import Barcode from '@kichiyaki/react-native-barcode-generator'
import { captureRef } from 'react-native-view-shot'

type BarcodeData = {
  value: string
  label: string
}

type BarcodePdfProps = {
  barcodes: BarcodeData[]
}

// Array de códigos de barras y etiquetas
// const barcodesArr = [
//   { value: '123456789', label: 'Producto A' },
//   { value: '987654321', label: 'Producto B' }
// ]

const generateBarcodeImage = async (barcodeValue: string) => {
  const response = await fetch(`https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(barcodeValue)}&includetext&scale=3&height=10`)
  const blob = await response.blob()
  const reader = new FileReader()

  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      resolve(reader.result)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

const BarcodePdf = forwardRef(({ barcodes }: BarcodePdfProps, ref) => {
  const [, setBarcodeImages] = useState<{ base64Image: string; label: string }[]>([])
  const barcodeRefs = useRef<(View | null)[]>([])

  // Exponer la función generatePdf al componente padre
  useImperativeHandle(ref, () => ({
    generatePdf: async () => {
      try {
        const barcodeImages: { base64Image: string; label: string }[] = []

        for (const barcode of barcodes) {
          const base64Image = await generateBarcodeImage(barcode.value)
          barcodeImages.push({ base64Image: base64Image as string, label: barcode.label })
        }
        console.log(barcodeImages.length)

        // Generamos las imágenes de los códigos de barras capturando la vista
        for (let i = 0; i < barcodes.length; i++) {
          const barcodeRef = barcodeRefs.current[i]
          //   console.log(barcodeRef)
          if (barcodeRef) {
            const uri = await captureRef(barcodeRef, {
              format: 'png',
              quality: 1
            })
            // console.log(uri)
            // Leemos el archivo y lo convertimos a base64
            const fileContent = await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64
            })
            // console.log(fileContent)
            const base64Image = `data:image/png;base64,${fileContent}`
            setBarcodeImages(prevImages => [...prevImages, { base64Image, label: barcodes[i].label }])
          } else {
            console.warn(`barcodeRef for index ${i} is null`)
          }
        }
        console.log(barcodeImages.length)

        // Crear el contenido HTML para el PDF con las imágenes de códigos de barras
        const htmlContent = `
          <html>
          <body>
          ${barcodeImages
            .map(
              ({ base64Image, label }) =>
                `<div style="margin-bottom: 10px; margin-top: 20px; text-align: center;">
                  <img src="${base64Image}" alt="Barcode" style="width: 150px; height: auto;" />
                  <div>${label}</div>
                </div>`
            )
            .join('')}
          </body>
          </html>
        `

        // Generar el archivo PDF usando expo-print
        const { uri: pdfUri } = await Print.printToFileAsync({ html: htmlContent })
        console.log('PDF guardado en:', pdfUri)

        // Mover el archivo generado a la ruta deseada
        const pdfDirectory = `${FileSystem.documentDirectory}myBarcodes`
        const filePath = `${pdfDirectory}/multiple_barcodes.pdf`

        const directoryInfo = await FileSystem.getInfoAsync(pdfDirectory)
        if (!directoryInfo.exists) {
          await FileSystem.makeDirectoryAsync(pdfDirectory, { intermediates: true })
        }

        await FileSystem.moveAsync({
          from: pdfUri,
          to: filePath
        })

        // Compartir el archivo PDF
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(filePath)
        } else {
          Alert.alert('PDF generado', `PDF guardado en: ${filePath}`)
        }
        return filePath
      } catch (error) {
        console.error('Error al crear el PDF:', error)
        Alert.alert('Error', 'No se pudo crear el PDF. Por favor, intenta nuevamente.')
      }
    }
  }))

  return (
    <View style={styles.container}>
      {/* Renderizamos los códigos de barras en una vista invisible */}
      <View style={styles.hiddenBarcodes}>
        {barcodes.map((barcode: BarcodeData, index: number) => (
          <View
            key={index}
            ref={(el: View | null) => (barcodeRefs.current[index] = el)}
            collapsable={false} // Necesario para que captureRef funcione en Android
            style={styles.barcodeContainer}
          >
            <Barcode
              value={barcode.value}
              format="CODE128"
              width={2} // Ajusta el ancho de las barras
              height={100} // Ajusta la altura del código de barras
              background="white"
              lineColor="black"
            />
          </View>
        ))}
      </View>
    </View>
  )
})
BarcodePdf.displayName = 'BarcodePdf'
const styles = StyleSheet.create({
  container: {
    // Sin estilos específicos
  },
  hiddenBarcodes: {
    position: 'absolute',
    opacity: 0, // Hacer la vista invisible pero renderizarla
    width: 200, // Asegura que las barras tengan un ancho definido
    height: 220 // Altura suficiente para varios códigos de barras
    // Opcional: Puedes añadir overflow: 'hidden' si es necesario
  },
  barcodeContainer: {
    marginBottom: 10 // Espacio entre códigos de barras
  }
})

export default BarcodePdf
