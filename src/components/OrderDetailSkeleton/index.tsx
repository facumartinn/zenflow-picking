import React, { useEffect, useRef } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import Colors from '../../constants/Colors'

const ProductCardSkeleton = () => (
  <View style={styles.cardContainer}>
    <View style={[styles.productImage, styles.shimmer]} />
    <View style={styles.productDetails}>
      <View style={[styles.skeleton, styles.shimmer, { width: '80%', height: 20, marginBottom: 10 }]} />
      <View style={styles.productInfo}>
        <View>
          <View style={[styles.skeleton, styles.shimmer, { width: 60, height: 14, marginBottom: 5 }]} />
          <View style={[styles.skeleton, styles.shimmer, { width: 100, height: 16 }]} />
        </View>
        <View style={[styles.skeleton, styles.shimmer, { width: 50, height: 40, borderRadius: 8 }]} />
      </View>
    </View>
  </View>
)

const OrderDetailSkeleton = () => {
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

  const getAnimatedStyle = () => ({
    opacity: shimmerValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7]
    })
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleBox}>
          <Animated.View style={[styles.skeleton, getAnimatedStyle(), { width: 120, height: 14, marginBottom: 8 }]} />
          <Animated.View style={[styles.skeleton, getAnimatedStyle(), { width: 80, height: 24 }]} />
        </View>
        <View style={styles.infoBox}>
          <View style={styles.titleBox}>
            <Animated.View style={[styles.skeleton, getAnimatedStyle(), { width: 80, height: 14, marginBottom: 8 }]} />
            <Animated.View style={[styles.skeleton, getAnimatedStyle(), { width: 60, height: 24 }]} />
          </View>
          <View style={styles.titleBox}>
            <Animated.View style={[styles.skeleton, getAnimatedStyle(), { width: 80, height: 14, marginBottom: 8 }]} />
            <Animated.View style={[styles.skeleton, getAnimatedStyle(), { width: 60, height: 24 }]} />
          </View>
        </View>
      </View>

      {/* Lista de productos skeleton */}
      {[1, 2, 3, 4].map(item => (
        <ProductCardSkeleton key={item} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  header: {
    paddingTop: 30,
    paddingHorizontal: 16
  },
  titleBox: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 40
  },
  skeleton: {
    backgroundColor: Colors.grey2,
    borderRadius: 4,
    overflow: 'hidden'
  },
  cardContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey2
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.grey2,
    marginRight: 16
  },
  productDetails: {
    flex: 1,
    justifyContent: 'space-between'
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  shimmer: {
    opacity: 0.5
  }
})

export default OrderDetailSkeleton
