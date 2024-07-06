// src/store/warehouseAtoms.ts
import { atom } from 'jotai'
import { Warehouse } from '../types/warehouse'

export const warehousesAtom = atom<Warehouse[]>([])
