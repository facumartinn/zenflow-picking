// src/store/orderAtoms.ts
import { atom } from 'jotai'
import { Order, OrderDetails, OrderPosition, OrderState } from '../types/order'

export const ordersAtom = atom<Order[]>([])
export const orderDetailsAtom = atom<OrderDetails[]>([])
export const orderPositionsAtom = atom<{ [orderId: number]: OrderPosition[] }>({})
export const orderStatesAtom = atom<{ [orderId: number]: OrderState[] }>({})

export const pendingOrdersAtom = atom<Order[]>([])
export const completedOrdersAtom = atom<Order[]>([])
