import React, { useEffect, useRef } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import Colors from '../../constants/Colors'

interface OrderItemSkeletonProps {
  animatedStyle: {
    opacity: Animated.AnimatedInterpolation<string | number>
  }
}

const OrderItemSkeleton = ({ animatedStyle }: OrderItemSkeletonProps) => (
  <View style={[styles.orderItem, styles.selectedOrderItem]}>
    <View style={styles.orderContainer}>
      <View style={styles.orderBox}>
        <View>
          <Animated.View style={[styles.skeleton, animatedStyle, { width: 80, height: 14, marginBottom: 4 }]} />
          <Animated.View style={[styles.skeleton, animatedStyle, { width: 60, height: 18 }]} />
        </View>
      </View>
      <View style={styles.orderBox}>
        <View>
          <Animated.View style={[styles.skeleton, animatedStyle, { width: 60, height: 14, marginBottom: 4 }]} />
          <Animated.View style={[styles.skeleton, animatedStyle, { width: 40, height: 18 }]} />
        </View>
      </View>
    </View>
  </View>
)

const MultiSelectOrderListSkeleton = () => {
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

  const animatedStyle = {
    opacity: shimmerValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7]
    })
  }

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
        <OrderItemSkeleton key={item} animatedStyle={animatedStyle} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  skeleton: {
    backgroundColor: Colors.grey2,
    borderRadius: 4,
    overflow: 'hidden'
  },
  orderItem: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.grey2
  },
  selectedOrderItem: {
    backgroundColor: Colors.white,
    borderColor: Colors.grey2
  },
  orderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  orderBox: {
    flexDirection: 'column'
  }
})

export default MultiSelectOrderListSkeleton
