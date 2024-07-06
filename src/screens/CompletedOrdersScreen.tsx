import React from 'react'
import { View, Text, FlatList, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { getFilteredOrders } from '../services/order'
import { Order } from '../types/order'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../navigation/types'

type CompletedOrdersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OrderDetail'>

const CompletedOrdersScreen = () => {
  const navigation = useNavigation<CompletedOrdersScreenNavigationProp>()

  const {
    data: orders = [],
    isLoading,
    error
  } = useQuery<Order[]>({
    queryKey: ['completedOrders'],
    queryFn: getFilteredOrders,
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
            <Text>{item.id}</Text>
            <Text>{item.amount}</Text>
            <Button title="Detalles" onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })} />
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  )
}

export default CompletedOrdersScreen
