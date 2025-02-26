/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { DefaultHeader } from '../components/DefaultHeader'
import TabSelector from '../components/HomeTabSelector'
import OrdersList from '../components/OrderList'
import Colors from '../constants/Colors'
import { router, useFocusEffect } from 'expo-router'
import { DefaultButton } from '../components/DefaultButton'
import { LogOutSvg } from '../components/svg/LogOut'
import { DefaultModal } from '../components/DefaultModal'
import { useAuth } from '../context/auth'
import { useAtom } from 'jotai'
import { basketsByOrderAtom, packingOrdersAtom } from '../store'

const HomeScreen = () => {
  const { tenantLogo, logoutPicker } = useAuth()
  const [selectedTab, setSelectedTab] = useState<'pending' | 'completed'>('pending')
  const [modalVisible, setModalVisible] = useState(false)
  const [baskets] = useAtom(basketsByOrderAtom)
  const [packingOrders] = useAtom(packingOrdersAtom)
  const [shouldRefreshOrders, setShouldRefreshOrders] = useState(false)

  useFocusEffect(
    useCallback(() => {
      setShouldRefreshOrders(true)
      return () => {
        setShouldRefreshOrders(false)
      }
    }, [])
  )

  const handleMultiPicking = useCallback(() => {
    // Forzamos la navegación usando push en lugar de navigate
    router.push('/multi-picking')
  }, [packingOrders, baskets])

  const handleProfileNavigation = useCallback(() => {
    router.push('/profile')
  }, [])

  const MultiPickingButton = useCallback(() => {
    // Solo mostrar el botón si estamos en la pestaña pending y el usuario es un picker
    if (selectedTab !== 'pending') return null

    return (
      <View style={styles.multiPickingButtonContainer}>
        <DefaultButton type="primary" label="PICKING MÚLTIPLE" onPress={handleMultiPicking} />
      </View>
    )
  }, [selectedTab, handleMultiPicking])

  const handleSecondaryAction = () => {
    setModalVisible(false)
  }

  const handlePickerLogout = async () => {
    try {
      setModalVisible(false)
      await logoutPicker()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <>
      <View style={styles.container}>
        <DefaultHeader
          title="Inicio"
          leftIcon={<Image source={{ uri: tenantLogo ?? '#' }} style={styles.logo} />}
          rightIcon={
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <LogOutSvg width={24} height={24} color="black" />
            </TouchableOpacity>
          }
          rightAction={handleProfileNavigation}
        />
        <View style={styles.bodyContainer}>
          <TabSelector selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          <MultiPickingButton />
          <OrdersList selectedTab={selectedTab} shouldRefreshOrders={shouldRefreshOrders} />
        </View>
      </View>
      <DefaultModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="¿Cerrar sesión?"
        primaryButtonText="CERRAR SESIÓN"
        primaryButtonAction={handlePickerLogout}
        secondaryButtonText="ATRÁS"
        primaryButtonColor={Colors.mainBlue}
        secondaryButtonAction={handleSecondaryAction}
      />
    </>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16
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
    fontFamily: 'Inter_400Regular',
    color: Colors.grey3
  },
  tabTextActive: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.white
  },
  tabTextAmount: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: Colors.grey3
  },
  tabTextAmountActive: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: Colors.white
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
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
    color: Colors.black
  },
  orderQuantity: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  companyName: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: Colors.black
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  multiPickingButtonContainer: {
    marginBottom: 16
  }
})
