// src/hooks/usePickingProductDetailLogic.ts
import { useState } from 'react'
import { usePickingState } from './usePickingState'
import { PickingDetailEnum } from '../types/order'
import { useRouter } from 'expo-router'
import { useToast } from '../context/toast'
import Colors from '../constants/Colors'
import { validateWeightBarcode } from '../utils/validateWeightBarcode'
import { useAtom } from 'jotai'
import { warehousesAtom } from '../store'

export const usePickingProductDetailLogic = (productId: string) => {
  const router = useRouter()
  const { showToast } = useToast()
  const [warehouseConfig] = useAtom(warehousesAtom)
  const { flowOrderDetails, updateProductState } = usePickingState('detail')

  const [modalVisible, setModalVisible] = useState(false)
  const [errorModalVisible, setErrorModalVisible] = useState(false)

  // Obtener el producto específico
  const product = flowOrderDetails.find(p => p.id.toString() === productId)

  const handleRestartQuantity = () => {
    if (!product) return

    updateProductState(
      product.id,
      {
        quantity_picked: 0,
        final_weight: 0,
        state_picking_details_id: PickingDetailEnum.IN_PROGRESS
      },
      { skipCurrentProductUpdate: true }
    )
  }

  const handleScan = (scannedBarcode: string) => {
    if (!product) return

    if (product.weighable) {
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
        const currentWeight = product.final_weight ?? 0
        const currentQuantityPicked = product.quantity_picked ?? 0
        const totalWeightPicked = currentWeight + weightOrPrice * 1000
        const newQuantityPicked = currentQuantityPicked + 1

        if (newQuantityPicked > product.quantity) {
          showToast('Cantidad máxima excedida', product.order_id, Colors.red, 'error')
          return
        }

        updateProductState(
          product.id,
          {
            final_weight: totalWeightPicked,
            quantity_picked: newQuantityPicked,
            state_picking_details_id: newQuantityPicked === product.quantity ? PickingDetailEnum.COMPLETED : PickingDetailEnum.IN_PROGRESS
          },
          { skipCurrentProductUpdate: true }
        )
        if (newQuantityPicked === product.quantity) {
          router.back()
          showToast('Producto completado', product.order_id, Colors.green, Colors.white)
        }
      } catch (error) {
        setErrorModalVisible(true)
      }
    } else {
      if (product.product_barcode !== scannedBarcode) {
        setErrorModalVisible(true)
        return
      }

      const currentQuantityPicked = product.quantity_picked ?? 0
      const newQuantityPicked = currentQuantityPicked + 1

      if (newQuantityPicked > product.quantity) {
        showToast('Cantidad máxima excedida', product.order_id, Colors.red, 'error')
        return
      }

      updateProductState(
        product.id,
        {
          quantity_picked: newQuantityPicked,
          state_picking_details_id: newQuantityPicked === product.quantity ? PickingDetailEnum.COMPLETED : PickingDetailEnum.IN_PROGRESS
        },
        { skipCurrentProductUpdate: true }
      )

      if (newQuantityPicked === product.quantity) {
        router.back()
        showToast('Producto completado', product.order_id, Colors.green, Colors.white)
      }
    }
  }

  const handleManualPicking = (quantity: number) => {
    if (!product) return

    if (quantity > product.quantity) {
      showToast('Cantidad máxima excedida', product.order_id, Colors.red, Colors.white)
      return
    }

    updateProductState(
      product.id,
      {
        quantity_picked: quantity,
        state_picking_details_id:
          quantity === product.quantity ? PickingDetailEnum.COMPLETED : quantity === 0 ? PickingDetailEnum.PENDING : PickingDetailEnum.INCOMPLETE
      },
      { skipCurrentProductUpdate: true }
    )

    setModalVisible(false)
    router.back()

    if (quantity === product.quantity) {
      showToast('Producto completado', product.order_id, Colors.green, Colors.white)
    } else if (quantity > 0) {
      showToast('Producto incompleto', product.order_id, Colors.orange, Colors.white)
    }
  }

  return {
    product,
    modalVisible,
    setModalVisible,
    errorModalVisible,
    setErrorModalVisible,
    handleScan,
    handleManualPicking,
    handleRestartQuantity
  }
}
