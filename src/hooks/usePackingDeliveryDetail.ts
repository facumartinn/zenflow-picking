import { useState, useMemo, useCallback } from 'react'
import { useAtom } from 'jotai'
import { packingOrdersAtom } from '../store/flowAtoms'
import { Resource } from '../types/flow'

interface ScannedPosition {
  position: string
  status: number // 0=pendiente, 1=guardado
  barcode: string[]
}

interface UsePackingDeliveryDetailProps {
  orderId: number
}

export const usePackingDeliveryDetail = ({ orderId }: UsePackingDeliveryDetailProps) => {
  const [packingOrderDetail, setPackingOrderDetail] = useAtom(packingOrdersAtom)
  const [scannedPositions, setScannedPositions] = useState<ScannedPosition[]>([])
  //   const [currentPosition, setCurrentPosition] = useState<ScannedPosition | null>(null)

  // En el custom hook, elimina el state de currentPosition y utiliza una función derivada:
  const currentPosition = useMemo(() => {
    return scannedPositions.find(p => p.status === 0) || null
  }, [scannedPositions])

  const currentOrder = packingOrderDetail[orderId]

  const resourcesLength = currentOrder?.resources.length || 0
  const resourcesScanned = currentOrder?.resources.filter(res => res.position && res.position !== '').length || 0
  const allResourcesScanned = resourcesScanned === resourcesLength

  const handleAddPosition = useCallback((position: string) => {
    const newPos: ScannedPosition = { position, status: 0, barcode: [] }
    setScannedPositions(prev => [...prev, newPos])
    // setCurrentPosition(newPos)
  }, [])

  const handleAddResourceToPosition = useCallback(
    (position: string, barcode: string) => {
      if (!currentOrder) return

      // Verificar que el recurso exista en el pedido
      const matchedResource = currentOrder.resources.find(res => res.barcode.toString() === barcode)
      if (!matchedResource) {
        // El recurso no pertenece a este pedido
        alert('Este código de barras no corresponde a ningún recurso del pedido.')
        return
      }

      // Verificar si el recurso ya está asignado a alguna posición (en el atom o en scannedPositions)
      if (matchedResource.position && matchedResource.position !== '') {
        alert('Este recurso ya está asignado a una posición.')
        return
      }

      // Verificar si el recurso ya fue escaneado en las posiciones actuales sin guardar
      const alreadyScanned = scannedPositions.some(pos => pos.barcode.includes(barcode))
      if (alreadyScanned) {
        alert('Este recurso ya fue escaneado previamente.')
        return
      }

      // Si todo OK, agregamos el barcode a la posición actual
      setScannedPositions(prev => prev.map(item => (item.position === position ? { ...item, barcode: [...item.barcode, barcode] } : item)))
    },
    [currentOrder, scannedPositions]
  )

  const handleSavePosition = useCallback(
    (position: string) => {
      setPackingOrderDetail(prev => {
        const updatedOrder = { ...prev[orderId] }
        const posData = scannedPositions.find(p => p.position === position)
        if (posData) {
          const updatedResources = updatedOrder.resources.map((res: Resource) => {
            if (posData.barcode.includes(res.barcode.toString())) {
              return { ...res, position: position }
            }
            return res
          })
          updatedOrder.resources = updatedResources
        }
        return { ...prev, [orderId]: updatedOrder }
      })

      setScannedPositions(prev => prev.map(item => (item.position === position ? { ...item, status: 1 } : item)))

      //   setCurrentPosition(null)
    },
    [scannedPositions, orderId, setPackingOrderDetail]
  )

  const handleDeletePosition = useCallback(
    (position: string) => {
      // Quitar la posición
      setScannedPositions(prev => prev.filter(item => item.position !== position))

      // Remover la posición de los recursos asignados
      setPackingOrderDetail(prev => {
        const updatedOrder = { ...prev[orderId] }
        const updatedResources = updatedOrder.resources.map(res => {
          if (res.position === position) {
            return { ...res, position: '' }
          }
          return res
        })
        updatedOrder.resources = updatedResources
        return { ...prev, [orderId]: updatedOrder }
      })

      //   setCurrentPosition(null)
    },
    [orderId, setPackingOrderDetail]
  )

  const handleCompleteOrder = useCallback(() => {
    setPackingOrderDetail(prev => {
      const updatedOrder = { ...prev[orderId] }
      updatedOrder.packing_delivery_status = 1
      return { ...prev, [orderId]: updatedOrder }
    })
  }, [orderId, setPackingOrderDetail])

  const savedPositions = useMemo(() => scannedPositions.filter(item => item.status === 1), [scannedPositions])

  // Nuevo: Si savedPositions está vacío, creamos posiciones a partir de currentOrder.resources
  const assignedPositionsFromOrder = useMemo(() => {
    if (!currentOrder) return []
    // Filtrar recursos con posición asignada
    const assigned = currentOrder.resources.filter(r => r.position && r.position !== '')
    // Agrupar por posición
    const map = new Map<string, string[]>()
    assigned.forEach(res => {
      const pos = res.position!
      const barcodes = map.get(pos) || []
      barcodes.push(res.barcode.toString())
      map.set(pos, barcodes)
    })
    // Convertir a formato similar a scannedPositions con status=1
    return Array.from(map.entries()).map(([position, barcode]) => ({
      position,
      barcode,
      status: 1
    }))
  }, [currentOrder])
  // Si savedPositions está vacío y el pedido está completado (o no hay currentPosition),
  // mostramos assignedPositionsFromOrder.
  const finalPositionsToShow = savedPositions.length > 0 ? savedPositions : assignedPositionsFromOrder

  const currentPositionResources = useMemo(() => {
    if (!currentPosition || !currentOrder) return []
    return currentOrder.resources.filter(res => currentPosition.barcode.includes(res.barcode.toString()))
  }, [currentPosition, currentOrder])

  return {
    currentOrder,
    currentPosition,
    currentPositionResources,
    savedPositions: finalPositionsToShow,
    resourcesLength,
    resourcesScanned,
    allResourcesScanned,
    handleAddPosition,
    handleAddResourceToPosition,
    handleSavePosition,
    handleDeletePosition,
    handleCompleteOrder
    // setCurrentPosition
  }
}
