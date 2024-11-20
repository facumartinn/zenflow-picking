export interface BarcodeStructure {
  totalLength: number
  productCodeStart: number
  productCodeEnd: number
  weightStart: number
  weightEnd: number
  productDecimals?: number // Si aplica
  weightDecimals?: number
  priceDecimals?: number
  isWeightBased?: boolean // Define si se basa en peso o en precio
}

export const validateWeightBarcode = (barcode: string, structure: BarcodeStructure) => {
  if (barcode.length !== structure.totalLength) {
    throw new Error(`Código de barras inválido: se esperaba una longitud de ${structure.totalLength} dígitos.`)
  }

  // Extracción del código del producto
  const productCode = barcode.substring(structure.productCodeStart, structure.productCodeEnd)

  // Extracción del peso o precio bruto
  const rawWeightOrPrice = barcode.substring(structure.weightStart, structure.weightEnd)
  // Decodificación del peso o precio considerando decimales
  let weightOrPrice: number
  if (structure.isWeightBased) {
    weightOrPrice = parseFloat(rawWeightOrPrice) / Math.pow(10, structure.weightDecimals || 0)
  } else {
    weightOrPrice = parseFloat(rawWeightOrPrice) / Math.pow(10, structure.priceDecimals || 0)
  }

  return {
    productCode,
    weightOrPrice
  }
}
