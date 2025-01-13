import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'

export const styles = StyleSheet.create({
  cardContainer: {
    margin: 15,
    height: 130,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    marginVertical: 5
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 2
  },
  productImage: {
    backgroundColor: 'transparent',
    width: 110,
    height: 110,
    borderRadius: 12
  },
  productDetails: {
    flex: 1,
    marginLeft: 10
  },
  productName: {
    height: 44,
    fontSize: 18,
    fontFamily: 'Inter_400Regular'
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5
  },
  infoLabel: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.grey5
  },
  infoValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18
  },
  barcodeContainer: {
    width: '73%',
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
    backgroundColor: Colors.red,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  },
  orderText: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    marginBottom: 4,
    color: Colors.grey5
  },
  orderTextIncomplete: {
    fontSize: 18,
    marginBottom: 4,
    color: Colors.white,
    fontFamily: 'Inter_400Regular'
  }
})
