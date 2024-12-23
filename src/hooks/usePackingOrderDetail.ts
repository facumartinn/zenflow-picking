// hooks/usePackingOrderDetail.ts
import { useCallback, useState, useMemo } from 'react'
import { useAtom } from 'jotai'
import { packingOrdersAtom, basketsByOrderAtom, warehousesAtom } from '../store'
import { PrintStatusEnum, Resource } from '../types/flow'

interface UsePackingOrderDetailProps {
  orderId: number
}

export const usePackingOrderDetail = ({ orderId }: UsePackingOrderDetailProps) => {
  const [warehouseConfig] = useAtom(warehousesAtom)
  const [basketsByOrder] = useAtom(basketsByOrderAtom)
  const [, setPackingOrders] = useAtom(packingOrdersAtom)

  // Obtenemos los recursos disponibles desde el warehouseConfig
  const availableResources = useMemo(() => {
    return (warehouseConfig?.use_resources?.resources ?? []).map(res => ({
      resource_id: res.id,
      resource_name: res.name
    }))
  }, [warehouseConfig])

  // Lista de recursos seleccionados por el usuario (inicia vacía)
  const [resourceList, setResourceList] = useState<Resource[]>([])

  const [drawerNumber, setDrawerNumber] = useState<number[]>(basketsByOrder[orderId] || [])

  const incrementResource = useCallback(
    (resourceId: number) => {
      const resourceName = availableResources.find(r => r.resource_id === resourceId)?.resource_name || ''
      setResourceList(prev => [
        ...prev,
        {
          resource_id: resourceId,
          resource_name: resourceName,
          barcode: Date.now(), // Generamos un barcode único
          position: ''
        }
      ])
    },
    [availableResources]
  )

  const decrementResource = useCallback((resourceId: number) => {
    setResourceList(prev => {
      const indexToRemove = [...prev].reverse().findIndex(item => item.resource_id === resourceId)
      if (indexToRemove === -1) return prev
      const reversed = [...prev].reverse()
      reversed.splice(indexToRemove, 1)
      return reversed.reverse()
    })
  }, [])

  const clearDrawer = useCallback(() => {
    setDrawerNumber([])
  }, [])

  const handleConfirm = useCallback(() => {
    setPackingOrders(prev => ({
      ...prev,
      [orderId]: {
        print_status: PrintStatusEnum.NOT_PRINTED,
        resources: resourceList,
        packing_delivery_status: 0
      }
    }))
    // Retornamos para que el componente llamante maneje la navegación
  }, [resourceList, orderId, setPackingOrders])

  return {
    drawerNumber,
    resourceList,
    availableResources,
    incrementResource,
    decrementResource,
    clearDrawer,
    handleConfirm
  }
}
