import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'

export const styles = StyleSheet.create({
  cardContainer: {
    margin: 15,
    height: 130,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    marginVertical: 5
  },
  productImage: {
    backgroundColor: 'transparent',
    width: 90,
    height: 90,
    borderRadius: 12
  },
  productDetails: {
    flex: 1,
    marginLeft: 10
  },
  productName: {
    height: 40,
    fontSize: 14,
    fontFamily: 'Inter_400Regular'
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.grey5
  },
  infoValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14
  },
  barcodeContainer: {
    width: '70%',
    padding: 8,
    backgroundColor: Colors.grey1,
    borderRadius: 10
  },
  quantityContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '20%',
    padding: 5,
    backgroundColor: Colors.grey1,
    borderRadius: 12
  },
  orderQuantityIncompleteBox: {
    backgroundColor: Colors.yellow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  orderQuantityIncomplete: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  },
  orderTotalQuantityIncomplete: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.black
  },
  incompleteQuantityNumber: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  },
  orderQuantityBox: {
    backgroundColor: Colors.grey1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  orderQuantity: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  },
  orderText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginBottom: 4,
    color: Colors.grey5
  },
  orderTextIncomplete: {
    fontSize: 16,
    marginBottom: 4,
    color: Colors.black,
    fontFamily: 'Inter_400Regular'
  }
})
