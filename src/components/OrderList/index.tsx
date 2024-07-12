import React from 'react'
import { Text, FlatList } from 'react-native'
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
  const stateId = selectedTab === 'pending' ? OrderStateEnum.READY_TO_PICK : OrderStateEnum.COMPLETED
  const {
    data: orders = [],
    isLoading,
    error
  } = useQuery<Order[]>({
    queryKey: ['orders', stateId],
    queryFn: () => getFilteredOrders({ stateId: [stateId], includeDetails: true }),
    refetchInterval: 30000
  })

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  if (error) {
    return <Text>Error fetching orders</Text>
  }

  return <FlatList data={orders} renderItem={({ item }) => <OrderItem item={item} userId={pickerUser?.id} />} keyExtractor={item => item.id.toString()} />
}

export default OrdersList
