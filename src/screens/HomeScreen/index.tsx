/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import { getFilteredOrders } from '../../services/order'
import { useQuery } from '@tanstack/react-query'
import { OrderStateEnum } from '../../types/order'
import { styles } from './styles'
import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAtom } from 'jotai'
import { isAdminLoggedInAtom } from '../../store'
import { navigate } from '../../navigation/NavigationService'
import { DefaultHeader } from '../../components/DefaultHeader'

const HomeScreen = () => {
  const [, setIsAdminLoggedIn] = useAtom(isAdminLoggedInAtom)
  const [selectedTab, setSelectedTab] = useState<'pending' | 'completed'>('pending')

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken')
    await AsyncStorage.removeItem('tenantId')
    await AsyncStorage.removeItem('warehouseId')

    // Actualizar el átomo de autenticación
    setIsAdminLoggedIn(false)

    // Redirigir al usuario a la pantalla de login
    navigate('AdminLogin')
  }
  const stateId = selectedTab === 'pending' ? OrderStateEnum.READY_TO_PICK : OrderStateEnum.COMPLETED // Define el stateId correspondiente a cada estado

  const {
    data: orders = [],
    isLoading,
    error
  } = useQuery<any[]>({
    queryKey: ['orders', stateId],
    queryFn: () => getFilteredOrders({ stateId: [stateId] }),
    refetchInterval: 30000 // Refetch cada 30 segundos
  })
  const renderOrderItem = ({ item }: any) => (
    <View style={styles.orderItem}>
      <View>
        <View style={styles.orderBox}>
          <Feather name="box" size={24} color="black" />
          <Text style={styles.orderText}>Nro pedido</Text>
        </View>
        <Text style={styles.orderNumber}>{item.id}</Text>
      </View>
      <View>
        <Text style={styles.orderText}>Cant.</Text>
        <Text style={styles.orderQuantity}>{item.amount}</Text>
      </View>
      <View>
        <Text style={styles.orderText}>VOS</Text>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <DefaultHeader
          title={
            <Text style={styles.companyName} onPress={handleLogout}>
              Unilever
            </Text>
          }
          leftIcon={
            <Image
              source={{
                uri: 'https://i.pinimg.com/564x/63/73/a2/6373a27fc967248faf8ba9ac82041a97.jpg'
              }}
              style={styles.logo}
            />
          }
          rightIcon={
            <Image
              source={{
                uri: 'https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg'
              }}
              style={styles.profilePicture}
            />
          }
          rightAction={() => navigate('Profile')}
        />
      </View>
      <View style={styles.tabContainer}>
        <View style={styles.tabInsideContainer}>
          <TouchableOpacity style={[styles.tabButton, selectedTab === 'pending' && styles.activeTab]} onPress={() => setSelectedTab('pending')}>
            <Text style={[styles.tabText, selectedTab === 'pending' && styles.tabTextActive]}>Pendientes</Text>
            <Text style={[styles.tabTextAmount, selectedTab === 'pending' && styles.tabTextAmountActive]}>15</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabButton, selectedTab === 'completed' && styles.activeTab]} onPress={() => setSelectedTab('completed')}>
            <Text style={[styles.tabText, selectedTab === 'completed' && styles.tabTextActive]}>Finalizados</Text>
            <Text style={[styles.tabTextAmount, selectedTab === 'completed' && styles.tabTextAmountActive]}>32</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.sectionTitle}>SELECCIÓN MULTIPLE</Text>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error fetching orders</Text>
      ) : (
        <FlatList data={orders} renderItem={renderOrderItem} keyExtractor={item => item.id.toString()} />
      )}
    </View>
  )
}

export default HomeScreen
