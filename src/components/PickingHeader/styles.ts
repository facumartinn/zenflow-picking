import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'

export const styles = StyleSheet.create({
  container: {
    height: 70,
    width: '100%',
    paddingTop: 30,
    margin: 0,
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  leftColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rightColumn: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    marginLeft: 10,
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: Colors.black
  },
  rightIcon: {
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.mainBlue
  }
})
