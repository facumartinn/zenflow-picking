import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'

export const styles = StyleSheet.create({
  dateSection: {
    marginBottom: 24
  },
  dateTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: Colors.black,
    marginBottom: 8,
    marginTop: 8
  },
  scheduleTitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.black,
    marginBottom: 20
  },
  footerLoader: {
    marginBottom: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'row' as const
  },
  loadingMoreText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Poppins-Regular'
  }
})
