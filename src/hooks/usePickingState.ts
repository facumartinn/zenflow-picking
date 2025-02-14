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
    const nextIndex = flowOrderDetails.findIndex(
      (detail, idx) =>
        idx > currentProductIndex &&
        detail.state_picking_details_id !== PickingDetailEnum.COMPLETED &&
        detail.state_picking_details_id !== PickingDetailEnum.INCOMPLETE
    )
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
