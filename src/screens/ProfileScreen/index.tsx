import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'
import { DefaultHeader } from '../../components/DefaultHeader'
import styles from './styles'
import { navigate } from '../../navigation/NavigationService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DefaultModal } from '../../components/DefaultModal'
import Colors from '../../constants/Colors'
import { useAtom } from 'jotai'
import { userAtom } from '../../store'
import { Feather } from '@expo/vector-icons'

const ProfileScreen = () => {
  const [pickerUser] = useAtom(userAtom)

  const [modalVisible, setModalVisible] = useState(false)

  const handleSecondaryAction = () => {
    // Acción del botón secundario
    setModalVisible(false)
  }

  const handlePickerLogout = async () => {
    await AsyncStorage.removeItem('authPickerToken')
    await AsyncStorage.removeItem('pickerId')
    navigate('PickerLogin')
    setModalVisible(false)
  }
  return (
    <View style={styles.container}>
      <View>
        <DefaultHeader
          title={<Text style={styles.headerTitle}>Perfil</Text>}
          leftIcon={
            <View style={{ borderRadius: 100, backgroundColor: 'white', marginLeft: 10 }}>
              <AntDesign name="arrowleft" size={24} color="black" style={{ padding: 8 }} />
            </View>
          }
          leftAction={() => navigate('Home')}
        />
      </View>
      <View style={{ marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={{
            uri: 'https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg'
          }}
          style={styles.logo}
        />
        <Text style={{ marginTop: 20, fontSize: 24, fontWeight: 'bold' }}>{pickerUser?.name}</Text>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: '100%' }}>
          <View style={{ width: '50%', padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 32, fontWeight: 'bold' }}>1234</Text>
            <Text style={{ fontSize: 20, textAlign: 'center' }}>Código de acceso</Text>
          </View>
          <View style={{ width: '50%', padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 32, fontWeight: 'bold' }}>55min</Text>
            <Text style={{ fontSize: 20, textAlign: 'center' }}>Velocidad de picking</Text>
          </View>
        </View>
      </View>
      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}
          onPress={() => setModalVisible(true)}
        >
          <Feather name="log-out" size={24} color="black" />
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
