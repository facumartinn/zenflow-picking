import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { useRouter } from 'expo-router'
import { flowOrderDetailsAtom, warehousesAtom, currentProductIndexAtom, currentProductAtom } from '../store'
import { PickingDetailEnum } from '../types/order'

export const usePickingLogic = () => {
  const [flowOrderDetails, setFlowOrderDetails] = useAtom(flowOrderDetailsAtom)
  const [warehouseConfig] = useAtom(warehousesAtom)
  const [currentProductIndex, setCurrentProductIndex] = useAtom(currentProductIndexAtom)
  const [currentProduct] = useAtom(currentProductAtom)
  const [modalVisible, setModalVisible] = useState(false)
  const [incompleteModalVisible, setIncompleteModalVisible] = useState(false)
  const [errorModalVisible, setErrorModalVisible] = useState(false) // Nuevo estado para el modal de error
  const [newQuantityForIncomplete, setNewQuantityForIncomplete] = useState<number>(0)
  const router = useRouter()

  console.log(flowOrderDetails, 'sfdfdfdfdfd')
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
      if (currentProduct.product_barcode !== scannedBarcode) {
        // Si el código de barras escaneado no coincide, mostramos el modal de error
        setErrorModalVisible(true)
        return
      }

      if (currentProduct.quantity_picked! < currentProduct.quantity) {
        const updatedFlowOrderDetails = flowOrderDetails.map((detail, index) =>
          index === currentProductIndex ? { ...detail, quantity_picked: (detail.quantity_picked ?? 0) + 1 } : detail
        )
        setFlowOrderDetails(updatedFlowOrderDetails)

        if (updatedFlowOrderDetails[currentProductIndex].quantity_picked === currentProduct.quantity) {
          handleNextStep()
        }
      }
    }
  }

  const handleRestartQuantity = () => {
    const updatedFlowOrderDetails = flowOrderDetails.map((detail, index) =>
      index === currentProductIndex ? { ...detail, quantity_picked: 0, state_picking_details_id: PickingDetailEnum.IN_PROGRESS } : detail
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
    if (currentProductIndex < flowOrderDetails.length - 1) {
      const nextProductIndex = currentProductIndex + 1

      const updatedFlowOrderDetails = flowOrderDetails.map((detail, index) => {
        if (index === currentProductIndex) {
          return { ...detail, state_picking_details_id: PickingDetailEnum.COMPLETED }
        }
        if (
          index === nextProductIndex &&
          detail.state_picking_details_id !== PickingDetailEnum.COMPLETED &&
          detail.state_picking_details_id !== PickingDetailEnum.INCOMPLETE
        ) {
          return { ...detail, state_picking_details_id: PickingDetailEnum.IN_PROGRESS }
        }
        return detail
      })

      setFlowOrderDetails(updatedFlowOrderDetails)
      setCurrentProductIndex(nextProductIndex)
    } else {
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
    errorModalVisible, // Nuevo valor de retorno
    setErrorModalVisible, // Nuevo valor de retorno
    simulateScan,
    handleRestartQuantity,
    handleConfirmQuantity,
    handleIncompleteConfirm
  }
}
