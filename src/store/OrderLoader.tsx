import { useEffect } from 'react'
import { getOrderDetail } from '../services/orderDetail'
import { useAtom } from 'jotai'
import { orderDetailsAtom } from '.'
import { router } from 'expo-router'
interface OrderDetailLoaderProps {
  orderId: number
}

export const OrderDetailLoader = ({ orderId }: OrderDetailLoaderProps) => {
  const [, setOrderDetails] = useAtom(orderDetailsAtom)
  const fetchOrderDetail = async () => {
    try {
      const response = await getOrderDetail(orderId)
      setOrderDetails(response)
      return response
    } catch (err) {
      console.log(err)
      router.push('/home')
    }
  }

  useEffect(() => {
    fetchOrderDetail()
  }, [])

  return null
}
