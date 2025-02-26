import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'

export const styles = StyleSheet.create({
  container: {
    height: 80,
    width: '100%',
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  leftColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100
  },
  middleColumn: {
    flex: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rightColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.black
  }
})
