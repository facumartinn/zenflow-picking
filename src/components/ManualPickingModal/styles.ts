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
    width: '85%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.black,
    marginBottom: 10
  },
  description: {
    fontSize: 14,
    width: '80%',
    fontFamily: 'Inter_400Regular',
    color: Colors.grey5,
    marginBottom: 20,
    textAlign: 'center'
  },
  confirmButton: {
    backgroundColor: Colors.mainBlue,
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 20,
    marginBottom: 10
  },
  confirmButtonText: {
    color: Colors.white,
    fontFamily: 'Inter_700Bold',
    fontSize: 16
  },
  cancelButton: {
    marginVertical: 10
  },
  cancelButtonText: {
    color: Colors.black,
    fontFamily: 'Inter_700Bold',
    fontSize: 16
  }
})
