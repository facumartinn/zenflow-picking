import { StyleSheet } from 'react-native'
import Colors from '../../../constants/Colors'

export const styles = StyleSheet.create({
  orderItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    backgroundColor: Colors.white
  },
  orderItemIncomplete: {
    height: 120,
    borderColor: Colors.mainOrange,
    borderWidth: 1.5
  },
  orderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16
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
  positionContainer: {
    alignItems: 'flex-end',
    backgroundColor: Colors.grey2,
    borderRadius: 12,
    flex: 1,
    width: '50%'
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
    paddingVertical: 4
  },
  warningText: {
    fontSize: 12,
    color: Colors.lightOrange2,
    fontFamily: 'Inter_700Bold'
  }
})
