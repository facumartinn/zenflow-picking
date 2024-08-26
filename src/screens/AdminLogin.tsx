import React, { useCallback, useState } from 'react'
import { SplashScreen, router } from 'expo-router'
import { View, TextInput, Text, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { loginAdmin } from '../services/auth'
import { isAdminLoggedInAtom } from '../store/authAtoms'
import { useAtom } from 'jotai'
import { DefaultButton } from '../components/DefaultButton'
import Colors from '../constants/Colors'
import { useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter'

SplashScreen.preventAutoHideAsync()

const AdminLoginScreen = () => {
  const [fontsLoaded] = useFonts({ Inter_700Bold, Inter_500Medium })
  const [, setIsAdminLoggedIn] = useAtom(isAdminLoggedInAtom)
  const [userEmail, setUserEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    try {
      const { token, user } = await loginAdmin(userEmail, password)
      console.log('token', token, user)
      // Guardar el token, tenantId y warehouseId en AsyncStorage
      await AsyncStorage.setItem('authToken', token)
      await AsyncStorage.setItem('tenantId', user.tenant_id.toString())
      await AsyncStorage.setItem('warehouseId', user.warehouse_id.toString())

      // Actualizar el átomo de autenticación
      setIsAdminLoggedIn(true)
      // Redirigir al usuario a la pantalla principal
      router.navigate('/picker-login')
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.white
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginVertical: 25,
    color: Colors.black
  },
  inputTitle: {
    fontSize: 14,
    marginVertical: 5,
    color: Colors.black,
    fontFamily: 'Inter_500Medium'
  },
  input: {
    borderColor: Colors.grey3,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    fontFamily: 'Inter_500Medium'
  },
  button: {
    marginTop: 20,
    backgroundColor: Colors.mainBlue,
    borderRadius: 5,
    fontFamily: 'Inter_500Medium'
  },
  error: {
    color: Colors.red,
    marginTop: 10,
    fontFamily: 'Inter_500Medium'
  }
})

export default AdminLoginScreen
