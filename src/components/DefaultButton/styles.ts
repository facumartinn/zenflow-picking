import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'

export const styles = StyleSheet.create({
  primary: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 50,
    backgroundColor: Colors.mainBlue,
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Inter_700Bold'
  },
  secondary: {
    height: 43,
    padding: 16,
    borderRadius: 50,
    borderWidth: 2,
    backgroundColor: Colors.white,
    color: Colors.mainBlue,
    fontSize: 16,
    fontFamily: 'Inter_400Regular'
  },
  buttonLabel: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Inter_700Bold'
  }
})
