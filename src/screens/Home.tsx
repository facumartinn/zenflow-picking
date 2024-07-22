/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAtom } from 'jotai'
import { isAdminLoggedInAtom } from '../store'
import { DefaultHeader } from '../components/DefaultHeader'
import TabSelector from '../components/HomeTabSelector'
import OrdersList from '../components/OrderList'
import Colors from '../constants/Colors'
import { router } from 'expo-router'

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
    router.navigate('/admin-login')
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
          rightAction={() => router.navigate('/profile')}
        />
      </View>
      <TabSelector selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <Text style={styles.sectionTitle}>SELECCIÓN MULTIPLE</Text>
      <OrdersList selectedTab={selectedTab} />
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16
  },
  header: {
    marginBottom: 16
  },
  tabContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  tabInsideContainer: {
    backgroundColor: Colors.mainLightBlue2,
    padding: 10,
    borderRadius: 36,
    width: '80%',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    backgroundColor: Colors.white,
    borderColor: Colors.white
  },
  activeTab: {
    backgroundColor: Colors.mainBlue,
    borderColor: Colors.mainBlue
  },
  tabText: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.grey3
  },
  tabTextActive: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.white
  },
  tabTextAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.grey3
  },
  tabTextAmountActive: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.mainBlue,
    marginTop: 14,
    marginBottom: 14,
    marginLeft: 10
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 20,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.grey3,
    marginBottom: 8
  },
  orderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  orderText: {
    fontSize: 14,
    marginBottom: 4,
    color: Colors.grey3
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black
  },
  orderQuantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20
  }
})
