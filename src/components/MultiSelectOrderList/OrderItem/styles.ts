import { StyleSheet } from 'react-native'
import Colors from '../../../constants/Colors'

export const styles = StyleSheet.create({
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: Colors.white
  },
  selectedOrderItem: {
    borderColor: Colors.green,
    borderWidth: 1.5
  },
  orderItemIncomplete: {
    borderColor: Colors.orange,
    borderWidth: 1
  },
  orderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    gap: 12
  },
  orderBox: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.grey1,
    flexDirection: 'row',
    alignItems: 'center',
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
  positionText: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'Inter_700Bold'
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8
  },
  warningText: {
    fontSize: 14,
    color: Colors.orange,
    fontFamily: 'Inter_400Regular'
  }
})
