import React, { useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { DefaultHeader } from '../components/DefaultHeader'
import { AntDesign } from '@expo/vector-icons'
import Colors from '../constants/Colors'
import { router } from 'expo-router'
import MultiSelectOrdersList from '../components/MultiSelectOrderList'
import BottomButton from '../components/BottomButton'
import { createFlow } from '../services/flow'
import { useAtom } from 'jotai'
import { flowAtom, flowOrderDetailsAtom, userAtom } from '../store'
import { FlowData, FlowResponse, FlowTypeEnum } from '../types/flow'

const MultiOrderSelectionScreen = () => {
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])
  const [pickerUser] = useAtom(userAtom)
  const [, setFlow] = useAtom(flowAtom)
  const [, setFlowOrderDetails] = useAtom(flowOrderDetailsAtom)
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
        router.navigate('/basket-selection')
      }
    } catch (error) {
      console.error('Error creating flow:', error)
      Alert.alert('Error', 'Failed to create flow.')
    }
  }

  return (
    <View style={styles.container}>
      <DefaultHeader
        title={<Text style={styles.headerTitle}>Picking múltiple</Text>}
        leftIcon={
          <View style={{ borderRadius: 100, backgroundColor: 'white', marginLeft: 10 }}>
            <AntDesign name="arrowleft" size={24} color="black" style={{ padding: 8 }} />
          </View>
        }
        leftAction={() => router.navigate('/home')}
      />
      <View style={styles.bodyContainer}>
        <MultiSelectOrdersList selectedTab={'pending'} onSelectionChange={handleSelectionChange} />
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
