import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { useRouter } from 'expo-router'
import { flowOrderDetailsAtom, warehousesAtom, currentProductIndexAtom, currentProductAtom } from '../store'
import { PickingDetailEnum } from '../types/order'
import { BarcodeStructure, validateWeightBarcode } from '../utils/validateWeightBarcode'
import { useToast } from '../context/toast'
import Colors from '../constants/Colors'

/**
 * Hook para manejar la lógica de picking
 * @returns {Object} Objeto con los métodos y estados necesarios para el picking
 */
export const usePickingLogicV2 = () => {
  // Átomos y estado global
  const [flowOrderDetails, setFlowOrderDetails] = useAtom(flowOrderDetailsAtom)
  const [warehouseConfig] = useAtom(warehousesAtom)
  const [currentProductIndex, setCurrentProductIndex] = useAtom(currentProductIndexAtom)
  const [currentProduct] = useAtom(currentProductAtom)

  // Estado local
  const [modalVisible, setModalVisible] = useState(false)
  const [incompleteModalVisible, setIncompleteModalVisible] = useState(false)
  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [isCompleted] = useState(false)

  // Utilidades
  const router = useRouter()
  const toast = useToast()

  /**
   * Tipo para las actualizaciones de producto
   */
  type ProductUpdate = {
    quantity_picked?: number
    state_picking_details_id?: PickingDetailEnum
    final_weight?: number
  }

  /**
   * Efecto para inicializar el estado del picking
   * Asegura que el primer producto esté en IN_PROGRESS y los demás en PENDING
   * Solo inicializa si no hay productos en IN_PROGRESS
   */
  useEffect(() => {
    // Si ya hay un producto en IN_PROGRESS, no hacemos nada
    const hasInProgressProduct = flowOrderDetails.some(detail => detail.state_picking_details_id === PickingDetailEnum.IN_PROGRESS)
    if (hasInProgressProduct) return

    // Si no hay productos en IN_PROGRESS, buscamos el primer producto que no esté COMPLETED ni INCOMPLETE
    const nextAvailableIndex = flowOrderDetails.findIndex(
      detail => detail.state_picking_details_id !== PickingDetailEnum.COMPLETED && detail.state_picking_details_id !== PickingDetailEnum.INCOMPLETE
    )

    if (nextAvailableIndex !== -1) {
      updateProductState(nextAvailableIndex, {
        state_picking_details_id: PickingDetailEnum.IN_PROGRESS
      })
      setCurrentProductIndex(nextAvailableIndex)
    }
  }, []) // Solo se ejecuta al montar el componente

  /**
   * Actualiza el estado de un producto
   */
  const updateProductState = (productIndex: number, updates: ProductUpdate) => {
    const updatedFlowOrderDetails = flowOrderDetails.map((detail, index) => (index === productIndex ? { ...detail, ...updates } : detail))
    setFlowOrderDetails(updatedFlowOrderDetails)
    return updatedFlowOrderDetails
  }

  /**
   * Encuentra el siguiente producto pendiente
   * @returns {number} Índice del siguiente producto pendiente o -1 si no hay más
   */
  const findNextPendingProduct = () => {
    // Primero buscamos si hay algún producto en IN_PROGRESS
    const inProgressIndex = flowOrderDetails.findIndex(detail => detail.state_picking_details_id === PickingDetailEnum.IN_PROGRESS)
    if (inProgressIndex !== -1) return inProgressIndex

    // Si no hay productos en IN_PROGRESS, buscamos el siguiente PENDING
    // que no haya sido procesado aún
    return flowOrderDetails.findIndex(detail => detail.state_picking_details_id === PickingDetailEnum.PENDING)
  }

  /**
   * Verifica si un producto ya fue procesado
   */
  const isProductProcessed = (state: PickingDetailEnum | null): boolean => {
    return state === PickingDetailEnum.COMPLETED || state === PickingDetailEnum.INCOMPLETE
  }

  /**
   * Verifica si un producto está disponible para picking
   */
  const isProductAvailable = (state: PickingDetailEnum | null): boolean => {
    return state === PickingDetailEnum.PENDING || state === PickingDetailEnum.IN_PROGRESS
  }

  /**
   * Encuentra el siguiente producto disponible para picking
   */
  const findNextAvailableProduct = () => {
    return flowOrderDetails.findIndex((detail, index) => {
      // Si es el producto actual, verificamos si está disponible
      if (index === currentProductIndex) {
        return isProductAvailable(detail.state_picking_details_id)
      }
      // Si no es el actual, solo consideramos los PENDING
      return detail.state_picking_details_id === PickingDetailEnum.PENDING
    })
  }

  /**
   * Efecto para verificar y actualizar el producto actual cuando volvemos a la pantalla
   */
  useEffect(() => {
    // Si no hay producto actual o el actual ya fue procesado, buscamos el siguiente
    if (!currentProduct || isProductProcessed(currentProduct.state_picking_details_id)) {
      const nextIndex = findNextAvailableProduct()

      if (nextIndex !== -1) {
        updateProductState(nextIndex, {
          state_picking_details_id: PickingDetailEnum.IN_PROGRESS
        })
        setCurrentProductIndex(nextIndex)
      }
    }
  }, [currentProduct?.state_picking_details_id])

  /**
   * Maneja la transición al siguiente producto
   */
  const handleProductTransition = (shouldNavigateToBaskets: boolean = false) => {
    // Si el producto actual está procesado, buscamos el siguiente
    if (currentProduct && isProductProcessed(currentProduct.state_picking_details_id)) {
      const nextIndex = findNextAvailableProduct()

      if (nextIndex !== -1) {
        updateProductState(nextIndex, {
          state_picking_details_id: PickingDetailEnum.IN_PROGRESS
        })
        setCurrentProductIndex(nextIndex)
      }
    }

    if (shouldNavigateToBaskets && warehouseConfig.use_picking_baskets.status) {
      router.push('/basket-validation')
    }
  }

  /**
   * Valida y obtiene la estructura del código de barras
   * @returns {BarcodeStructure | null} Estructura del código de barras o null si la configuración es inválida
   */
  const getBarcodeStructure = (): BarcodeStructure | null => {
    if (!warehouseConfig.use_weight) return null
    const config = warehouseConfig.use_weight

    // Validar que todos los campos requeridos existan y sean del tipo correcto
    if (
      typeof config.weightDecimals !== 'number' ||
      typeof config.priceDecimals !== 'number' ||
      typeof config.isWeightBased !== 'boolean' ||
      typeof config.weightStart !== 'number' ||
      typeof config.weightEnd !== 'number' ||
      typeof config.productCodeStart !== 'number' ||
      typeof config.productCodeEnd !== 'number'
    ) {
      return null
    }

    return {
      totalLength: config.weightEnd,
      productCodeStart: config.productCodeStart,
      productCodeEnd: config.productCodeEnd,
      weightStart: config.weightStart,
      weightEnd: config.weightEnd,
      weightDecimals: config.weightDecimals,
      priceDecimals: config.priceDecimals,
      isWeightBased: config.isWeightBased
    }
  }

  /**
   * Valida el código de barras escaneado
   */
  const validateBarcode = (scannedBarcode: string, product: typeof currentProduct) => {
    if (!product) return false

    if (product.weighable) {
      try {
        const structure = getBarcodeStructure()
        if (!structure) {
          console.error('Configuración de peso inválida')
          return false
        }

        const { productCode } = validateWeightBarcode(scannedBarcode, structure)
        return productCode.toString() === product.product_barcode
      } catch {
        return false
      }
    }

    return scannedBarcode === product.product_barcode
  }

  /**
   * Verifica si un producto está completo basado en sus cantidades
   */
  const isProductComplete = (quantityPicked: number, totalQuantity: number) => {
    return quantityPicked >= totalQuantity
  }

  /**
   * Procesa el escaneo de un producto
   */
  const handleScan = (scannedBarcode: string) => {
    if (!currentProduct || !warehouseConfig.use_weight) return

    if (!validateBarcode(scannedBarcode, currentProduct)) {
      setErrorModalVisible(true)
      return
    }

    try {
      if (currentProduct.weighable) {
        const structure = getBarcodeStructure()
        if (!structure) {
          setErrorModalVisible(true)
          return
        }

        const { weightOrPrice } = validateWeightBarcode(scannedBarcode, structure)
        const currentWeight = currentProduct.final_weight ?? 0
        const currentQuantityPicked = currentProduct.quantity_picked ?? 0
        const totalWeightPicked = currentWeight + weightOrPrice * 1000
        const newQuantityPicked = currentQuantityPicked + 1

        // Validar que no excedamos la cantidad máxima
        if (newQuantityPicked > currentProduct.quantity) {
          toast.showToast('Cantidad máxima excedida', currentProduct.order_id, Colors.red, 'error')
          return
        }

        const productCompleted = isProductComplete(newQuantityPicked, currentProduct.quantity)

        const updatedProduct = {
          final_weight: totalWeightPicked,
          quantity_picked: newQuantityPicked,
          state_picking_details_id: productCompleted ? PickingDetailEnum.COMPLETED : PickingDetailEnum.IN_PROGRESS
        }

        updateProductState(currentProductIndex, updatedProduct)

        if (productCompleted) {
          //   toast.showToast('Producto completado', currentProduct.order_id, Colors.green, 'success')
          handleProductTransition(true)
          // } else {
          //   toast.showToast(`Pickeo ${newQuantityPicked} de ${currentProduct.quantity}`, currentProduct.order_id, Colors.mainBlue, 'info')
        }
      } else {
        const currentQuantityPicked = currentProduct.quantity_picked ?? 0
        const newQuantityPicked = currentQuantityPicked + 1

        // Validar que no excedamos la cantidad máxima
        if (newQuantityPicked > currentProduct.quantity) {
          toast.showToast('Cantidad máxima excedida', currentProduct.order_id, Colors.red, 'error')
          return
        }

        const productCompleted = isProductComplete(newQuantityPicked, currentProduct.quantity)

        const updatedProduct = {
          quantity_picked: newQuantityPicked,
          state_picking_details_id: productCompleted ? PickingDetailEnum.COMPLETED : PickingDetailEnum.IN_PROGRESS
        }

        updateProductState(currentProductIndex, updatedProduct)

        if (productCompleted) {
          //   toast.showToast('Producto completado', currentProduct.order_id, Colors.green, 'success')
          handleProductTransition(true)
          // } else {
          //   toast.showToast(`Pickeo ${newQuantityPicked} de ${currentProduct.quantity}`, currentProduct.order_id, Colors.mainBlue, 'info')
        }
      }

      // console.log(flowOrderDetails, 'flowOrderDetails123')
    } catch (error) {
      setErrorModalVisible(true)
      console.error('Error al procesar el código de barras:', error)
    }
  }

  /**
   * Maneja el picking manual de un producto
   */
  const handleManualPicking = (quantity: number) => {
    if (!currentProduct) return

    try {
      const currentQuantityPicked = currentProduct.quantity_picked ?? 0
      const newQuantityPicked = currentQuantityPicked + quantity

      // Validar que no excedamos la cantidad máxima
      if (newQuantityPicked > currentProduct.quantity) {
        toast.showToast('Cantidad máxima excedida', currentProduct.order_id, Colors.red, 'error')
        return
      }

      const productCompleted = isProductComplete(newQuantityPicked, currentProduct.quantity)

      const updatedProduct = {
        quantity_picked: newQuantityPicked,
        final_weight: 0,
        state_picking_details_id: productCompleted ? PickingDetailEnum.COMPLETED : PickingDetailEnum.IN_PROGRESS
      }

      if (currentProduct.weighable) {
        // Para productos pesables, asumimos un peso promedio por unidad
        const averageWeightPerUnit = 500 // 500g por unidad como ejemplo
        updatedProduct.final_weight = (currentProduct.final_weight ?? 0) + quantity * averageWeightPerUnit
      }

      updateProductState(currentProductIndex, updatedProduct)
      setModalVisible(false)

      if (productCompleted) {
        // toast.showToast('Producto completado', currentProduct.order_id, Colors.green, 'success')
        handleProductTransition(true)
      } else {
        // toast.showToast(`Pickeo ${newQuantityPicked} de ${currentProduct.quantity}`, currentProduct.order_id, Colors.mainBlue, 'info')
      }
    } catch (error) {
      console.error('Error en picking manual:', error)
      toast.showToast('Error en picking manual', currentProduct.order_id, Colors.red, 'error')
    }
  }

  /**
   * Confirma un picking incompleto
   */
  const handleIncompleteConfirm = () => {
    if (!currentProduct) return

    updateProductState(currentProductIndex, {
      quantity_picked: 0,
      state_picking_details_id: PickingDetailEnum.INCOMPLETE
    })

    setModalVisible(false)
    setIncompleteModalVisible(false)
    handleProductTransition(true)
  }

  /**
   * Reinicia la cantidad pickeada de un producto
   */
  const handleRestartQuantity = () => {
    updateProductState(currentProductIndex, {
      quantity_picked: 0,
      final_weight: 0,
      state_picking_details_id: PickingDetailEnum.IN_PROGRESS
    })
  }

  return {
    // Estado
    currentProduct,
    modalVisible,
    setModalVisible,
    incompleteModalVisible,
    setIncompleteModalVisible,
    errorModalVisible,
    setErrorModalVisible,
    isCompleted,

    // Métodos
    handleScan,
    handleManualPicking,
    handleIncompleteConfirm,
    handleRestartQuantity
  }
}
