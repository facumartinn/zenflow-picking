import React, { useCallback, useState, useRef } from 'react'
import { SplashScreen } from 'expo-router'
import { View, TextInput, Text, StyleSheet } from 'react-native'
import { DefaultButton } from '../components/DefaultButton'
import Colors from '../constants/Colors'
import { useFonts, Inter_700Bold, Inter_500Medium } from '@expo-google-fonts/inter'
import { useKeyboard } from '../hooks/useKeyboard'
import { useAuth } from '../context/auth'

SplashScreen.preventAutoHideAsync()

const AdminLoginScreen = () => {
  const [fontsLoaded] = useFonts({ Inter_700Bold, Inter_500Medium })
  const { loginAdmin, error: authError } = useAuth()
  const [userEmail, setUserEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const emailInputRef = useRef<TextInput>(null)

  // Inicializar el teclado en modo manual permanente
  useKeyboard({ alwaysManual: true, inputRef: emailInputRef })

  const handleLogin = async () => {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      setError('')
      await loginAdmin(userEmail, password)
    } catch (err) {
      setError(authError || 'Ocurrió un error, por favor intente nuevamente.')
    } finally {
      setIsSubmitting(false)
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
      <View style={styles.header}>
        <Text style={styles.title}>Inicio de sesión</Text>
        <Text style={styles.subtitle}>Consultá al administrador para iniciar sesión.</Text>
      </View>
      <Text style={styles.inputTitle}>Correo electrónico</Text>
      <TextInput
        ref={emailInputRef}
        placeholder="Correo electrónico"
        value={userEmail}
        onChangeText={setUserEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!isSubmitting}
      />
      <Text style={styles.inputTitle}>Contraseña</Text>
      <TextInput placeholder="Contraseña" value={password} secureTextEntry onChangeText={setPassword} style={styles.input} editable={!isSubmitting} />
      <DefaultButton
        label="INICIAR SESIÓN"
        onPress={handleLogin}
        withAsyncLoading
        isLoading={isSubmitting}
        disabled={isSubmitting || !userEmail || !password}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: Colors.white
  },
  header: {
    marginVertical: 25
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: Colors.black
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 5,
    width: '80%',
    color: Colors.black,
    fontFamily: 'Inter_400Regular'
  },
  inputTitle: {
    fontSize: 14,
    marginVertical: 5,
    color: Colors.black,
    fontFamily: 'Inter_400Regular'
  },
  input: {
    borderColor: Colors.grey3,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    fontFamily: 'Inter_400Regular'
  },
  error: {
    color: Colors.red,
    marginTop: 10,
    fontFamily: 'Inter_500Medium'
  }
})

export default AdminLoginScreen
