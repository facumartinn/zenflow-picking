import React, { useState, useCallback } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { DefaultHeader } from '../components/DefaultHeader'
import Colors from '../constants/Colors'
import { router, useFocusEffect } from 'expo-router'
import MultiSelectOrdersList from '../components/MultiSelectOrderList'
import BottomButton from '../components/BottomButton'
import { createFlow } from '../services/flow'
import { useAtom } from 'jotai'
import { flowAtom, flowOrderDetailsAtom } from '../store'
import { FlowData, FlowResponse, FlowTypeEnum } from '../types/flow'
import { useAuth } from '../context/auth'
import { BackSvg } from '../components/svg/BackSvg'

const MultiOrderSelectionScreen = () => {
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])
  const [shouldRefreshOrders, setShouldRefreshOrders] = useState(false)
  const { pickerUser } = useAuth()
  const [, setFlow] = useAtom(flowAtom)
  const [, setFlowOrderDetails] = useAtom(flowOrderDetailsAtom)

  useFocusEffect(
    useCallback(() => {
      setShouldRefreshOrders(true)
      return () => {
        setShouldRefreshOrders(false)
      }
    }, [])
  )

  const handleSelectionChange = (selectedOrders: number[]) => {
    setSelectedOrders(selectedOrders)
  }

  const handleNext = async () => {
    try {
      if (pickerUser) {
        const flowData: FlowData = {
          flowTypeId: FlowTypeEnum.MULTI_PICKING,
          userId: pickerUser.id,
          orderIds: selectedOrders
        }
        const response: FlowResponse = await createFlow(flowData)
        setFlow(response.flow)
        setFlowOrderDetails(response.orderDetails)
        router.push('/basket-selection')
      }
    } catch (error) {
      console.error('Error creating flow:', error)
      Alert.alert('Error', 'Failed to create flow.')
    }
  }

  return (
    <View style={styles.container}>
      <DefaultHeader title="Picking múltiple" leftIcon={<BackSvg width={30} height={30} color="black" />} leftAction={() => router.back()} />
      <View style={styles.bodyContainer}>
        <MultiSelectOrdersList selectedTab={'pending'} onSelectionChange={handleSelectionChange} shouldRefreshOrders={shouldRefreshOrders} />
      </View>
      {selectedOrders.length > 0 && <BottomButton text="CONTINUAR" onPress={handleNext} />}
    </View>
  )
}

export default MultiOrderSelectionScreen

const styles = StyleSheet.create({
  container: {
    // paddingTop: 20,
    flex: 1
  },
  scrollContainer: {
    paddingBottom: 80
  },
  bodyContainer: {
    paddingTop: 30,
    paddingHorizontal: 16,
    flex: 1
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.black
  },
  screenTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.black,
    marginBottom: 16
  },
  bottomText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.grey5
  }
})
