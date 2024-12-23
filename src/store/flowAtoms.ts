import { atom } from 'jotai'
import { Flow, PackingOrder } from '../types/flow'
import { OrderDetails } from '../types/order'

// Átomo para almacenar el flujo
export const flowAtom = atom<Flow>({
  id: 0,
  flow_type: 0,
  user_id: 0,
  tenant_id: 0,
  warehouse_id: 0,
  start_date: '',
  end_date: null
})

// Átomo para almacenar los detalles de los pedidos en el flujo
export const flowOrderDetailsAtom = atom<OrderDetails[]>([])

// Átomo para almacenar las bolsas asignadas a los pedidos
export const basketsByOrderAtom = atom<{ [orderId: number]: number[] }>({})

// Átomo para almacenar las bolsas asignadas a los pedidos
export const flowBasketAssignmentsAtom = atom<{ [orderId: number]: number[] }>({})

// Átomo para almacenar el índice del producto actual
export const currentProductIndexAtom = atom(0)

// Átomo derivado para obtener el producto actual en función del índice
export const currentProductAtom = atom(get => get(flowOrderDetailsAtom)[get(currentProductIndexAtom)])

// Átomo para almacenar el packing de los pedidos
export const packingOrdersAtom = atom<{ [orderId: number]: PackingOrder }>([])

// Átomo para resetear el flujo
export const resetFlowAtom = atom(null, (get, set) => {
  set(flowAtom, {
    id: 0,
    flow_type: 0,
    user_id: 0,
    tenant_id: 0,
    warehouse_id: 0,
    start_date: '',
    end_date: null
  })
})

// Átomo para resetear los detalles de los pedidos en el flujo
export const resetFlowOrderDetailsAtom = atom(null, (get, set) => {
  set(flowOrderDetailsAtom, [])
})

// Átomo para resetear las bolsas asignadas a los pedidos
export const resetBasketsByOrderAtom = atom(null, (get, set) => {
  set(basketsByOrderAtom, {})
})

// Átomo para resetear las bolsas asignadas a los pedidos
export const resetFlowBasketAssignmentsAtom = atom(null, (get, set) => {
  set(flowBasketAssignmentsAtom, {})
})

// Átomo para resetear los pedidos embalados
export const resetPackingOrdersAtom = atom(null, (get, set) => {
  set(packingOrdersAtom, {})
})

// Átomo para resetear el índice del producto actual
export const resetCurrentProductIndexAtom = atom(null, (get, set) => {
  set(currentProductIndexAtom, 0)
})

// Átomo para resetear todos los átomos del flujo
export const resetAllFlowAtoms = atom(null, (get, set) => {
  set(resetFlowAtom)
  set(resetFlowOrderDetailsAtom)
  set(resetBasketsByOrderAtom)
  set(resetFlowBasketAssignmentsAtom)
  set(resetPackingOrdersAtom)
  set(resetCurrentProductIndexAtom)
})
