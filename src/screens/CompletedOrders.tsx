import React from 'react'
import { View, Text, FlatList, Button } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getFilteredOrders } from '../services/order'
import { Order, OrderStateEnum } from '../types/order'
import { router } from 'expo-router'

const CompletedOrdersScreen = () => {
  const {
    data: orders = [],
    isLoading,
    error
  } = useQuery<Order[]>({
    queryKey: ['completedOrders'],
    queryFn: () => getFilteredOrders({ stateId: [OrderStateEnum.FINISHED, OrderStateEnum.DELETED] }),
    refetchInterval: 30000 // Refetch cada 30 segundos
  })

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View>
        <Text>Error fetching orders</Text>
      </View>
    )
  }

  return (
    <View>
      <Text>Pedidos Finalizados</Text>
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <View>
            <Text>{item?.id}</Text>
            <Text>{item?.amount}</Text>
            <Button title="Detalles" onPress={() => router.navigate({ pathname: '/order-detail', params: { orderId: item.id } })} />
          </View>
        )}
        keyExtractor={item => item?.id?.toString()}
      />
    </View>
  )
}

export default CompletedOrdersScreen
