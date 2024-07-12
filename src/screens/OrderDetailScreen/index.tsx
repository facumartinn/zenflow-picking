// OrderDetailScreen.tsx
import React from 'react'
import { View, Text, FlatList } from 'react-native'
import { DefaultHeader } from '../../components/DefaultHeader'
import AntDesign from '@expo/vector-icons/AntDesign'
import { navigate } from '../../navigation/NavigationService'
import styles from './styles'
import { RouteProp } from '@react-navigation/native'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import Feather from '@expo/vector-icons/Feather'
import Colors from '../../constants/Colors'
import ProductCard from '../../components/ProductCard'
import { OrderStateEnum } from '../../types/order'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { OrderDetailLoader } from '../../store/OrderLoader'
import { orderDetailsAtom } from '../../store'
import { useAtom } from 'jotai'

interface OrderDetailScreenProps {
  route: RouteProp<
    {
      params: {
        orderId: number
        quantity: number
        stateId: number
      }
    },
    'params'
  >
}

const OrderDetailScreen = ({ route }: OrderDetailScreenProps) => {
  const { orderId, stateId, quantity } = route.params
  const [orderDetails, setOrderDetails] = useAtom(orderDetailsAtom)

  const handleBack = () => {
    setOrderDetails([])
    return stateId === OrderStateEnum.READY_TO_PICK ? navigate('Home') : navigate('CompletedOrderDetail', { orderId, stateId, quantity })
  }

  return (
    <View style={{ flex: 1 }}>
      <OrderDetailLoader orderId={orderId} />
      <DefaultHeader
        title={<Text style={styles.headerTitle}>Detalle pedido</Text>}
        leftIcon={
          <View style={{ borderRadius: 100, backgroundColor: 'white', marginLeft: 10 }}>
            <AntDesign name="arrowleft" size={24} color="black" style={{ padding: 8 }} />
          </View>
        }
        leftAction={handleBack}
      />
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <SimpleLineIcons name="social-dropbox" size={24} color={Colors.grey5} />
          <Text style={styles.title}>Nro Pedido </Text>
          <Text style={styles.value}>{orderId}</Text>
        </View>
        <View style={styles.titleBox}>
          <Feather name="shopping-cart" size={24} color={Colors.grey5} />
          <Text style={styles.title}>Cantidad </Text>
          <Text style={styles.value}>{quantity}</Text>
        </View>
      </View>
      <FlatList data={orderDetails} renderItem={({ item }) => <ProductCard product={item} />} keyExtractor={item => item.product_id.toString()} />
      {stateId === OrderStateEnum.READY_TO_PICK ? (
        <TouchableOpacity style={styles.startPickingButton}>
          <Text style={styles.startPickingText}>INICIAR PICKING</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

export default OrderDetailScreen
