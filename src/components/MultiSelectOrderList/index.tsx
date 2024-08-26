import React, { useState } from 'react'
import { Text, FlatList, RefreshControl } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getFilteredOrders } from '../../services/order'
import { Order, OrderStateEnum } from '../../types/order'
import { useAtom } from 'jotai'
import { userAtom } from '../../store'
import MultiSelectOrderItem from './OrderItem'

interface MultiSelectOrdersListProps {
  selectedTab: 'pending' | 'completed'
  onSelectionChange: (selectedOrders: number[]) => void
}

const MultiSelectOrdersList: React.FC<MultiSelectOrdersListProps> = ({ selectedTab, onSelectionChange }) => {
  const [pickerUser] = useAtom(userAtom)
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])
  const [refreshing, setRefreshing] = useState(false) // Estado para controlar el refresh
  console.log('first')

  const stateId = selectedTab === 'pending' ? OrderStateEnum.READY_TO_PICK : OrderStateEnum.COMPLETED

  const {
    data: orders = [],
    isLoading,
    error,
    refetch // <-- Añadido para poder recargar los datos manualmente
  } = useQuery<Order[]>({
    queryKey: ['orders', stateId],
    queryFn: () => getFilteredOrders({ stateId: [stateId], userId: pickerUser?.id, includeDetails: true })
    // refetchInterval: 30000
  })

  const toggleSelection = (orderId: number) => {
    let updatedSelection
    if (selectedOrders.some(selectedOrder => selectedOrder === orderId)) {
      updatedSelection = selectedOrders.filter(selectedOrder => selectedOrder !== orderId)
    } else {
      updatedSelection = [...selectedOrders, orderId]
    }
    setSelectedOrders(updatedSelection)
    onSelectionChange(updatedSelection)
  }

  const onRefresh = async () => {
    console.log('firstddd')

    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  if (isLoading && !refreshing) {
    return <Text>Loading...</Text>
  }

  if (error) {
    return <Text>Error fetching orders</Text>
  }

  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => (
        <MultiSelectOrderItem
          item={item}
          userId={pickerUser?.id}
          isSelected={selectedOrders.some(orderId => orderId === item.id)}
          onSelect={() => toggleSelection(item.id)}
        />
      )}
      keyExtractor={item => item.id.toString()}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} // Añadido para "pull to refresh"
    />
  )
}

export default MultiSelectOrdersList
