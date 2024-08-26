import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import Feather from '@expo/vector-icons/Feather'
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field'
import { DefaultHeader } from '../components/DefaultHeader'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { isAdminLoggedInAtom, isPickerLoggedInAtom, userAtom, warehousesAtom } from '../store'
import { useAtom } from 'jotai'
import { loginPickingUser } from '../services/auth'
import { DefaultModal } from '../components/DefaultModal'
import Colors from '../constants/Colors'
import { SplashScreen, router } from 'expo-router'
import { Inter_500Medium, Inter_700Bold, useFonts } from '@expo-google-fonts/inter'
import { WarehouseConfig } from '../types/warehouse'
import { WarningSvg } from '../components/svg/Warning'
const CELL_COUNT = 4

const PickerLoginScreen = () => {
  const [fontsLoaded] = useFonts({ Inter_700Bold, Inter_500Medium })
  const [, setPickerUser] = useAtom(userAtom)
  const [, setIsAdminLoggedIn] = useAtom(isAdminLoggedInAtom)
  const [, setIsPickerLoggedIn] = useAtom(isPickerLoggedInAtom)
  const [, setWarehouseConfig] = useAtom(warehousesAtom)
  const [modalVisible, setModalVisible] = useState(false)
  const [value, setValue] = useState('')
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue
  })

  const handleSecondaryAction = () => {
    // Acción del botón secundario
    setModalVisible(false)
  }

  useEffect(() => {
    if (value.length === CELL_COUNT) {
      handleLogin()
    }
  }, [value])

  const handleLogin = async () => {
    try {
      const response = await loginPickingUser(Number(value))
      setPickerUser(response.data.user)
      setWarehouseConfig(JSON.parse(response.data.user.Warehouses.custom_attributes as string) as WarehouseConfig)

      await AsyncStorage.setItem('authPickerToken', response.data.token)
      await AsyncStorage.setItem('pickerId', response.data.user.id.toString())
      router.navigate('/home')
      setIsPickerLoggedIn(true)
    } catch (error) {
      console.log('Error:', error)
    }
  }

  const handleAdminLogout = async () => {
    await AsyncStorage.removeItem('authToken')
    await AsyncStorage.removeItem('tenantId')
    await AsyncStorage.removeItem('warehouseId')
    await AsyncStorage.removeItem('authPickerToken')
    await AsyncStorage.removeItem('pickerId')

    // Actualizar el átomo de autenticación
    setIsAdminLoggedIn(false)
    setValue('')
    // Redirigir al usuario a la pantalla de login
    router.navigate('/admin-login')
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
    // <>
    <View style={styles.container} onLayout={onLayoutRootView}>
      {/* <Feather name="log-out" size={24} color="black" /> */}
      <DefaultHeader
        rightIcon={
          <Feather
            name="log-out"
            size={24}
            color="black"
            style={{ transform: 'rotate(180deg)', cursor: 'pointer', marginRight: 10, fontFamily: 'Inter_200ExtraLight' }}
            onPress={() => setModalVisible(true)}
          />
        }
      />
      <Image source={{ uri: 'https://i.pinimg.com/564x/63/73/a2/6373a27fc967248faf8ba9ac82041a97.jpg' }} style={styles.logo} />
      <Text style={styles.title}>Código de empleado</Text>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="numeric"
        textContentType="oneTimeCode"
        testID="my-code-input"
        renderCell={({ index, symbol, isFocused }) => (
          <Text key={index} style={[styles.cell, isFocused && styles.focusCell]} onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
      <Text style={styles.subtitle}>Ingrese tu código de 4 dígitos</Text>
      {/* <Button title="INGRESAR" onPress={handleLogin} />
        <Button title="SALIR" onPress={handleLogout} /> */}
      <DefaultModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        icon={<WarningSvg width={40} height={41} color={Colors.red} />}
        title="¿Salir de sistema?"
        description="Si salís del sistema solo el administrador podrá volver a iniciar sesión."
        primaryButtonText="CERRAR SESIÓN"
        primaryButtonAction={handleAdminLogout}
        secondaryButtonText="ATRÁS"
        secondaryButtonAction={handleSecondaryAction}
      />
    </View>
    // </>
  )
}

export default PickerLoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.grey1
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
    borderRadius: 190
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginBottom: 10,
    color: Colors.black
  },
  subtitle: {
    fontSize: 12,
    marginVertical: 20,
    color: '#4A4D4F',
    fontFamily: 'Inter_400Regular'
  },
  input: {
    borderColor: Colors.grey3,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: '80%',
    marginBottom: 20,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center'
  },
  button: {
    backgroundColor: Colors.mainBlue,
    borderRadius: 5
  },
  root: {
    flex: 1,
    padding: 20
  },
  codeFieldRoot: {
    marginTop: 20
  },
  cell: {
    width: 40,
    height: 48,
    lineHeight: 45,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#B7B7B7',
    textAlign: 'center',
    marginRight: 10,
    borderRadius: 10,
    fontFamily: 'Inter_400Regular'
  },
  focusCell: {
    borderColor: '#2D41FC',
    fontFamily: 'Inter_400Regular'
  }
})
