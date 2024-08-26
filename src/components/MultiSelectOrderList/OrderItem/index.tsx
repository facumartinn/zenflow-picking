import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Order, OrderStateEnum, PickingStateEnum } from '../../../types/order'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import Colors from '../../../constants/Colors'
import { formatTime } from '../../../utils/queryParams'

interface MultiSelectOrderItemProps {
  item: Order
  userId: number | undefined
  isSelected: boolean
  onSelect: () => void
}

const MultiSelectOrderItem: React.FC<MultiSelectOrderItemProps> = ({ item, userId, isSelected, onSelect }) => {
  const getQuantity = () => item?.OrderDetails?.reduce((acc, curr) => acc + (curr.quantity || 0), 0)
  const getPickedQuantity = () => item?.OrderDetails?.reduce((acc, curr) => acc + (curr.quantityPicked || 0), 0)

  return (
    <TouchableOpacity style={[styles.orderItem, isSelected && styles.selectedOrderItem]} onPress={onSelect}>
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

const styles = StyleSheet.create({
  orderContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18
  },
  orderItem: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.grey3,
    marginBottom: 12,
    backgroundColor: 'white'
  },
  selectedOrderItem: {
    backgroundColor: Colors.lightGreen,
    borderColor: Colors.green
  },
  profilePicture: {
    width: 25,
    height: 25,
    borderRadius: 20
  },
  order: {
    marginLeft: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  orderQuantityBox: {
    backgroundColor: Colors.grey1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  orderBox: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  orderText: {
    fontSize: 18,
    marginBottom: 4,
    fontFamily: 'Inter_400Regular',
    color: Colors.grey5
  },
  orderTextIncomplete: {
    fontSize: 18,
    marginBottom: 4,
    fontFamily: 'Inter_400Regular',
    color: Colors.white
  },
  orderNumber: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  },
  orderQuantity: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  },
  orderQuantityIncompleteBox: {
    backgroundColor: Colors.red,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  orderQuantityIncomplete: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.white
  },
  orderTotalQuantityIncomplete: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.white
  },
  incompleteQuantityNumber: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.white
  }
})

export default MultiSelectOrderItem
