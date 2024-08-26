import React from 'react'
import { View, Text, Image } from 'react-native'
import { styles } from './styles'
import { Order, OrderStateEnum, PickingStateEnum } from '../../../types/order'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import { TouchableOpacity } from 'react-native'
import { formatTime } from '../../../utils/queryParams'
import { router } from 'expo-router'

interface OrderItemProps {
  item: Order
  userId: number | undefined
}

const OrderItem: React.FC<OrderItemProps> = ({ item, userId }) => {
  const getQuantity = () => item?.OrderDetails?.reduce((acc, curr) => acc + (curr.quantity || 0), 0)
  const getPickedQuantity = () => item?.OrderDetails?.reduce((acc, curr) => acc + (curr.quantityPicked || 0), 0)
  const orderDetailToNavigate = item.state_id === OrderStateEnum.READY_TO_PICK ? '/order-detail' : '/completed-order-detail'

  return (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() =>
        router.navigate({
          pathname: orderDetailToNavigate,
          params: { orderId: item.id, quantity: item?.OrderDetails?.length, stateId: item.state_id || undefined }
        })
      }
    >
      <View style={styles.orderContainer}>
        <View style={styles.order}>
          <View style={styles.orderBox}>
            <SimpleLineIcons name="social-dropbox" size={20} color="black" />
            <Text style={styles.orderText}>Nro pedido</Text>
          </View>
          <Text style={styles.orderNumber}>000{item.id}</Text>
        </View>
        <View>
          {userId === item.user_id && item.state_id === OrderStateEnum.READY_TO_PICK && (
            <Image
              source={{ uri: 'https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg' }}
              style={styles.profilePicture}
            />
          )}
          {item.state_id === OrderStateEnum.COMPLETED && (
            <View>
              <Text style={styles.orderText}>Entrega</Text>
              <Text style={styles.orderNumber}>{item?.updated_at ? formatTime(item?.updated_at) : '-'}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={item.state_picking_id === PickingStateEnum.COMPLETE ? styles.orderQuantityBox : styles.orderQuantityIncompleteBox}>
        <Text style={item.state_picking_id === PickingStateEnum.COMPLETE ? styles.orderText : styles.orderTextIncomplete}>Cant</Text>
        {item.state_picking_id === PickingStateEnum.COMPLETE ? (
          <Text style={styles.orderQuantity}>{item?.OrderDetails?.length}</Text>
        ) : (
          <View style={styles.incompleteQuantityNumber}>
            <Text style={styles.orderQuantityIncomplete}>{getPickedQuantity()}</Text>
            <Text style={styles.orderTotalQuantityIncomplete}>/{getQuantity()}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default OrderItem
