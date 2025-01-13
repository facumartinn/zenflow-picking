import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'

export const styles = StyleSheet.create({
  tabContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: Colors.grey2
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  activeTab: {
    borderBottomColor: Colors.mainBlue,
    fontFamily: 'Inter_700Bold'
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.grey3
  },
  tabTextActive: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: Colors.mainBlue
  },
  tabTextAmount: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: Colors.grey3
  },
  tabTextAmountActive: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: Colors.mainBlue
  }
})
