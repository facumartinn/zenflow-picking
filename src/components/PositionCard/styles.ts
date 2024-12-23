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
    fontFamily: 'Inter_700Bold',
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
    color: Colors.grey5,
    fontFamily: 'Inter_400Regular'
  },
  position: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Inter_700Bold'
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
    fontSize: 16,
    color: Colors.grey5,
    fontFamily: 'Inter_400Regular'
  },
  detailQuantity: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold'
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconContainer: {
    backgroundColor: Colors.grey1,
    padding: 6,
    borderRadius: 100
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100
  },
  noResourcesText: {
    textAlign: 'center',
    color: Colors.grey5,
    padding: 20,
    fontSize: 16,
    fontFamily: 'Inter_400Regular'
  },
  iconContainerDisabled: {
    opacity: 0.5
  }
})
