import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { useRouter } from 'expo-router'
import { flowOrderDetailsAtom, warehousesAtom, currentProductIndexAtom, currentProductAtom } from '../store'
import { PickingDetailEnum } from '../types/order'
import { BarcodeStructure, validateWeightBarcode } from '../utils/validateWeightBarcode'
import { useToast } from '../context/toast'
import Colors from '../constants/Colors'

export const usePickingLogic = () => {
  const [flowOrderDetails, setFlowOrderDetails] = useAtom(flowOrderDetailsAtom)
  const [warehouseConfig] = useAtom(warehousesAtom)
  const [currentProductIndex, setCurrentProductIndex] = useAtom(currentProductIndexAtom)
  const [currentProduct] = useAtom(currentProductAtom)
  const [modalVisible, setModalVisible] = useState(false)
  const [incompleteModalVisible, setIncompleteModalVisible] = useState(false)
  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [newQuantityForIncomplete, setNewQuantityForIncomplete] = useState<number>(0)
  const router = useRouter()
  const { showToast } = useToast()

  useEffect(() => {
    if (!currentProduct) return

    if (currentProduct.state_picking_details_id !== PickingDetailEnum.IN_PROGRESS) {
      const inProgressIndex = flowOrderDetails.findIndex(detail => detail.state_picking_details_id === PickingDetailEnum.IN_PROGRESS)

      if (inProgressIndex !== -1) {
        setCurrentProductIndex(inProgressIndex)
      } else {
        const nextProductIndex = flowOrderDetails.findIndex(detail => detail.state_picking_details_id === PickingDetailEnum.PENDING)
        if (nextProductIndex !== -1) {
          const updatedFlowOrderDetails = flowOrderDetails.map((detail, index) =>
            index === nextProductIndex ? { ...detail, state_picking_details_id: PickingDetailEnum.IN_PROGRESS } : detail
          )
          setFlowOrderDetails(updatedFlowOrderDetails)
          setCurrentProductIndex(nextProductIndex)
        }
      }
    }
  }, [flowOrderDetails, currentProduct, setCurrentProductIndex, setFlowOrderDetails])

  const simulateScan = (scannedBarcode: string) => {
    if (currentProduct) {
      if (currentProduct.product_barcode !== scannedBarcode && !currentProduct.weighable) {
        setErrorModalVisible(true)
        return
      }

      if (currentProduct.weighable) {
        const structure: BarcodeStructure = {
          totalLength: warehouseConfig.use_weight.productCodeEnd, // Asume que el total es el último dígito del productCodeEnd
          productCodeStart: warehouseConfig.use_weight.productCodeStart,
          productCodeEnd: warehouseConfig.use_weight.productCodeEnd,
          weightStart: warehouseConfig.use_weight.weightStart,
          weightEnd: warehouseConfig.use_weight.weightEnd,
          weightDecimals: warehouseConfig.use_weight.weightDecimals ?? 0,
          isWeightBased: warehouseConfig.use_weight.isWeightBased ?? true
        }

        try {
          const extractedWeight = validateWeightBarcode(scannedBarcode, structure)
          const updatedFlowOrderDetails = flowOrderDetails.map((detail, index) => {
            if (index === currentProductIndex) {
              const totalWeightPicked = (detail.final_weight ?? 0) + extractedWeight.weightOrPrice * 1000
              const totalRequiredWeight = currentProduct.quantity * currentProduct.sales_unit! // convertir sales_unit a gramos si es necesario
              // Incrementar la cantidad pickeada y el peso acumulado
              const newQuantityPicked = detail.quantity_picked! + 1

              if (totalWeightPicked >= totalRequiredWeight && newQuantityPicked === currentProduct.quantity) {
                return {
                  ...detail,
                  final_weight: totalWeightPicked,
                  quantity_picked: newQuantityPicked
                  // state_picking_details_id: PickingDetailEnum.COMPLETED
                }
              } else {
                return {
                  ...detail,
                  final_weight: totalWeightPicked,
                  quantity_picked: newQuantityPicked
                }
              }
            }
            return detail
          })

          setFlowOrderDetails(updatedFlowOrderDetails)
          if (updatedFlowOrderDetails[currentProductIndex].quantity_picked === currentProduct.quantity) {
            handleNextStep()
          }
        } catch (error) {
          setErrorModalVisible(true)
        }
      } else {
        // Para productos no pesables
        if (currentProduct.quantity_picked! < currentProduct.quantity) {
          const updatedFlowOrderDetails = flowOrderDetails.map((detail, index) =>
            index === currentProductIndex
              ? {
                  ...detail,
                  quantity_picked: Math.round((detail.quantity_picked ?? 0) + 1) // Asegurar número entero
                }
              : detail
          )
          setFlowOrderDetails(updatedFlowOrderDetails)

          if (updatedFlowOrderDetails[currentProductIndex].quantity_picked === currentProduct.quantity) {
            handleNextStep()
          }
        }
      }
    }
  }

  const simulateScanForIncomplete = (scannedBarcode: string, selectedProductId: number, orderId: number) => {
    // Recibe el producto específico a modificar, no usa currentProduct
    const selectedProductIndex = flowOrderDetails.findIndex(detail => detail.id == selectedProductId && detail.order_id == orderId)
    if (selectedProductIndex === -1) return // Si no encuentra el producto, no hace nada

    const selectedProduct = flowOrderDetails[selectedProductIndex]

    // Validar que el código de barras coincida o que el producto sea pesable
    if (selectedProduct.product_barcode !== scannedBarcode && !selectedProduct.weighable) {
      setErrorModalVisible(true)
      return
    }

    if (selectedProduct.weighable) {
      // Ajustar para productos pesables si aplica
      const structure: BarcodeStructure = {
        totalLength: warehouseConfig.use_weight.weightEnd,
        productCodeStart: warehouseConfig.use_weight.productCodeStart,
        productCodeEnd: warehouseConfig.use_weight.productCodeEnd,
        weightStart: warehouseConfig.use_weight.weightStart,
        weightEnd: warehouseConfig.use_weight.weightEnd,
        weightDecimals: warehouseConfig.use_weight.weightDecimals ?? 0,
        isWeightBased: warehouseConfig.use_weight.isWeightBased ?? true
      }

      try {
        const extractedWeight = validateWeightBarcode(scannedBarcode, structure)
        const totalWeightPicked = (selectedProduct.final_weight ?? 0) + extractedWeight.weightOrPrice * 1000
        // const totalRequiredWeight = selectedProduct.quantity * (selectedProduct.sales_unit ?? 1) // Asegurar que sales_unit esté definido
        const newQuantityPicked = selectedProduct.quantity_picked! + 1

        const updatedProduct = {
          ...selectedProduct,
          final_weight: totalWeightPicked,
          quantity_picked: newQuantityPicked,
          state_picking_details_id: newQuantityPicked === selectedProduct.quantity ? PickingDetailEnum.COMPLETED : PickingDetailEnum.INCOMPLETE
        }

        const updatedFlowOrderDetails = [...flowOrderDetails]
        updatedFlowOrderDetails[selectedProductIndex] = updatedProduct
        setFlowOrderDetails(updatedFlowOrderDetails)
      } catch (error) {
        setErrorModalVisible(true)
      }
    } else {
      // Para productos no pesables
      const newQuantityPicked = selectedProduct.quantity_picked! + 1
      const updatedProduct = {
        ...selectedProduct,
        quantity_picked: newQuantityPicked,
        state_picking_details_id: newQuantityPicked === selectedProduct.quantity ? PickingDetailEnum.COMPLETED : PickingDetailEnum.INCOMPLETE
      }

      const updatedFlowOrderDetails = [...flowOrderDetails]
      updatedFlowOrderDetails[selectedProductIndex] = updatedProduct
      setFlowOrderDetails(updatedFlowOrderDetails)
      if (newQuantityPicked === selectedProduct.quantity) {
        router.back()
        showToast('Producto agregado', orderId, Colors.green, Colors.white)
        // aca va un toast
      }
    }
  }

  const handleRestartQuantityIncomplete = (selectedProductId: number, orderId: number) => {
    const selectedProductIndex = flowOrderDetails.findIndex(detail => detail.id == selectedProductId && detail.order_id == orderId)
    if (selectedProductIndex === -1) return // Si no encuentra el producto, no hace nada

    const updatedFlowOrderDetails = flowOrderDetails.map((detail, index) =>
      index === selectedProductIndex ? { ...detail, quantity_picked: 0, final_weight: 0, state_picking_details_id: PickingDetailEnum.IN_PROGRESS } : detail
    )
    setFlowOrderDetails(updatedFlowOrderDetails)
  }

  const handleRestartQuantity = () => {
    const updatedFlowOrderDetails = flowOrderDetails.map((detail, index) =>
      index === currentProductIndex ? { ...detail, quantity_picked: 0, final_weight: 0, state_picking_details_id: PickingDetailEnum.IN_PROGRESS } : detail
    )
    setFlowOrderDetails(updatedFlowOrderDetails)
  }

  const handleNextStep = () => {
    if (warehouseConfig.use_picking_baskets.status) {
      router.push('/basket-validation')
    } else {
      handleNextProduct()
    }
  }

  const handleNextProduct = () => {
    // Encontrar el siguiente producto en estado PENDING después del índice actual
    const nextPendingIndex = flowOrderDetails.findIndex(
      (detail, index) => index > currentProductIndex && detail.state_picking_details_id === PickingDetailEnum.PENDING
    )

    // Si se encuentra un producto en estado PENDING
    if (nextPendingIndex !== -1) {
      const updatedFlowOrderDetails = flowOrderDetails.map((detail, index) => {
        if (index === currentProductIndex) {
          // Marcar el producto actual como COMPLETED
          return { ...detail, state_picking_details_id: PickingDetailEnum.COMPLETED }
        }
        if (index === nextPendingIndex) {
          // Marcar el siguiente producto PENDING como IN_PROGRESS
          return { ...detail, state_picking_details_id: PickingDetailEnum.IN_PROGRESS }
        }
        return detail
      })

      setFlowOrderDetails(updatedFlowOrderDetails)
      setCurrentProductIndex(nextPendingIndex)
    } else {
      // Si no hay más productos PENDING, marcar el actual como COMPLETED si aún no lo está
      const updatedFlowOrderDetails = flowOrderDetails.map((detail, index) => {
        if (index === currentProductIndex) {
          return { ...detail, state_picking_details_id: PickingDetailEnum.COMPLETED }
        }
        return detail
      })

      setFlowOrderDetails(updatedFlowOrderDetails)
      console.log('Picking process completed')
    }
  }

  const handleConfirmQuantity = (newQuantity: number) => {
    if (newQuantity < currentProduct.quantity) {
      setNewQuantityForIncomplete(newQuantity)
      setIncompleteModalVisible(true)
    } else {
      setModalVisible(false)
      setFlowOrderDetails(flowOrderDetails.map((detail, index) => (index === currentProductIndex ? { ...detail, quantity_picked: newQuantity } : detail)))
      handleNextStep()
    }
  }

  const handleIncompleteConfirm = () => {
    setFlowOrderDetails(
      flowOrderDetails.map((detail, index) => (index === currentProductIndex ? { ...detail, quantity_picked: newQuantityForIncomplete } : detail))
    )
    setModalVisible(false)
    setIncompleteModalVisible(false)
    handleNextStep()
  }

  return {
    currentProduct,
    modalVisible,
    setModalVisible,
    incompleteModalVisible,
    setIncompleteModalVisible,
    errorModalVisible,
    setErrorModalVisible,
    simulateScan,
    simulateScanForIncomplete,
    handleRestartQuantity,
    handleRestartQuantityIncomplete,
    handleConfirmQuantity,
    handleIncompleteConfirm
  }
}
