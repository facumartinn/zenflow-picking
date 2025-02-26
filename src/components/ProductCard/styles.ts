import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'

export const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  cardContainer: {
    margin: 8,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    marginVertical: 4
  },
  cardContainerNormal: {
    height: 130
  },
  cardContainerIncomplete: {
    height: 160
  },
  contentContainer: {
    flexDirection: 'row',
    height: 110,
    marginBottom: 10
  },
  productImage: {
    backgroundColor: 'transparent',
    width: 90,
    height: 90,
    borderRadius: 12
  },
  productDetails: {
    flex: 1,
    marginLeft: 10,
    position: 'relative',
    height: '100%'
  },
  productName: {
    height: 40,
    fontSize: 12,
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
    fontSize: 12
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
    backgroundColor: Colors.lightYellow2,
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
    backgroundColor: Colors.green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  orderQuantity: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: Colors.white
  },
  orderText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginBottom: 4,
    color: Colors.white
  },
  orderTextIncomplete: {
    fontSize: 12,
    marginBottom: 4,
    color: Colors.black,
    fontFamily: 'Inter_400Regular'
  },
  incompleteText: {
    fontSize: 16,
    marginBottom: 4,
    color: Colors.red,
    fontFamily: 'Inter_400Regular'
  },
  orderNullQuantity: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'Inter_700Bold'
  },
  warningContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4
  },
  warningText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: Colors.mainOrange
  }
})
