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
  enterDetailScreen: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    backgroundColor: Colors.mainBlue,
    marginVertical: 10,
    marginHorizontal: 30,
    height: 66,
    borderRadius: 50
  },
  startPickingText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  downloadDetailScreen: {
    marginTop: 10
  },
  downloadDetailText: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: 16
  }
})

export default styles
