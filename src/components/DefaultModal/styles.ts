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
    marginBottom: 10
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.grey4
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
    fontWeight: 'bold'
  },
  secondaryButton: {
    width: '100%',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center'
  },
  secondaryButtonText: {
    fontWeight: 'bold',
    color: Colors.black
  }
})
