import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { styles } from './styles'
import { BarcodeScannerSvg } from '../svg/BarcodeScanner'
import Colors from '../../constants/Colors'
import { BoundingBoxSvg } from '../svg/BoundingBox'

interface HeaderProps {
  title?: React.ReactNode
  leftIcon?: React.ReactNode
  leftAction?: () => void
  rightIcon?: React.ReactNode
  rightAction?: () => void
}

export const PickingHeader = ({ title, rightAction, leftAction }: HeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <TouchableOpacity onPress={leftAction}>
          <BarcodeScannerSvg width={28} height={28} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.rightColumn}>
        <TouchableOpacity onPress={rightAction} style={styles.rightIcon}>
          <BoundingBoxSvg width={28} height={28} color={Colors.mainBlue} />
        </TouchableOpacity>
      </View>
    </View>
  )
}
