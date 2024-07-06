import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.grey1
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
    borderRadius: 190
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.black
  },
  subtitle: {
    fontSize: 12,
    marginVertical: 20,
    color: '#4A4D4F'
  },
  input: {
    borderColor: Colors.grey3,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: '80%',
    marginBottom: 20,
    textAlign: 'center'
  },
  button: {
    backgroundColor: Colors.mainBlue,
    borderRadius: 5
  },
  root: {
    flex: 1,
    padding: 20
  },
  codeFieldRoot: {
    marginTop: 20
  },
  cell: {
    width: 40,
    height: 48,
    lineHeight: 45,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#B7B7B7',
    textAlign: 'center',
    marginRight: 10,
    borderRadius: 10
  },
  focusCell: {
    borderColor: '#2D41FC'
  }
})

export default styles
