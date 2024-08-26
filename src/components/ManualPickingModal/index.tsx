import React, { useState, useEffect } from 'react'
import { Modal, View, Text, TouchableOpacity } from 'react-native'
import { styles } from './styles'
import { QuantitySelector } from './components/QuantitySelector'

interface ManualPickingModalProps {
  visible: boolean
  quantityPicked: number
  maxQuantity: number
  onConfirm: (newQuantity: number) => void
  onClose: () => void
}

export const ManualPickingModal: React.FC<ManualPickingModalProps> = ({ visible, quantityPicked, maxQuantity, onConfirm, onClose }) => {
  const [localQuantity, setLocalQuantity] = useState(quantityPicked)

  // Sincronizar localQuantity con el prop quantityPicked cuando el modal se abre
  useEffect(() => {
    setLocalQuantity(quantityPicked)
  }, [quantityPicked])

  const handleIncreaseQuantity = () => {
    if (localQuantity < maxQuantity) {
      setLocalQuantity(localQuantity + 1)
    }
  }

  const handleDecreaseQuantity = () => {
    if (localQuantity > 0) {
      setLocalQuantity(localQuantity - 1)
    }
  }

  const handleConfirm = () => {
    onConfirm(localQuantity) // Setear la cantidad elegida como quantity_picked
  }

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>¿Levantaste los artículos?</Text>
          <Text style={styles.description}>Asegúrate de seleccionar la cantidad correcta de artículos que levantaste.</Text>
          <QuantitySelector quantity={localQuantity} maxQuantity={maxQuantity} onIncrease={handleIncreaseQuantity} onDecrease={handleDecreaseQuantity} />
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>CARGAR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>ATRÁS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
