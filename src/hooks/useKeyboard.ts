import { useState, useEffect, RefObject } from 'react'
import { Keyboard, KeyboardEvent, TextInput } from 'react-native'

interface KeyboardState {
  keyboardShown: boolean
  keyboardHeight: number
  isManualMode: boolean
}

interface UseKeyboardOptions {
  alwaysManual?: boolean
  inputRef?: RefObject<TextInput>
}

export const useKeyboard = ({ inputRef, alwaysManual = false }: UseKeyboardOptions = {}) => {
  const [keyboardState, setKeyboardState] = useState<KeyboardState>({
    keyboardShown: false,
    keyboardHeight: 0,
    isManualMode: alwaysManual
  })

  useEffect(() => {
    const keyboardWillShow = (event: KeyboardEvent) => {
      setKeyboardState(prev => ({
        ...prev,
        keyboardShown: true,
        keyboardHeight: event.endCoordinates.height
      }))
    }

    const keyboardWillHide = () => {
      setKeyboardState(prev => ({
        ...prev,
        keyboardShown: false,
        keyboardHeight: 0
      }))
    }

    // Suscribirse a los eventos del teclado
    const showSubscription = Keyboard.addListener('keyboardWillShow', keyboardWillShow)
    const hideSubscription = Keyboard.addListener('keyboardWillHide', keyboardWillHide)

    // Si no está en modo manual y no es alwaysManual, desactivar el teclado por defecto
    if (!keyboardState.isManualMode && !alwaysManual) {
      Keyboard.dismiss()
    }

    // Limpiar las suscripciones cuando el componente se desmonte
    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [keyboardState.isManualMode, alwaysManual])

  const showKeyboard = () => {
    if (inputRef?.current) {
      inputRef.current.focus()
    }
  }

  const toggleManualMode = () => {
    // Solo permitir toggle si no está en modo alwaysManual
    if (!alwaysManual) {
      setKeyboardState(prev => {
        const newManualMode = !prev.isManualMode
        if (newManualMode) {
          // Si activamos el modo manual, enfocamos el input y mostramos el teclado
          showKeyboard()
        } else {
          // Si desactivamos el modo manual, ocultamos el teclado
          Keyboard.dismiss()
        }
        return { ...prev, isManualMode: newManualMode }
      })
    }
  }

  const dismissKeyboard = () => {
    // Solo permitir dismiss si no está en modo alwaysManual
    if (!alwaysManual) {
      Keyboard.dismiss()
    }
  }

  return {
    ...keyboardState,
    dismissKeyboard,
    toggleManualMode,
    showKeyboard
  }
}
