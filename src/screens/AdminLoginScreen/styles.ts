import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.black
  },
  inputTitle: {
    fontSize: 14,
    marginVertical: 5,
    color: Colors.black,
    fontWeight: '500'
  },
  input: {
    borderColor: Colors.grey3,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16
  },
  button: {
    marginTop: 20,
    backgroundColor: Colors.mainBlue,
    borderRadius: 5
  },
  error: {
    color: Colors.red,
    marginTop: 10
  }
})
