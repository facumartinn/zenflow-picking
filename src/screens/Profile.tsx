import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { DefaultHeader } from '../components/DefaultHeader'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DefaultModal } from '../components/DefaultModal'
import Colors from '../constants/Colors'
import { router } from 'expo-router'
import { LogOutSvg } from '../components/svg/LogOut'
import { useAuth } from '../context/auth'
import { BackSvg } from '../components/svg/BackSvg'
const ProfileScreen = () => {
  const { pickerUser } = useAuth()

  const [modalVisible, setModalVisible] = useState(false)

  const handleSecondaryAction = () => {
    // Acción del botón secundario
    setModalVisible(false)
  }

  const handlePickerLogout = async () => {
    await AsyncStorage.removeItem('authPickerToken')
    await AsyncStorage.removeItem('pickerId')
    router.push('/picker-login')
    setModalVisible(false)
  }
  return (
    <View style={styles.container}>
      <View>
        <DefaultHeader title="Perfil" leftIcon={<BackSvg width={30} height={30} color="black" />} leftAction={() => router.back()} />
      </View>
      <View style={{ marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={{
            uri: 'https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg'
          }}
          style={styles.logo}
        />
        <Text style={{ marginTop: 20, fontSize: 24, fontFamily: 'Inter_700Bold' }}>{pickerUser?.name}</Text>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: '100%' }}>
          <View style={{ width: '50%', padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 32, fontFamily: 'Inter_700Bold' }}>1234</Text>
            <Text style={{ fontSize: 20, textAlign: 'center' }}>Código de acceso</Text>
          </View>
          <View style={{ width: '50%', padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 32, fontFamily: 'Inter_700Bold' }}>55min</Text>
            <Text style={{ fontSize: 20, textAlign: 'center' }}>Velocidad de picking</Text>
          </View>
        </View>
      </View>
      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}
          onPress={() => setModalVisible(true)}
        >
          <LogOutSvg width={24} height={24} color="black" />
          <Text style={{ fontSize: 16, marginLeft: 10 }}>Cerrar sesion</Text>
        </TouchableOpacity>
      </View>

      <DefaultModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="¿Cerrar sesión?"
        primaryButtonText="CERRAR SESIÓN"
        primaryButtonAction={handlePickerLogout}
        secondaryButtonText="ATRÁS"
        primaryButtonColor={Colors.mainBlue}
        secondaryButtonAction={handleSecondaryAction}
      />
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.black
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between'
    // paddingTop: 20
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 100
  }
})
