interface BarcodeStructure {
  totalLength: number
  productCodeStart: number
  productCodeLength: number
  weightStart: number
  weightLength: number
  weightFormat: 'grams' | 'kilograms' | 'other' // Puedes expandir esto según sea necesario
}

const validateWeightBarcode = (barcode: string, structure: BarcodeStructure) => {
  if (barcode.length !== structure.totalLength) {
    throw new Error(`Código de barras inválido: se esperaba una longitud de ${structure.totalLength} dígitos.`)
  }

  const productCode = barcode.substring(structure.productCodeStart, structure.productCodeStart + structure.productCodeLength)

  const weightRaw = barcode.substring(structure.weightStart, structure.weightStart + structure.weightLength)

  let weight: number
  switch (structure.weightFormat) {
    case 'grams':
      weight = parseInt(weightRaw, 10)
      break
    case 'kilograms':
      weight = parseInt(weightRaw, 10) / 1000 // Asumiendo 3 decimales
      break
    default:
      weight = parseFloat(weightRaw) // Otra lógica personalizada si es necesario
  }

  return {
    productCode,
    weight
  }
}

// Ejemplo de uso:

const barcodeA = '1234561234567' // Cliente A: 13 dígitos
const structureA: BarcodeStructure = {
  totalLength: 13,
  productCodeStart: 0,
  productCodeLength: 5,
  weightStart: 7,
  weightLength: 6,
  weightFormat: 'grams'
}

try {
  const resultA = validateWeightBarcode(barcodeA, structureA)
  console.log(`Código del producto: ${resultA.productCode}, Peso: ${resultA.weight}g`)
} catch (error: any) {
  console.error(error?.message)
}

const barcodeB = '012345678901' // Cliente B: 12 dígitos
const structureB: BarcodeStructure = {
  totalLength: 12,
  productCodeStart: 1,
  productCodeLength: 5,
  weightStart: 6,
  weightLength: 6,
  weightFormat: 'kilograms'
}

try {
  const resultB = validateWeightBarcode(barcodeB, structureB)
  console.log(`Código del producto: ${resultB.productCode}, Peso: ${resultB.weight}kg`)
} catch (error: any) {
  console.error(error.message)
}
