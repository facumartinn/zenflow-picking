import React from 'react'
import { View, Text, Image } from 'react-native'
import { styles } from './styles'
import { Order, OrderStateEnum } from '../../../types/order'
import { TouchableOpacity } from 'react-native'
import { formatTime } from '../../../utils/queryParams'
import { router } from 'expo-router'
import { BoxDetailSvg } from '../../svg/BoxDetail'
import Colors from '../../../constants/Colors'

interface OrderItemProps {
  item: Order
  userId: number | undefined
}

const OrderItem: React.FC<OrderItemProps> = ({ item, userId }) => {
  const getQuantity = () => item?.OrderDetails?.reduce((acc, curr) => acc + (curr.quantity || 0), 0)
  const getPickedQuantity = () => item?.OrderDetails?.reduce((acc, curr) => acc + (curr.quantity_picked || 0), 0)
  const orderDetailToNavigate = item.state_id === OrderStateEnum.READY_TO_PICK ? '/order-detail' : '/completed-order-detail'

  return (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() =>
        router.navigate({
          pathname: orderDetailToNavigate,
          params: {
            orderId: item.id,
            quantity: item.state_id && item.state_id < OrderStateEnum.FINISHED ? getQuantity() : getPickedQuantity(),
            stateId: item.state_id || undefined
          }
        })
      }
    >
      <View style={styles.orderContainer}>
        <View style={styles.order}>
          <View style={styles.orderBox}>
            <BoxDetailSvg width={25} height={25} color={Colors.grey5} />
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
          {item.state_id === OrderStateEnum.FINISHED && (
            <View>
              <Text style={styles.orderText}>Entrega</Text>
              <Text style={styles.orderNumber}>{item?.updated_at ? formatTime(item?.updated_at) : '-'}</Text>
            </View>
          )}
        </View>
      </View>
      {item.state_id === OrderStateEnum.FINISHED ? (
        <View style={styles.orderQuantityBox}>
          <Text style={styles.orderText}>Cant</Text>
          <Text style={styles.orderQuantity}>{item?.OrderDetails?.length}</Text>
        </View>
      ) : (
        <View style={item.state_picking_id === null ? styles.orderQuantityBox : styles.orderQuantityIncompleteBox}>
          <Text style={item.state_picking_id === null ? styles.orderText : styles.orderTextIncomplete}>Cant</Text>
          {item.state_picking_id === null ? (
            <Text style={styles.orderQuantity}>{item?.OrderDetails?.length}</Text>
          ) : (
            <View style={styles.incompleteQuantityNumber}>
              <Text style={styles.orderQuantityIncomplete}>{getPickedQuantity()}</Text>
              <Text style={styles.orderTotalQuantityIncomplete}>/{getQuantity()}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  )
}

export default OrderItem
