import Colors from '../../constants/Colors'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center'
  },
  iconContainer: {
    padding: 5,
    borderRadius: 10,
    backgroundColor: Colors.lightRed,
    marginBottom: 10
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    marginBottom: 10
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.grey4,
    fontFamily: 'Inter_400Regular',
    marginBottom: 10
  },
  subDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.grey5,
    fontFamily: 'Inter_700Bold'
  },
  primaryButton: {
    width: '100%',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10
  },
  primaryButtonText: {
    color: 'white',
    fontFamily: 'Inter_700Bold'
  },
  secondaryButton: {
    width: '100%',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center'
  },
  secondaryButtonText: {
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  }
})
