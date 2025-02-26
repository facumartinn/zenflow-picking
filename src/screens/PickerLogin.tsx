import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Keyboard } from 'react-native'
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field'
import { useKeyboard } from '../hooks/useKeyboard'
import { DefaultHeader } from '../components/DefaultHeader'
import { DefaultModal } from '../components/DefaultModal'
import Colors from '../constants/Colors'
import { router } from 'expo-router'
import { Inter_500Medium, Inter_700Bold, useFonts } from '@expo-google-fonts/inter'
import { WarningSvg } from '../components/svg/Warning'
import { CheckSvg } from '../components/svg/Check'
import { LogOutSvg } from '../components/svg/LogOut'
import { useAuth } from '../context/auth'

const CELL_COUNT = 4

const PickerLoginScreen = () => {
  const [fontsLoaded] = useFonts({ Inter_700Bold, Inter_500Medium })
  const { tenantLogo, logoutAdmin, loginPicker, error: authError } = useAuth()

  // Estados esenciales
  const [modalVisible, setModalVisible] = useState(false)
  const [value, setValue] = useState('')
  const [isCodeCorrect, setIsCodeCorrect] = useState<boolean | null>(null)
  const [logoError, setLogoError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const keyboard = useKeyboard()
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue })

  // Efecto para enfocar automáticamente el input al cargar la pantalla
  useEffect(() => {
    // Pequeño delay para asegurar que el componente esté completamente montado
    const timer = setTimeout(() => {
      if (ref.current) {
        ref.current.focus()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [fontsLoaded])

  const handleCodeSubmit = async (code: string) => {
    try {
      setIsSubmitting(true)
      setIsCodeCorrect(null)
      await loginPicker(code)
      setIsCodeCorrect(true)

      // Pequeño delay para mostrar el feedback de éxito
      setTimeout(() => {
        setValue('')
        router.push('/home')
      }, 1000)
    } catch (error) {
      setIsCodeCorrect(false)

      setTimeout(() => {
        setIsCodeCorrect(null)
        setValue('')
      }, 2000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAdminLogout = async () => {
    await logoutAdmin()
  }

  useEffect(() => {
    if (value.length === CELL_COUNT && isCodeCorrect === null && !isSubmitting) {
      handleCodeSubmit(value)
    }
  }, [value, isCodeCorrect, isSubmitting])

  if (!fontsLoaded) return null

  return (
    <View style={styles.container}>
      <DefaultHeader
        rightIcon={
          <TouchableOpacity onPress={() => setModalVisible(true)} disabled={isSubmitting}>
            <LogOutSvg width={24} height={24} color="black" />
          </TouchableOpacity>
        }
      />

      <View style={styles.codeContainer}>
        <Image source={{ uri: logoError ? '' : tenantLogo ?? '#' }} style={styles.logo} onError={() => setLogoError(true)} />

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
          editable={!isSubmitting}
          renderCell={({ index, symbol, isFocused }) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell, isCodeCorrect === true && styles.cellSuccess, isCodeCorrect === false && styles.cellError]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />

        <View style={styles.feedbackContainer}>
          {isCodeCorrect === true && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <CheckSvg width={20} height={20} color={Colors.green} />
              <Text style={[styles.subtitle, { color: Colors.green, marginVertical: 0 }]}>Código correcto</Text>
            </View>
          )}
          {isCodeCorrect === false && <Text style={[styles.subtitle, { color: Colors.red, marginVertical: 0 }]}>{authError || 'Código incorrecto'}</Text>}
          {isCodeCorrect === null && <Text style={[styles.subtitle, { marginVertical: 0 }]}>Ingrese tu código de 4 dígitos</Text>}
        </View>

        <TouchableOpacity onPress={() => Keyboard.dismiss()} style={styles.manualButton} disabled={isSubmitting}>
          <Text style={styles.manualButtonText}>{keyboard.keyboardShown ? 'Ocultar teclado' : 'Ingresar manualmente'}</Text>
        </TouchableOpacity>
      </View>

      <DefaultModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        icon={<WarningSvg width={40} height={41} color={Colors.red} />}
        iconBackgroundColor={Colors.lightRed}
        title="¿Salir de sistema?"
        description="Si salís del sistema solo el administrador podrá volver a iniciar sesión."
        primaryButtonText="CERRAR SESIÓN"
        primaryButtonAction={handleAdminLogout}
        secondaryButtonText="ATRÁS"
        secondaryButtonAction={() => setModalVisible(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.grey1
  },
  codeContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 50
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
    fontFamily: 'Inter_400Regular',
    color: Colors.black
  },
  codeFieldRoot: {
    marginTop: 20,
    borderColor: Colors.grey3
  },
  cell: {
    width: 42,
    height: 54,
    lineHeight: 45,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#B7B7B7',
    textAlign: 'center',
    marginRight: 10,
    borderRadius: 8,
    fontFamily: 'Inter_400Regular'
  },
  cellSuccess: {
    borderColor: Colors.green
  },
  cellError: {
    borderColor: Colors.red
  },
  focusCell: {
    borderColor: '#2D41FC'
  },
  manualButton: {
    padding: 10,
    borderRadius: 8
  },
  manualButtonText: {
    color: Colors.mainBlue,
    fontFamily: 'Inter_500Medium',
    fontSize: 14
  },
  feedbackContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default PickerLoginScreen
