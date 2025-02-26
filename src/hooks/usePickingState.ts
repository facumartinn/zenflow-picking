// src/hooks/usePickingState.ts
import { useAtom } from 'jotai'
import { flowOrderDetailsAtom, currentProductAtom, currentProductIndexAtom } from '../store'
import { OrderDetails, PickingDetailEnum } from '../types/order'

export type PickingContext = 'main' | 'detail'

export const usePickingState = (context: PickingContext) => {
  const [flowOrderDetails, setFlowOrderDetails] = useAtom(flowOrderDetailsAtom)
  const [currentProductIndex, setCurrentProductIndex] = useAtom(currentProductIndexAtom)
  const [currentProduct] = useAtom(currentProductAtom)

  const updateProductState = (productId: number, updates: Partial<OrderDetails>, options?: { skipCurrentProductUpdate?: boolean }) => {
    setFlowOrderDetails(prev => {
      const productIndex = prev.findIndex(detail => detail.id === productId)
      if (productIndex === -1) return prev

      const newState = prev.map(detail => (detail.id === productId ? { ...detail, ...updates } : detail))

      // Solo actualizamos currentProductIndex si estamos en el flujo principal
      // y no se especifica lo contrario en las opciones
      if (context === 'main' && !options?.skipCurrentProductUpdate) {
        const updatedProduct = newState[productIndex]
        // Solo actualizamos el índice si el producto está COMPLETED, no cuando está INCOMPLETE
        if (updatedProduct.state_picking_details_id === PickingDetailEnum.COMPLETED) {
          const nextPendingIndex = newState.findIndex((detail, idx) => idx > productIndex && detail.state_picking_details_id === PickingDetailEnum.PENDING)
          if (nextPendingIndex !== -1) {
            setCurrentProductIndex(nextPendingIndex)
          }
        }
      }

      return newState
    })
  }

  const findNextValidProduct = () => {
    const isValidProduct = (detail: OrderDetails, index: number) => {
      // Un producto es válido si:
      // 1. No está completado (quantity_picked !== quantity)
      // 2. No está en estado COMPLETED
      // 3. No está en estado INCOMPLETE
      // 4. Si está en IN_PROGRESS, debe estar después del índice actual
      const isCompleted = detail.quantity_picked === detail.quantity
      const isInProgress = detail.state_picking_details_id === PickingDetailEnum.IN_PROGRESS

      return (
        !isCompleted &&
        detail.state_picking_details_id !== PickingDetailEnum.COMPLETED &&
        detail.state_picking_details_id !== PickingDetailEnum.INCOMPLETE &&
        (!isInProgress || index > currentProductIndex)
      )
    }

    // Primero buscamos desde el índice actual
    let nextIndex = flowOrderDetails.findIndex((detail, idx) => idx >= currentProductIndex && isValidProduct(detail, idx))

    // Si no encontramos nada desde el índice actual, buscamos desde el principio
    if (nextIndex === -1) {
      nextIndex = flowOrderDetails.findIndex((detail, idx) => isValidProduct(detail, idx))
    }

    return nextIndex
  }

  const isProductProcessed = (stateId: PickingDetailEnum | null): boolean => {
    return stateId === PickingDetailEnum.COMPLETED || stateId === PickingDetailEnum.INCOMPLETE
  }

  return {
    flowOrderDetails,
    updateProductState,
    findNextValidProduct,
    isProductProcessed,
    ...(context === 'main'
      ? {
          currentProduct,
          currentProductIndex,
          setCurrentProductIndex
        }
      : {})
  }
}
