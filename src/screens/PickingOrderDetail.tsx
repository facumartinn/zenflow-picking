import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Colors from '../constants/Colors'
import { AntDesign } from '@expo/vector-icons'
import { DefaultHeader } from '../components/DefaultHeader'

const PickingOrderDetailScreen = () => {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <View style={styles.topBodyContainer}>
        <DefaultHeader
          title={<Text style={styles.headerTitle}>Pedidos</Text>}
          leftIcon={
            <View style={{ borderRadius: 100, backgroundColor: 'white', marginLeft: 10 }}>
              <AntDesign name="arrowleft" size={24} color="black" style={{ padding: 8 }} />
            </View>
          }
          leftAction={() => router.back()}
          rightIcon={null}
        />
      </View>
      <View style={styles.bodyContainer}>
        {/* Aquí puedes agregar el contenido de la pantalla de detalles del pedido */}
        <Text>Contenido del detalle del pedido</Text>
      </View>
    </View>
  )
}

export default PickingOrderDetailScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: Colors.grey1
  },
  topBodyContainer: {
    height: 80,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  bodyContainer: {
    marginTop: 20,
    paddingHorizontal: 16
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.black
  }
})
