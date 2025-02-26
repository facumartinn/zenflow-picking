import { atom } from 'jotai'
import { OrderDetails } from '../types/order'

export interface IncompleteOrderState {
  orderId: number | null
  orderNumber: string | null
  products: OrderDetails[]
  isLoading: boolean
}

const initialState: IncompleteOrderState = {
  orderId: null,
  orderNumber: null,
  products: [],
  isLoading: false
}

export const incompleteOrderAtom = atom<IncompleteOrderState>(initialState)

// Atoms derivados para acceder a partes específicas del estado
export const incompleteProductsAtom = atom(
  get => get(incompleteOrderAtom).products,
  (get, set, products: OrderDetails[]) => {
    const currentState = get(incompleteOrderAtom)
    set(incompleteOrderAtom, { ...currentState, products })
  }
)

export const incompleteOrderLoadingAtom = atom(
  get => get(incompleteOrderAtom).isLoading,
  (get, set, isLoading: boolean) => {
    const currentState = get(incompleteOrderAtom)
    set(incompleteOrderAtom, { ...currentState, isLoading })
  }
)
