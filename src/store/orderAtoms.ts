// src/store/orderAtoms.ts
import { atom } from 'jotai'
import { Order, OrderDetails, OrderPosition, OrderResourceItem, OrderState } from '../types/order'

export const ordersAtom = atom<Order[]>([])
export const orderTotalsAtom = atom<{ pending: number; completed: number }>({ pending: 0, completed: 0 })
export const orderDetailsAtom = atom<OrderDetails[]>([])
export const orderPositionsAtom = atom<{ [orderId: number]: OrderPosition[] }>({})
export const orderStatesAtom = atom<{ [orderId: number]: OrderState[] }>({})

export const pendingOrdersAtom = atom<Order[]>([])
export const completedOrdersAtom = atom<Order[]>([])

export const orderResourcesAtom = atom<{ [key: string]: OrderResourceItem[] }>({})
