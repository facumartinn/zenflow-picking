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
  },
  use_weight: {
    status: false,
    productCodeStart: 0,
    productCodeEnd: 0,
    weightStart: 0,
    weightEnd: 0,
    productDecimals: 0,
    weightDecimals: 0,
    priceDecimals: 0,
    isWeightBased: false
  }
})
