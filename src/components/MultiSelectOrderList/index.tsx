import React, { useState, useEffect } from 'react'
import { Text, FlatList, RefreshControl, View, ActivityIndicator } from 'react-native'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getFilteredOrders } from '../../services/order'
import { Order, OrderStateEnum, FilteredOrdersResponse } from '../../types/order'
import { useAtom } from 'jotai'
import { warehousesAtom } from '../../store'
import MultiSelectOrderItem from './OrderItem'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { styles } from '../OrderList/styles'
import MultiSelectOrderListSkeleton from '../MultiSelectOrderListSkeleton'
import { useAuth } from '../../context/auth'

// Estilos adicionales para el footer
const additionalStyles = {
  footerLoader: {
    marginVertical: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'row' as const
  },
  loadingMoreText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Poppins-Regular'
  }
}

interface MultiSelectOrdersListProps {
  selectedTab: 'pending' | 'completed'
  onSelectionChange: (selectedOrders: number[]) => void
  shouldRefreshOrders?: boolean
}

interface GroupedOrders {
  date: string
  schedules: {
    schedule: number
    orders: Order[]
  }[]
}

const MultiSelectOrdersList: React.FC<MultiSelectOrdersListProps> = ({ selectedTab, onSelectionChange, shouldRefreshOrders = false }) => {
  const { pickerUser } = useAuth()
  const [warehouseConfig] = useAtom(warehousesAtom)
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const stateId = selectedTab === 'pending' ? [OrderStateEnum.READY_TO_PICK] : [OrderStateEnum.FINISHED]

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery<FilteredOrdersResponse>({
    queryKey: ['orders', stateId],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const filters = {
          stateId,
          userId: pickerUser?.id,
          includeDetails: true,
          page: pageParam as number,
          limit: 20
        }
        const response = await getFilteredOrders(filters)
        return response
      } catch (error) {
        console.error('Error fetching orders:', error)
        return { orders: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } }
      }
    },
    getNextPageParam: lastPage => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1
      }
      return undefined
    },
    initialPageParam: 1
  })

  // Extraer todas las órdenes de todas las páginas
  const orders = data?.pages.flatMap(page => page.orders) || []

  useEffect(() => {
    if (shouldRefreshOrders) {
      refetch()
    }
  }, [shouldRefreshOrders, refetch])

  const groupOrdersByDateAndSchedule = (orders: Order[]): GroupedOrders[] => {
    const grouped = orders.reduce((acc: { [key: string]: { [key: number]: Order[] } }, order) => {
      if (!order.assembly_date) return acc

      const date = format(new Date(order.assembly_date), 'yyyy-MM-dd')
      const schedule = order.assembly_schedule || 1

      if (!acc[date]) {
        acc[date] = {}
      }
      if (!acc[date][schedule]) {
        acc[date][schedule] = []
      }
      acc[date][schedule].push(order)
      return acc
    }, {})

    return Object.entries(grouped)
      .map(([date, schedules]) => ({
        date,
        schedules: Object.entries(schedules).map(([schedule, orders]) => ({
          schedule: parseInt(schedule),
          orders: orders.sort((a, b) => a.id - b.id)
        }))
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  // Asegurarse de que orders sea siempre un array
  const ordersArray = Array.isArray(orders) ? orders : []

  // Filtrar y ordenar las órdenes de manera segura
  let firstShowPickerOrdersThenTheRest: Order[] = []

  try {
    const pickerOrders = ordersArray.filter(order => order && order.user_id === pickerUser?.id)
    const otherOrders = ordersArray.filter(order => order && order.user_id !== pickerUser?.id)
    firstShowPickerOrdersThenTheRest = [...pickerOrders, ...otherOrders]
  } catch (error) {
    console.error('Error processing orders:', error)
    firstShowPickerOrdersThenTheRest = ordersArray
  }

  const groupedOrders = groupOrdersByDateAndSchedule(firstShowPickerOrdersThenTheRest)

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

  const formatSchedule = (schedule: number) => {
    if (warehouseConfig.use_shifts.status && warehouseConfig.use_shifts.shifts) {
      const shift = warehouseConfig.use_shifts.shifts.find(s => s.id === schedule)
      if (shift) {
        return `Turno de ${shift.start_time} a ${shift.end_time}`
      }
    }

    switch (schedule) {
      case 1:
        return 'Turno de 9:00 a 11:00'
      case 2:
        return 'Turno de 11:00 a 13:00'
      default:
        return `Turno ${schedule}`
    }
  }

  const renderDateSection = ({ item }: { item: GroupedOrders }) => {
    const formattedDate = format(new Date(item.date), "EEEE, d 'de' MMMM", { locale: es })
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

    return (
      <View style={styles.dateSection}>
        <Text style={styles.dateTitle}>{capitalizedDate}</Text>
        {item.schedules.map(schedule => (
          <View key={schedule.schedule}>
            <Text style={styles.scheduleTitle}>{formatSchedule(schedule.schedule)}</Text>
            {schedule.orders.map(order => (
              <MultiSelectOrderItem
                key={order.id}
                item={order}
                selectedTab={selectedTab}
                isSelected={selectedOrders.includes(order.id)}
                onSelect={() => toggleSelection(order.id)}
              />
            ))}
          </View>
        ))}
      </View>
    )
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const renderFooter = () => {
    if (!isFetchingNextPage) return null
    return (
      <View style={additionalStyles.footerLoader}>
        <ActivityIndicator size="small" />
        <Text style={additionalStyles.loadingMoreText}>Cargando más órdenes...</Text>
      </View>
    )
  }

  if (isLoading && !refreshing) {
    return <MultiSelectOrderListSkeleton />
  }

  if (error) {
    return <Text>Error fetching orders</Text>
  }

  return (
    <FlatList
      data={groupedOrders}
      renderItem={renderDateSection}
      keyExtractor={item => item.date}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  )
}

export default MultiSelectOrdersList
