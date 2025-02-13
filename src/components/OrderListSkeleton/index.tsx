import React, { useEffect, useRef } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import Colors from '../../constants/Colors'

const OrderCardSkeleton = () => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.orderInfo}>
        <View style={styles.orderBox}>
          <View>
            <View style={[styles.skeleton, { width: 80, height: 14, marginBottom: 8 }]} />
            <View style={[styles.skeleton, { width: 60, height: 24 }]} />
          </View>
        </View>
        <View style={styles.orderBox}>
          <View>
            <View style={[styles.skeleton, { width: 70, height: 14, marginBottom: 8 }]} />
            <View style={[styles.skeleton, { width: 50, height: 24 }]} />
          </View>
        </View>
      </View>
    </View>
  )
}

const DateSectionSkeleton = ({ shimmerValue }: { shimmerValue: Animated.Value }) => {
  const getAnimatedStyle = () => ({
    opacity: shimmerValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7]
    })
  })

  return (
    <View style={styles.dateSection}>
      {/* Fecha */}
      <Animated.View style={[styles.skeleton, getAnimatedStyle(), { width: 200, height: 24, marginBottom: 16 }]} />

      {/* Turnos */}
      {[1, 2].map(scheduleIndex => (
        <View key={scheduleIndex} style={styles.scheduleSection}>
          {/* Título del turno */}
          <Animated.View style={[styles.skeleton, getAnimatedStyle(), { width: 180, height: 20, marginBottom: 12 }]} />

          {/* Pedidos del turno */}
          {[1, 2, 3].map(orderIndex => (
            <OrderCardSkeleton key={orderIndex} />
          ))}
        </View>
      ))}
    </View>
  )
}

const OrderListSkeleton = () => {
  const shimmerValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const startShimmerAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
          }),
          Animated.timing(shimmerValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true
          })
        ])
      ).start()
    }

    startShimmerAnimation()
  }, [shimmerValue])

  return (
    <View style={styles.container}>
      {[1, 2].map(sectionIndex => (
        <DateSectionSkeleton key={sectionIndex} shimmerValue={shimmerValue} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16
  },
  dateSection: {
    paddingHorizontal: 16,
    marginBottom: 24
  },
  scheduleSection: {
    marginBottom: 16
  },
  cardContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey2
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  orderBox: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  skeleton: {
    backgroundColor: Colors.grey2,
    borderRadius: 4
  }
})

export default OrderListSkeleton
