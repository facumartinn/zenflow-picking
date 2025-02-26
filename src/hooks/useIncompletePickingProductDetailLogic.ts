import { useState, useCallback } from 'react'
import { Alert } from 'react-native'
import { useAtom } from 'jotai'
import { incompleteOrderAtom } from '../store/incomplete-order'
import { OrderDetails, PickingDetailEnum } from '../types/order'
import { router } from 'expo-router'
import { useToast } from '../context/toast'
import Colors from '../constants/Colors'

export const useIncompletePickingProductDetailLogic = (initialProduct: OrderDetails) => {
  const { showToast } = useToast()
  const [incompleteOrder, setIncompleteOrder] = useAtom(incompleteOrderAtom)
  const [modalVisible, setModalVisible] = useState(false)
  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [product, setProduct] = useState<OrderDetails>(initialProduct)

  const updateProductInOrder = useCallback(
    (updatedProduct: OrderDetails) => {
      const updatedProducts = incompleteOrder.products.map(p => (p.product_id === updatedProduct.product_id ? updatedProduct : p))

      setIncompleteOrder({
        ...incompleteOrder,
        products: updatedProducts
      })
      setProduct(updatedProduct)
    },
    [incompleteOrder, setIncompleteOrder]
  )

  const handleScan = useCallback(
    (barcode: string) => {
      if (!product) return

      if (barcode !== product.product_barcode) {
        setErrorModalVisible(true)
        return
      }

      const newQuantityPicked = (product.quantity_picked || 0) + 1
      const isCompleted = newQuantityPicked >= product.quantity

      const updatedProduct = {
        ...product,
        quantity_picked: newQuantityPicked,
        state_picking_details_id: isCompleted ? PickingDetailEnum.COMPLETED : PickingDetailEnum.INCOMPLETE,
        // Si el producto es pesable, aquí deberíamos actualizar final_weight
        // Esto dependerá de cómo se maneje el peso en el escaneo
        final_weight: product.weighable ? parseFloat(barcode.slice(-6)) / 1000 : null
      }

      updateProductInOrder(updatedProduct)

      if (isCompleted) {
        showToast('Producto completado correctamente', product.Orders.order_tenant_id, Colors.green, Colors.white)
        router.back()
      }
    },
    [product, updateProductInOrder]
  )

  const handleManualPicking = useCallback(
    (quantity: number) => {
      if (!product) return

      const isCompleted = quantity >= product.quantity

      const updatedProduct = {
        ...product,
        quantity_picked: quantity,
        state_picking_details_id: isCompleted ? PickingDetailEnum.COMPLETED : PickingDetailEnum.INCOMPLETE
      }

      updateProductInOrder(updatedProduct)
      setModalVisible(false)

      if (isCompleted) {
        Alert.alert('Éxito', 'Producto completado correctamente')
        router.back()
      }
    },
    [product, updateProductInOrder]
  )

  const handleRestartQuantity = useCallback(() => {
    if (!product) return

    const updatedProduct = {
      ...product,
      quantity_picked: 0,
      state_picking_details_id: PickingDetailEnum.INCOMPLETE,
      final_weight: null
    }

    updateProductInOrder(updatedProduct)
  }, [product, updateProductInOrder])

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
