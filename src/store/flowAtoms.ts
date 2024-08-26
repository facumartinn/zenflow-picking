import { atom } from 'jotai'
import { Flow } from '../types/flow'
import { OrderDetails } from '../types/order'

export const flowAtom = atom<Flow>({
  id: 0,
  flow_type: 0,
  user_id: 0,
  tenant_id: 0,
  warehouse_id: 0,
  start_date: '',
  end_date: null
})

export const flowOrderDetailsAtom = atom<OrderDetails[]>([])

export const basketsByOrderAtom = atom<{ [orderId: number]: number[] }>({})
export const flowBasketAssignmentsAtom = atom<{ [orderId: number]: number[] }>({})

// Átomo para almacenar el índice del producto actual
export const currentProductIndexAtom = atom(0)

// Átomo derivado para obtener el producto actual en función del índice
export const currentProductAtom = atom(get => get(flowOrderDetailsAtom)[get(currentProductIndexAtom)])
