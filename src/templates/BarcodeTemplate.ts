import { PdfTemplate } from '../hooks/usePdfGenerator'

type BarcodeData = {
  value: string
  label: string
}

type BarcodePdfData = {
  barcodes: BarcodeData[]
}

const generateBarcodeImage = async (barcodeValue: string) => {
  const response = await fetch(
    `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(barcodeValue)}` +
      '&scale=2' +
      '&height=15' +
      '&includetext' +
      '&textsize=10' +
      '&textyoffset=3'
  )
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

export const BarcodeTemplate: PdfTemplate<BarcodePdfData> = {
  generateHtml: async data => {
    const barcodeImages: { base64Image: string; label: string }[] = []

    for (const barcode of data.barcodes) {
      const base64Image = await generateBarcodeImage(barcode.value)
      barcodeImages.push({
        base64Image: base64Image as string,
        label: barcode.label
      })
    }

    return `
      <html>
      <head>
        <style>
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            min-height: 100vh;
            display: flex;
            justify-content: center;
          }
          .labels-container {
            display: flex;
            flex-direction: column;
            gap: 2mm;
            width: 100mm;
            margin: 0 auto;
          }
          .label-container {
            width: 100%;
            height: 30mm;
            padding: 2mm;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-bottom: 1px dashed #ccc;
          }
          .barcode-image {
            width: 85mm;
            height: auto;
            max-height: 20mm;
          }
          .label-text {
            font-size: 8pt;
            margin-top: 1mm;
            text-align: center;
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          @media print {
            body {
              min-height: initial;
            }
            .label-container {
              break-inside: avoid;
              border-bottom: none;
            }
            .label-container::after {
              content: '';
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              border-bottom: 1px dashed #000;
              width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="labels-container">
          ${barcodeImages
            .map(
              ({ base64Image, label }) => `
            <div class="label-container">
              <img src="${base64Image}" class="barcode-image" alt="Código de barras: ${label}"/>
              <div class="label-text">${label}</div>
            </div>
          `
            )
            .join('')}
        </div>
      </body>
      </html>
    `
  }
}
