import React from 'react'
import { Modal, View, Text } from 'react-native'
import Colors from '../../constants/Colors'
import { styles } from './styles'
import { DefaultButton } from '../DefaultButton'

interface DefaultModalProps {
  visible: boolean
  onClose?: () => void
  icon?: React.ReactNode
  title?: string
  description?: string
  primaryButtonText?: string
  primaryButtonAction?: () => void
  secondaryButtonText?: string
  primaryButtonTextColor?: string
  secondaryButtonTextColor?: string
  secondaryButtonAction?: () => void
  primaryButtonColor?: string
  secondaryButtonColor?: string
}

export const DefaultModal: React.FC<DefaultModalProps> = ({
  visible,
  //   onClose,
  icon,
  title,
  description,
  primaryButtonText,
  primaryButtonAction,
  secondaryButtonText,
  secondaryButtonAction,
  primaryButtonColor = Colors.red,
  primaryButtonTextColor = Colors.white,
  secondaryButtonColor = Colors.white,
  secondaryButtonTextColor = Colors.black
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          {title && <Text style={styles.title}>{title}</Text>}
          {description && <Text style={styles.description}>{description}</Text>}
          {primaryButtonText && (
            <DefaultButton backgroundColor={primaryButtonColor} color={primaryButtonTextColor} label={primaryButtonText} onPress={primaryButtonAction} />
          )}
          {secondaryButtonText && (
            <DefaultButton
              backgroundColor={secondaryButtonColor}
              color={secondaryButtonTextColor}
              label={secondaryButtonText}
              onPress={secondaryButtonAction}
            />
          )}
        </View>
      </View>
    </Modal>
  )
}
