import React, { useState } from 'react'
import { Text, FlatList, RefreshControl, View } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getFilteredOrders } from '../../services/order'
import { Order, OrderStateEnum } from '../../types/order'
import { useAtom } from 'jotai'
import { userAtom, warehousesAtom } from '../../store'
import MultiSelectOrderItem from './OrderItem'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { styles } from '../OrderList/styles'

interface MultiSelectOrdersListProps {
  selectedTab: 'pending' | 'completed'
  onSelectionChange: (selectedOrders: number[]) => void
}

interface GroupedOrders {
  date: string
  schedules: {
    schedule: number
    orders: Order[]
  }[]
}

const MultiSelectOrdersList: React.FC<MultiSelectOrdersListProps> = ({ selectedTab, onSelectionChange }) => {
  const [pickerUser] = useAtom(userAtom)
  const [warehouseConfig] = useAtom(warehousesAtom)
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const stateId = selectedTab === 'pending' ? [OrderStateEnum.READY_TO_PICK] : [OrderStateEnum.FINISHED]

  const {
    data: orders = [],
    isLoading,
    error,
    refetch
  } = useQuery<Order[]>({
    queryKey: ['orders', stateId],
    queryFn: () => getFilteredOrders({ stateId: stateId, userId: pickerUser?.id, includeDetails: true })
  })

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

  const firstShowPickerOrdersThenTheRest = orders
    .filter(order => order.user_id === pickerUser?.id)
    .concat(orders.filter(order => order.user_id !== pickerUser?.id))

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

  if (isLoading && !refreshing) {
    return <Text>Loading...</Text>
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
    />
  )
}

export default MultiSelectOrdersList
