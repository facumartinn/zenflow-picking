import React, { useState } from 'react'
import { View, TextInput, Text } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { loginAdmin } from '../../services/auth'
import { navigate } from '../../navigation/NavigationService'
import { isAdminLoggedInAtom } from '../../store/authAtoms'
import { useAtom } from 'jotai'
import { styles } from './styles'
import { DefaultButton } from '../../components/DefaultButton'

const AdminLoginScreen = () => {
  const [, setIsAdminLoggedIn] = useAtom(isAdminLoggedInAtom)
  const [userEmail, setUserEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    try {
      const { token, user } = await loginAdmin(userEmail, password)

      // Guardar el token, tenantId y warehouseId en AsyncStorage
      await AsyncStorage.setItem('authToken', token)
      await AsyncStorage.setItem('tenantId', user.tenant_id.toString())
      await AsyncStorage.setItem('warehouseId', user.warehouse_id.toString())

      // Actualizar el átomo de autenticación
      setIsAdminLoggedIn(true)
      // Redirigir al usuario a la pantalla principal
      navigate('PickerLogin')
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio de sesión</Text>
      <Text style={styles.inputTitle}>Correo electrónico</Text>
      <TextInput placeholder="Correo electrónico" value={userEmail} onChangeText={setUserEmail} style={styles.input} />
      <Text style={styles.inputTitle}>Contraseña</Text>
      <TextInput placeholder="Contraseña" value={password} secureTextEntry onChangeText={setPassword} style={styles.input} />
      <DefaultButton label="INICIAR SESIÓN" onPress={handleLogin} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )
}

export default AdminLoginScreen
