import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'

export const styles = StyleSheet.create({
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
    width: '100%',
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
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: Colors.grey3
  },
  tabTextActive: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: Colors.white
  },
  tabTextAmount: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.grey3
  },
  tabTextAmountActive: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.white
  }
})
