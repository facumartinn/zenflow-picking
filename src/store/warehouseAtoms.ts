// src/store/warehouseAtoms.ts
import { atom } from 'jotai'
import { WarehouseConfig } from '../types/warehouse'

export const warehousesAtom = atom<WarehouseConfig>({
  automatic_picking: {
    status: false
  },
  use_picking_baskets: {
    status: false,
    volume: 0
  },
  use_shifts: {
    status: false,
    shifts: []
  },
  use_resources: {
    status: false,
    resources: []
  }
})
