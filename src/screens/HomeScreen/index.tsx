/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { View, Text, Image } from 'react-native'
import { styles } from './styles'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAtom } from 'jotai'
import { isAdminLoggedInAtom } from '../../store'
import { navigate } from '../../navigation/NavigationService'
import { DefaultHeader } from '../../components/DefaultHeader'
import TabSelector from '../../components/HomeTabSelector'
import OrdersList from '../../components/OrderList'

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
      <TabSelector selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <Text style={styles.sectionTitle}>SELECCIÓN MULTIPLE</Text>
      <OrdersList selectedTab={selectedTab} />
    </View>
  )
}

export default HomeScreen
