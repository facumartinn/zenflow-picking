import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import Colors from '../../constants/Colors'
import { styles } from './styles'

interface PositionCardProps {
  position: string
  details: Array<{ type: string; quantity: number }>
}

const PositionCard = ({ position, details }: PositionCardProps) => (
  <View style={styles.positionContainer}>
    <View style={styles.leftContainer}>
      <View style={styles.positionLabelContainer}>
        <Text style={styles.positionLabel}>Posición</Text>
        <Text style={styles.position}>{position}</Text>
      </View>
      <View style={styles.detailBox}>
        {details.map((detail, index) => (
          <View key={index} style={styles.detailContainer}>
            <Text style={styles.detailType}>{detail.type}</Text>
            <Text style={styles.detailQuantity}>{detail.quantity}</Text>
          </View>
        ))}
      </View>
    </View>
    <View style={styles.rightContainer}>
      <TouchableOpacity style={styles.iconContainer}>
        <Feather name="printer" size={24} color={Colors.black} />
      </TouchableOpacity>
    </View>
  </View>
)

interface PositionsListProps {
  positions: Array<{ id: number; position: string; details: Array<{ type: string; quantity: number }> }>
}

const PositionsList = ({ positions }: PositionsListProps) => (
  <View style={styles.container}>
    <Text style={styles.sectionTitle}>Entrega</Text>
    {positions.map((position, index) => (
      <View key={position.id}>
        <PositionCard position={position.position} details={position.details} />
        {index < positions.length - 1 && <View style={styles.separator} />}
      </View>
    ))}
  </View>
)

export default PositionsList
