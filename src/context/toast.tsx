// contexts/ToastContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react'
import DefaultToast from '../components/DefaultToast' // Asegúrate de importar tu componente DefaultToast

// Definimos el tipo para el contexto del toast
interface ToastContextType {
  showToast: (message: string, orderId: number, backgroundColor: string, textColor: string) => void
  hideToast: () => void
}

// Creamos el contexto
const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Componente que envuelve la aplicación y proporciona el toast
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [orderId, setOrderId] = useState(0)
  const [backgroundColor, setBackgroundColor] = useState('#4CAF50') // Default color
  const [textColor, setTextColor] = useState('#FFFFFF') // Default text color

  // Función para mostrar el toast
  const showToast = (msg: string, id: number, bg: string, text: string) => {
    setMessage(msg)
    setOrderId(id)
    setBackgroundColor(bg)
    setTextColor(text)
    setVisible(true)
  }

  // Función para ocultar el toast
  const hideToast = () => {
    setVisible(false)
  }

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <DefaultToast visible={visible} message={message} orderId={orderId} backgroundColor={backgroundColor} textColor={textColor} onHide={hideToast} />
    </ToastContext.Provider>
  )
}

// Hook para usar el contexto del toast
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast debe usarse dentro de un ToastProvider')
  }
  return context
}
