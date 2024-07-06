import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.grey1,
    flex: 1,
    paddingHorizontal: 16
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  tabContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  tabInsideContainer: {
    backgroundColor: Colors.mainLightBlue2,
    padding: 10,
    borderRadius: 36,
    width: '80%',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    borderRadius: 30,
    borderWidth: 1,
    backgroundColor: Colors.white,
    borderColor: Colors.white
  },
  activeTab: {
    backgroundColor: Colors.mainBlue,
    borderColor: Colors.mainBlue
  },
  tabText: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.grey3
  },
  tabTextAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.grey3
  },
  tabTextActive: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.white
  },
  tabTextAmountActive: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.mainBlue,
    marginTop: 14,
    marginBottom: 14,
    marginLeft: 10
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.grey3,
    backgroundColor: Colors.white,
    marginBottom: 8
  },
  orderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  orderText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.grey5
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black
  },
  orderQuantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black
  },
  selectButton: {
    marginTop: 16,
    backgroundColor: Colors.mainBlue
  }
})
