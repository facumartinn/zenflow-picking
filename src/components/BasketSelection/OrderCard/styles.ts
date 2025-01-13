import { StyleSheet } from 'react-native'
import Colors from '../../../constants/Colors'

export const styles = StyleSheet.create({
  orderItem: {
    height: 100,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.lightOrange,
    marginBottom: 12,
    backgroundColor: Colors.white
  },
  orderItemReady: {
    height: 120
  },
  incompleteOrder: {
    borderColor: '#FFCC33',
    height: 120
  },
  readyOrder: {
    borderColor: Colors.green,
    height: 120
  },
  orderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  orderBox: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.grey1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  orderLabel: {
    fontSize: 14,
    color: Colors.grey5,
    marginBottom: 4,
    fontFamily: 'Inter_400Regular'
  },
  orderNumber: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'Inter_700Bold'
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center'
  },
  readyStatusText: {
    color: Colors.green
  },
  pendingStatusText: {
    color: Colors.orange
  }
})
