// styles.ts
import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16
  },
  header: {
    marginBottom: 16
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
    paddingVertical: 12,
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
  tabTextActive: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.white
  },
  tabTextAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.grey3
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
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 20,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.grey3,
    marginBottom: 8
  },
  orderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  orderText: {
    fontSize: 14,
    marginBottom: 4,
    color: Colors.grey3
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
  }
})
