// styles.ts
import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black
  },
  titleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  title: {
    fontSize: 20,
    marginLeft: 15,
    color: Colors.grey5
  },
  value: {
    fontSize: 20,
    marginLeft: 15,
    fontWeight: 'bold',
    color: Colors.black
  },
  startPickingButton: {
    backgroundColor: Colors.mainBlue,
    padding: 20,
    height: 66,
    alignItems: 'center'
  },
  startPickingText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
})

export default styles
