export interface BarcodeStructure {
  totalLength: number
  productCodeStart: number
  productCodeEnd: number
  weightStart: number
  weightEnd: number
  productDecimals?: number
  weightDecimals: number
  priceDecimals: number
  isWeightBased: boolean
}

export const validateWeightBarcode = (barcode: string, structure: BarcodeStructure) => {
  // Validación básica de longitud
  if (!barcode || typeof barcode !== 'string') {
    throw new Error('El código de barras debe ser una cadena válida')
  }

  if (barcode.length !== structure.totalLength) {
    throw new Error(`Longitud del código de barras inválida. Se esperaban ${structure.totalLength} dígitos pero se recibieron ${barcode.length}`)
  }

  // Extraer el código del producto usando los índices de la configuración
  const productCode = barcode.substring(structure.productCodeStart - 1, structure.productCodeEnd)
  const numericProductCode = parseInt(productCode)

  if (isNaN(numericProductCode)) {
    throw new Error(`Código de producto inválido: ${productCode}. Debe ser un número válido`)
  }

  // Extraer el peso/precio usando los índices de la configuración
  const rawWeightOrPrice = barcode.substring(structure.weightStart - 1, structure.weightEnd)
  const numericWeightOrPrice = parseInt(rawWeightOrPrice)

  if (isNaN(numericWeightOrPrice)) {
    throw new Error('Peso o precio inválido en el código de barras')
  }

  // Aplicar decimales según configuración
  let weightOrPrice: number
  if (structure.isWeightBased) {
    weightOrPrice = numericWeightOrPrice / Math.pow(10, structure.weightDecimals)
  } else {
    weightOrPrice = numericWeightOrPrice / Math.pow(10, structure.priceDecimals)
  }

  return {
    productCode: numericProductCode,
    weightOrPrice,
    rawProductCode: productCode,
    rawWeightOrPrice
  }
}
