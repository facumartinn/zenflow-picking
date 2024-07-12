import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'

export const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.black
  },
  positionContainer: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center'
  },
  leftContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row'
  },
  positionLabelContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: Colors.grey1,
    padding: 8,
    borderRadius: 8,
    marginBottom: 8
  },
  positionLabel: {
    fontSize: 16,
    color: Colors.grey5
  },
  position: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },
  detailBox: {
    flex: 1,
    marginHorizontal: 26
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4
  },
  detailType: {
    fontSize: 14,
    color: Colors.grey5
  },
  detailQuantity: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconContainer: {
    backgroundColor: Colors.grey1,
    padding: 8,
    borderRadius: 100
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8
  }
})