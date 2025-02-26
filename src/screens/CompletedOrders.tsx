import React, { useState } from 'react'
import { View, Text, FlatList, Button, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getFilteredOrders } from '../services/order'
import { OrderStateEnum, FilteredOrdersResponse } from '../types/order'
import { router } from 'expo-router'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16
  },
  orderItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  orderInfo: {
    flex: 1
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  orderAmount: {
    fontSize: 14,
    color: '#666'
  },
  footerLoader: {
    marginVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  loadingMoreText: {
    marginLeft: 8,
    fontSize: 14
  }
})

const CompletedOrdersScreen = () => {
  const [refreshing, setRefreshing] = useState(false)

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery<FilteredOrdersResponse>({
    queryKey: ['completedOrders'],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await getFilteredOrders({
          stateId: [OrderStateEnum.FINISHED, OrderStateEnum.DELETED],
          page: pageParam as number,
          limit: 20
        })
        return response
      } catch (error) {
        console.error('Error fetching completed orders:', error)
        return { orders: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } }
      }
    },
    getNextPageParam: lastPage => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1
      }
      return undefined
    },
    initialPageParam: 1,
    refetchInterval: 30000 // Refetch cada 30 segundos
  })

  // Extraer todas las órdenes de todas las páginas
  const orders = data?.pages.flatMap(page => page.orders) || []

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  const renderFooter = () => {
    if (!isFetchingNextPage) return null
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" />
        <Text style={styles.loadingMoreText}>Cargando más órdenes...</Text>
      </View>
    )
  }

  if (isLoading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" />
        <Text>Cargando...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Error al cargar los pedidos</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedidos Finalizados</Text>
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderId}>Pedido #{item?.order_tenant_id}</Text>
              <Text style={styles.orderAmount}>${item?.amount.toFixed(2)}</Text>
            </View>
            <Button title="Detalles" onPress={() => router.push({ pathname: '/order-detail', params: { orderId: item.id } })} />
          </View>
        )}
        keyExtractor={item => item?.id?.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  )
}

export default CompletedOrdersScreen
