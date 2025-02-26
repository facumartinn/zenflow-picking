// hooks/usePackingOrderDetail.ts
import { useCallback, useState, useMemo, useEffect } from 'react'
import { useAtom } from 'jotai'
import { packingOrdersAtom, basketsByOrderAtom, warehousesAtom } from '../store'
import { PrintStatusEnum, Resource } from '../types/flow'

interface UsePackingOrderDetailProps {
  orderId: number
}

export const usePackingOrderDetail = ({ orderId }: UsePackingOrderDetailProps) => {
  const [warehouseConfig] = useAtom(warehousesAtom)
  const [basketsByOrder] = useAtom(basketsByOrderAtom)
  const [packingOrders, setPackingOrders] = useAtom(packingOrdersAtom)

  // Obtenemos los recursos disponibles desde el warehouseConfig
  const availableResources = useMemo(() => {
    return (warehouseConfig?.use_resources?.resources ?? []).map(res => ({
      resource_id: res.id,
      resource_name: res.name
    }))
  }, [warehouseConfig])

  // Lista de recursos seleccionados por el usuario (inicializada con los recursos existentes)
  const [resourceList, setResourceList] = useState<Resource[]>(packingOrders[orderId]?.resources || [])

  const [drawerNumber, setDrawerNumber] = useState<number[]>(basketsByOrder[orderId] || [])

  // Mantener sincronizado packingOrders con resourceList
  useEffect(() => {
    setPackingOrders(prev => ({
      ...prev,
      [orderId]: {
        print_status: prev[orderId]?.print_status || PrintStatusEnum.NOT_PRINTED,
        resources: resourceList,
        packing_delivery_status: prev[orderId]?.packing_delivery_status || 0
      }
    }))
  }, [resourceList, orderId, setPackingOrders])

  const incrementResource = useCallback(
    (resourceId: number) => {
      const resourceName = availableResources.find(r => r.resource_id === resourceId)?.resource_name || ''
      setResourceList(prev => [
        ...prev,
        {
          resource_id: resourceId,
          resource_name: resourceName,
          barcode: Date.now().toString(), // Generamos un barcode único como string
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
    // Ya no necesitamos actualizar packingOrders aquí porque se mantiene sincronizado con el useEffect
    // Retornamos para que el componente llamante maneje la navegación
  }, [])

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
