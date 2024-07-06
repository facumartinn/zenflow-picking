import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: Colors.black
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 100
  }
})

export default styles
