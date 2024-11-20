import React, { useState } from 'react'
import { Text, FlatList, RefreshControl } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getFilteredOrders } from '../../services/order'
import OrderItem from './OrderItem'
import { Order, OrderStateEnum } from '../../types/order'
import { useAtom } from 'jotai'
import { userAtom } from '../../store'

interface OrdersListProps {
  selectedTab: 'pending' | 'completed'
}

const OrdersList: React.FC<OrdersListProps> = ({ selectedTab }) => {
  const [pickerUser] = useAtom(userAtom)
  const [refreshing, setRefreshing] = useState(false)
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
  const firstShowPickerOrdersThenTheRest = orders
    .filter(order => order.user_id === pickerUser?.id)
    .concat(orders.filter(order => order.user_id !== pickerUser?.id))

  const onRefresh = async () => {
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
      data={firstShowPickerOrdersThenTheRest}
      renderItem={({ item }) => <OrderItem item={item} userId={pickerUser?.id} />}
      keyExtractor={item => item.id.toString()}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} // Añadido para "pull to refresh"
    />
  )
}

export default OrdersList
