import { StyleSheet } from 'react-native'
import Colors from '../../../constants/Colors'

export const styles = StyleSheet.create({
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
    color: Colors.grey5
  },
  orderTextIncomplete: {
    fontSize: 18,
    marginBottom: 4,
    color: Colors.white
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black
  },
  orderQuantity: {
    fontSize: 18,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    color: Colors.white
  },
  orderTotalQuantityIncomplete: {
    fontSize: 16,
    color: Colors.white
  },
  incompleteQuantityNumber: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white
  }
})
