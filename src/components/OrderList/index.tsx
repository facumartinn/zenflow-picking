import React, { useState } from 'react'
import { Text, FlatList, RefreshControl, View } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getFilteredOrders } from '../../services/order'
import OrderItem from './OrderItem'
import { Order, OrderStateEnum } from '../../types/order'
import { useAtom } from 'jotai'
import { orderTotalsAtom, warehousesAtom } from '../../store'
import { styles } from './styles'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import EmptyState from '../EmptyState'
import OrderListSkeleton from '../OrderListSkeleton'
import { useAuth } from '../../context/auth'

interface OrdersListProps {
  selectedTab: 'pending' | 'completed'
}

interface GroupedOrders {
  date: string
  schedules: {
    schedule: number
    orders: Order[]
  }[]
}

const OrdersList: React.FC<OrdersListProps> = ({ selectedTab }) => {
  const { pickerUser } = useAuth()
  const [warehouseConfig] = useAtom(warehousesAtom)
  const [, setOrderTotals] = useAtom(orderTotalsAtom)
  const [refreshing, setRefreshing] = useState(false)
  const stateId =
    selectedTab === 'pending' ? [OrderStateEnum.NEW, OrderStateEnum.READY_TO_PICK, OrderStateEnum.SCHEDULED] : [OrderStateEnum.FINISHED, OrderStateEnum.DELETED]

  const {
    data: orders = [],
    isLoading,
    error,
    refetch
  } = useQuery<Order[]>({
    queryKey: ['orders', stateId],
    queryFn: async () => {
      const filters = {
        stateId,
        ...(pickerUser?.id ? { userId: pickerUser.id } : {})
      }
      const orders = await getFilteredOrders(filters)
      setOrderTotals(prev => ({
        ...prev,
        [selectedTab]: orders.length
      }))
      return orders
    }
  })

  const groupOrdersByDateAndSchedule = (orders: Order[]): GroupedOrders[] => {
    const grouped = orders.reduce((acc: { [key: string]: { [key: number]: Order[] } }, order) => {
      if (!order.assembly_date) return acc

      const orderDate = new Date(order.assembly_date)
      const year = orderDate.getUTCFullYear()
      const month = String(orderDate.getUTCMonth() + 1).padStart(2, '0')
      const day = String(orderDate.getUTCDate()).padStart(2, '0')
      const date = `${year}-${month}-${day}`
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

  const firstShowPickerOrdersThenTheRest = orders
    .filter(order => order.user_id === pickerUser?.id)
    .concat(orders.filter(order => order.user_id !== pickerUser?.id))

  const groupedOrders = groupOrdersByDateAndSchedule(firstShowPickerOrdersThenTheRest)

  const formatSchedule = (schedule: number) => {
    if (warehouseConfig.use_shifts.status && warehouseConfig.use_shifts.shifts) {
      const shift = warehouseConfig.use_shifts.shifts.find(s => s.id === schedule)
      if (shift) {
        return `Turno de ${shift.start_time} a ${shift.end_time}`
      }
    }

    // Fallback para cuando no hay turnos configurados
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
    const [year, month, day] = item.date.split('-').map(Number)
    const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
    const formattedDate = format(date, "EEEE, d 'de' MMMM", { locale: es })
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

    return (
      <View style={styles.dateSection}>
        <Text style={styles.dateTitle}>{capitalizedDate}</Text>
        {item.schedules.map(schedule => (
          <View key={schedule.schedule}>
            <Text style={styles.scheduleTitle}>{formatSchedule(schedule.schedule)}</Text>
            {schedule.orders.map((order, index) => (
              <OrderItem key={`${order.id}-${index}`} item={order} selectedTab={selectedTab} />
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

  if (isLoading && !refreshing) {
    return <OrderListSkeleton />
  }

  if (error) {
    return <Text>Error fetching orders</Text>
  }

  if (orders.length === 0) {
    return <EmptyState />
  }

  return (
    <FlatList
      data={groupedOrders}
      renderItem={renderDateSection}
      keyExtractor={item => item.date}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  )
}

export default OrdersList
