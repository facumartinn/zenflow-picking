import { PdfTemplate } from '../hooks/usePdfGenerator'
import { OrderDetails, OrderPosition } from '../types/order'

type OrderDetailData = {
  orderId: number
  quantity: number
  startTime: string | null
  endTime: string | null
  orderDetails: OrderDetails
  positions: OrderPosition[]
}

export const OrderDetailTemplate: PdfTemplate<OrderDetailData> = {
  generateHtml: async data => {
    const formatTime = (date: string | null) => {
      if (!date) return '-'
      return new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    }

    const groupedDetails = (() => {
      const acc: Record<string, OrderDetails[]> = {}
      const position = data.positions.find(pos => pos.barcode === data.orderDetails.product_barcode)
      const positionKey = position?.position || 'Sin posición'

      if (!acc[positionKey]) {
        acc[positionKey] = []
      }
      acc[positionKey].push(data.orderDetails)

      return acc
    })()

    return `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .order-info {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .info-item {
            margin: 0;
          }
          .info-label {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 5px;
          }
          .info-value {
            font-size: 1.1em;
            font-weight: bold;
            color: #2c3e50;
          }
          .positions-container {
            margin-top: 30px;
          }
          .position-card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            overflow: hidden;
          }
          .position-header {
            background: #e9ecef;
            padding: 12px 20px;
            font-size: 1.1em;
            font-weight: bold;
            color: #495057;
          }
          .product-list {
            padding: 0 20px;
          }
          .product-item {
            padding: 15px 0;
            border-bottom: 1px solid #dee2e6;
          }
          .product-item:last-child {
            border-bottom: none;
          }
          .product-name {
            font-weight: bold;
            color: #212529;
            margin-bottom: 8px;
          }
          .product-detail {
            color: #495057;
            font-size: 0.95em;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0; color: #2c3e50;">Detalle del Pedido</h1>
        </div>

        <div class="order-info">
          <div class="info-item">
            <div class="info-label">Nro Pedido</div>
            <div class="info-value">${data.orderId.toString().padStart(4, '0')}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Cantidad Total</div>
            <div class="info-value">${data.quantity}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Hora Inicio</div>
            <div class="info-value">${formatTime(data.startTime)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Hora Fin</div>
            <div class="info-value">${formatTime(data.endTime)}</div>
          </div>
        </div>

        <div class="positions-container">
          ${Object.entries(groupedDetails)
            .map(
              ([position, details]) => `
            <div class="position-card">
              <div class="position-header">
                Posición: ${position}
              </div>
              <div class="product-list">
                ${details
                  .map(
                    detail => `
                  <div class="product-item">
                    <div class="product-name">${detail.product_name}</div>
                    <div class="product-detail">
                      <strong>Cantidad:</strong> ${detail.quantity_picked || detail.quantity}
                    </div>
                    ${
                      detail.weighable
                        ? `<div class="product-detail">
                            <strong>Peso Final:</strong> ${detail.final_weight ? `${detail.final_weight}kg` : 'No pesado'}
                          </div>`
                        : ''
                    }
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </body>
      </html>
    `
  }
}
