// src/hooks/usePickingLogicV2.ts
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { usePickingState } from './usePickingState'
import { PickingDetailEnum } from '../types/order'
import { useToast } from '../context/toast'
import Colors from '../constants/Colors'
import { validateWeightBarcode } from '../utils/validateWeightBarcode'
import { useAtom } from 'jotai'
import { warehousesAtom } from '../store'

export const usePickingLogicV2 = () => {
  const router = useRouter()
  const { showToast } = useToast()
  const [warehouseConfig] = useAtom(warehousesAtom)

  // Usamos el contexto 'main' ya que este es el flujo principal
  const { flowOrderDetails, updateProductState, currentProduct, findNextValidProduct, isProductProcessed } = usePickingState('main')

  const [modalVisible, setModalVisible] = useState(false)
  const [incompleteModalVisible, setIncompleteModalVisible] = useState(false)
  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [isCompleted] = useState(false)

  // Efecto para inicializar el primer producto si es necesario
  useEffect(() => {
    if (!currentProduct || isProductProcessed(currentProduct.state_picking_details_id)) {
      const nextIndex = findNextValidProduct()
      if (nextIndex !== -1) {
        updateProductState(flowOrderDetails[nextIndex].id, {
          state_picking_details_id: PickingDetailEnum.IN_PROGRESS
        })
      }
    }
  }, [currentProduct?.state_picking_details_id])

  const handleScan = (scannedBarcode: string) => {
    if (!currentProduct) return

    if (currentProduct.weighable) {
      try {
        const structure = {
          totalLength: warehouseConfig.use_weight.weightEnd,
          productCodeStart: warehouseConfig.use_weight.productCodeStart,
          productCodeEnd: warehouseConfig.use_weight.productCodeEnd,
          weightStart: warehouseConfig.use_weight.weightStart,
          weightEnd: warehouseConfig.use_weight.weightEnd,
          weightDecimals: warehouseConfig.use_weight.weightDecimals ?? 0,
          priceDecimals: warehouseConfig.use_weight.priceDecimals ?? 0,
          isWeightBased: warehouseConfig.use_weight.isWeightBased ?? true
        }

        const { weightOrPrice } = validateWeightBarcode(scannedBarcode, structure)
        const currentWeight = currentProduct.final_weight ?? 0
        const currentQuantityPicked = currentProduct.quantity_picked ?? 0
        const totalWeightPicked = currentWeight + weightOrPrice * 1000
        const newQuantityPicked = currentQuantityPicked + 1

        if (newQuantityPicked > currentProduct.quantity) {
          showToast('Cantidad máxima excedida', currentProduct.order_id, Colors.red, 'error')
          return
        }

        updateProductState(currentProduct.id, {
          final_weight: totalWeightPicked,
          quantity_picked: newQuantityPicked,
          state_picking_details_id: newQuantityPicked === currentProduct.quantity ? PickingDetailEnum.COMPLETED : PickingDetailEnum.IN_PROGRESS
        })

        if (newQuantityPicked === currentProduct.quantity) {
          handleNextStep()
        }
      } catch (error) {
        setErrorModalVisible(true)
      }
    } else {
      if (currentProduct.product_barcode !== scannedBarcode) {
        setErrorModalVisible(true)
        return
      }

      const currentQuantityPicked = currentProduct.quantity_picked ?? 0
      const newQuantityPicked = currentQuantityPicked + 1

      if (newQuantityPicked > currentProduct.quantity) {
        showToast('Cantidad máxima excedida', currentProduct.order_id, Colors.red, 'error')
        return
      }

      updateProductState(currentProduct.id, {
        quantity_picked: newQuantityPicked,
        state_picking_details_id: newQuantityPicked === currentProduct.quantity ? PickingDetailEnum.COMPLETED : PickingDetailEnum.IN_PROGRESS
      })

      if (newQuantityPicked === currentProduct.quantity) {
        handleNextStep()
      }
    }
  }

  const handleManualPicking = (quantity: number) => {
    if (!currentProduct) return

    if (quantity > currentProduct.quantity) {
      showToast('Cantidad máxima excedida', currentProduct.order_id, Colors.red, 'error')
      return
    }

    updateProductState(currentProduct.id, {
      quantity_picked: quantity,
      state_picking_details_id:
        quantity === currentProduct.quantity ? PickingDetailEnum.COMPLETED : quantity === 0 ? PickingDetailEnum.PENDING : PickingDetailEnum.INCOMPLETE
    })

    setModalVisible(false)

    if (quantity === currentProduct.quantity) {
      handleNextStep()
    } else if (quantity > 0) {
      setIncompleteModalVisible(true)
    }
  }

  const handleRestartQuantity = () => {
    if (!currentProduct) return

    updateProductState(currentProduct.id, {
      quantity_picked: 0,
      final_weight: 0,
      state_picking_details_id: PickingDetailEnum.IN_PROGRESS
    })
  }

  const handleNextStep = () => {
    if (warehouseConfig.use_picking_baskets.status) {
      router.push('/basket-validation')
    }
  }

  return {
    currentProduct,
    modalVisible,
    setModalVisible,
    incompleteModalVisible,
    setIncompleteModalVisible,
    errorModalVisible,
    setErrorModalVisible,
    isCompleted,
    handleScan,
    handleManualPicking,
    handleRestartQuantity
  }
}
