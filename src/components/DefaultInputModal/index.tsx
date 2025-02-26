import React, { useState } from 'react'
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'

interface DefaultInputModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: (position: string) => void
  title?: string
  placeholder?: string
  initialValue?: string
  confirmLabel?: string
  cancelLabel?: string
}

export const DefaultInputModal: React.FC<DefaultInputModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title = 'Ingresar posición',
  placeholder = 'Posición',
  initialValue = '',
  confirmLabel = 'ACEPTAR',
  cancelLabel = 'ATRÁS'
}) => {
  const [inputValue, setInputValue] = useState(initialValue)

  const handleConfirm = () => {
    onConfirm(inputValue.trim())
  }

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {title && <Text style={styles.title}>{title}</Text>}

          <TextInput style={styles.input} placeholder={placeholder} value={inputValue} onChangeText={setInputValue} />

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.cancelButtonText}>{cancelLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 10,
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    width: '60%',
    borderWidth: 1,
    borderColor: Colors.grey4,
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20
  },
  buttonsContainer: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  confirmButton: {
    backgroundColor: Colors.mainBlue,
    borderRadius: 24
  },
  confirmButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Inter_700Bold'
  },
  cancelButtonText: {
    color: Colors.black,
    fontSize: 16,
    fontFamily: 'Inter_700Bold'
  }
})
