/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import React from 'react'
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native'
import { DefaultHeader } from '../../components/DefaultHeader'
import { navigate } from '../../navigation/NavigationService'
import { AntDesign, Feather, SimpleLineIcons } from '@expo/vector-icons'
import styles from './styles'
import { OrderDetailLoader } from '../../store/OrderLoader'
import { RouteProp } from '@react-navigation/native'
import Colors from '../../constants/Colors'
import { useAtom } from 'jotai'
import { orderDetailsAtom } from '../../store'
import { formatTime } from '../../utils/queryParams'
import PositionsList from '../../components/PositionCard'
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'

interface CompletedOrderDetailScreenProps {
  route: RouteProp<
    {
      params: {
        orderId: number
        quantity: number
        stateId: number
      }
    },
    'params'
  >
}

export const CompletedOrderDetailScreen = ({ route }: CompletedOrderDetailScreenProps) => {
  const { orderId, stateId, quantity } = route.params
  const [orderDetails, setOrderDetails] = useAtom(orderDetailsAtom)

  const handleBack = () => {
    setOrderDetails([])
    navigate('Home')
  }

  const handleOrderDetailNavigation = () => {
    navigate('OrderDetail', { orderId, quantity, stateId })
  }

  const generatePDF = async () => {
    const htmlContent = `
      <h1>Detalle del Pedido</h1>
      <p><strong>Nro Pedido:</strong> ${orderId}</p>
      <p><strong>Cantidad:</strong> ${quantity}</p>
      <p><strong>Inicio:</strong> ${formatTime(orderDetails[0]?.Orders.created_at!)}</p>
      <p><strong>Fin:</strong> ${formatTime(orderDetails[0]?.Orders.updated_at!)}</p>
      <h2>Posiciones</h2>
      ${positionsData
        .map(
          position => `
        <div>
          <p><strong>Posición:</strong> ${position.position}</p>
          ${position.details
            .map(
              detail => `
            <p>${detail.type}: ${detail.quantity}</p>
          `
            )
            .join('')}
        </div>
      `
        )
        .join('')}
    `

    try {
      const options = {
        html: htmlContent,
        fileName: `order_detail_${orderId}`,
        base64: false
      }
      console.log(options)

      const pdf = await RNHTMLtoPDF.convert(options)
      console.log(pdf, 'pdf')

      if (pdf.filePath) {
        if (Platform.OS === 'ios') {
          await Sharing.shareAsync(pdf.filePath)
        } else {
          const downloadPath = `${FileSystem.documentDirectory}order_detail.pdf`
          await FileSystem.copyAsync({
            from: pdf.filePath,
            to: downloadPath
          })
          Alert.alert('PDF guardado', 'El PDF ha sido guardado correctamente.')
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un error al generar el PDF.')
    }
  }

  const positionsData = [
    {
      id: 1,
      position: '24F',
      details: [
        { type: 'Cajas', quantity: 2 },
        { type: 'Bolsas', quantity: 3 }
      ]
    },
    {
      id: 2,
      position: '24F',
      details: [{ type: 'Cajas', quantity: 2 }]
    }
  ]

  return (
    <View>
      <OrderDetailLoader orderId={orderId} />
      <DefaultHeader
        title={<Text style={styles.headerTitle}>Detalle pedido</Text>}
        leftIcon={
          <View style={{ borderRadius: 100, backgroundColor: 'white', marginLeft: 10 }}>
            <AntDesign name="arrowleft" size={24} color="black" style={{ padding: 8 }} />
          </View>
        }
        leftAction={handleBack}
      />
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <SimpleLineIcons name="social-dropbox" size={24} color={Colors.grey5} />
          <Text style={styles.title}>Nro Pedido </Text>
          <Text style={styles.value}>{orderId}</Text>
        </View>
        <View style={styles.titleBox}>
          <Feather name="shopping-cart" size={24} color={Colors.grey5} />
          <Text style={styles.title}>Cantidad </Text>
          <Text style={styles.value}>{quantity}</Text>
        </View>
        <View style={styles.titleBox}>
          <Feather name="watch" size={24} color={Colors.grey5} />
          <Text style={styles.title}>Inicio </Text>
          <Text style={styles.value}>{formatTime(orderDetails[0]?.Orders.created_at!)}</Text>
          <Text style={styles.title}>Fin </Text>
          <Text style={styles.value}>{formatTime(orderDetails[0]?.Orders.updated_at!)}</Text>
        </View>
        <PositionsList positions={positionsData} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.enterDetailScreen} onPress={handleOrderDetailNavigation}>
          <Text style={styles.startPickingText}>VER DETALLE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadDetailScreen} onPress={generatePDF}>
          <Text style={styles.downloadDetailText}>DESCARGAR DETALLE</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
