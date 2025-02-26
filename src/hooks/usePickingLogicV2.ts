// src/hooks/usePickingLogicV2.ts
import { useEffect, useState, useCallback } from 'react'
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
  const { flowOrderDetails, updateProductState, currentProduct, findNextValidProduct, isProductProcessed, setCurrentProductIndex } = usePickingState('main')

  const [modalVisible, setModalVisible] = useState(false)
  const [incompleteModalVisible, setIncompleteModalVisible] = useState(false)
  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const checkAndUpdateCurrentProduct = useCallback(() => {
    const nextIndex = findNextValidProduct()
    if (nextIndex !== -1) {
      const nextProduct = flowOrderDetails[nextIndex]
      // Solo actualizamos a IN_PROGRESS si:
      // 1. El producto no está completado
      // 2. No tiene cantidad_picked igual a quantity
      // 3. No está ya en IN_PROGRESS
      if (nextProduct.quantity_picked !== nextProduct.quantity && nextProduct.state_picking_details_id !== PickingDetailEnum.COMPLETED) {
        updateProductState(nextProduct.id, {
          state_picking_details_id: PickingDetailEnum.IN_PROGRESS
        })
      }
      // Actualizamos el índice del producto actual
      if (setCurrentProductIndex) {
        setCurrentProductIndex(nextIndex)
      }
    }
  }, [flowOrderDetails, findNextValidProduct, updateProductState, setCurrentProductIndex])

  // Efecto para inicializar el primer producto si es necesario
  useEffect(() => {
    if (
      !currentProduct ||
      (isProductProcessed(currentProduct.state_picking_details_id) && currentProduct.state_picking_details_id !== PickingDetailEnum.COMPLETED)
    ) {
      checkAndUpdateCurrentProduct()
    }
  }, [currentProduct?.state_picking_details_id, flowOrderDetails])

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

        setIsCompleted(false)
        if (newQuantityPicked === currentProduct.quantity) {
          setIsCompleted(true)
          updateProductState(currentProduct.id, {
            final_weight: totalWeightPicked,
            quantity_picked: newQuantityPicked,
            state_picking_details_id: PickingDetailEnum.IN_PROGRESS
          })
          handleNextStep()
        } else {
          updateProductState(currentProduct.id, {
            final_weight: totalWeightPicked,
            quantity_picked: newQuantityPicked,
            state_picking_details_id: PickingDetailEnum.IN_PROGRESS
          })
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

      setIsCompleted(false)
      if (newQuantityPicked === currentProduct.quantity) {
        setIsCompleted(true)
        updateProductState(currentProduct.id, {
          quantity_picked: newQuantityPicked,
          state_picking_details_id: PickingDetailEnum.IN_PROGRESS
        })
        handleNextStep()
      } else {
        updateProductState(currentProduct.id, {
          quantity_picked: newQuantityPicked,
          state_picking_details_id: PickingDetailEnum.IN_PROGRESS
        })
      }
    }
  }

  const handleManualPicking = (quantity: number) => {
    if (!currentProduct) return

    if (quantity > currentProduct.quantity) {
      showToast('Cantidad máxima excedida', currentProduct.order_id, Colors.red, 'error')
      return
    }

    setIsCompleted(false)
    if (quantity === currentProduct.quantity) {
      setIsCompleted(true)
      updateProductState(currentProduct.id, {
        quantity_picked: quantity,
        state_picking_details_id: PickingDetailEnum.IN_PROGRESS
      })
      setModalVisible(false)
      handleNextStep()
    } else {
      //   updateProductState(currentProduct.id, {
      //     quantity_picked: quantity || 0,
      //     state_picking_details_id: PickingDetailEnum.INCOMPLETE
      //   })
      //   setModalVisible(false)
      if (quantity === 0) {
        updateProductState(currentProduct.id, {
          quantity_picked: quantity || 0,
          state_picking_details_id: PickingDetailEnum.INCOMPLETE
        })
        setModalVisible(false)
        // Si es 0, solo mostramos el modal de incompleto y dejamos que el useEffect se encargue del siguiente producto
        setIncompleteModalVisible(false)
      } else if (quantity > 0) {
        updateProductState(currentProduct.id, {
          quantity_picked: quantity || 0,
          state_picking_details_id: PickingDetailEnum.IN_PROGRESS
        })
        setModalVisible(false)
        handleNextStep()
        // Si es mayor a 0 pero menor que quantity, vamos a basket-validation
        // router.push('/basket-validation')
      }
    }
  }

  const handleRestartQuantity = () => {
    if (!currentProduct) return

    setIsCompleted(false)
    updateProductState(currentProduct.id, {
      quantity_picked: 0,
      final_weight: 0,
      state_picking_details_id: PickingDetailEnum.IN_PROGRESS
    })
  }

  const handleNextStep = () => {
    if (warehouseConfig.use_picking_baskets.status) {
      setTimeout(() => {
        router.push('/basket-validation')
        // Actualizamos el estado a COMPLETED después de la redirección
        setTimeout(() => {
          updateProductState(currentProduct!.id, {
            state_picking_details_id: PickingDetailEnum.COMPLETED
          })
        }, 100)
      }, 1000)
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
    handleRestartQuantity,
    checkAndUpdateCurrentProduct,
    isProductProcessed
  }
}
