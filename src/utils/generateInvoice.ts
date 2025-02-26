// src/utils/generateInvoiceHTML.ts
import { Order, OrderDetails, OrderPosition } from '../types/order'

export const generateInvoiceHTML = (order: Order): string => {
  const { created_at, OrderDetails, OrderPositions, order_tenant_id } = order

  const tenantOrderId = order_tenant_id

  // Formatear la fecha
  const formattedDate = created_at
    ? new Date(created_at).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : 'N/A'

  // Generar filas de productos
  const productosRows = OrderDetails
    ? OrderDetails.map(
        (producto: OrderDetails) => `
      <tr>
        <td>
          ${producto.product_photo ? `<img src="${producto.product_photo}" alt="${producto.product_name}" style="width:50px; height:auto; margin-right:10px;" />` : ''}
          ${producto.product_name}
        </td>
        <td>${producto.quantity}</td>
        <td>${producto.quantity_picked !== null ? producto.quantity_picked : 'N/A'}</td>
        <td>${producto.weighable === 1 ? (producto.final_weight !== null ? `${producto.final_weight} kg` : 'N/A') : producto.quantity}</td>
      </tr>
    `
      ).join('')
    : ''

  // Generar filas de recursos
  const recursosRows = OrderPositions.map(
    (recurso: OrderPosition) => `
    <tr>
      <td>${recurso.type}</td>
      <td>${recurso.barcode}</td>
      <td>${recurso.position}</td>
    </tr>
  `
  ).join('')

  // Plantilla HTML
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Recibo/Factura</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        .header, .footer {
          text-align: center;
          margin-bottom: 20px;
        }
        .logo {
          max-width: 150px;
          margin-bottom: 10px;
        }
        h1 {
          margin: 0;
          font-size: 24px;
        }
        h2 {
          font-size: 18px;
          margin-top: 30px;
          border-bottom: 1px solid #000;
          padding-bottom: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th, td {
          border: 1px solid #000;
          padding: 8px;
          text-align: left;
          vertical-align: middle;
        }
        th {
          background-color: #f2f2f2;
        }
        td img {
          width: 50px;
          height: auto;
          margin-right: 10px;
        }
        .footer p {
          margin: 5px 0;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <!-- Encabezado -->
      <div class="header">
        <img src="https://example.com/logo.png" alt="Logo de la Empresa" class="logo">
        <h1>Recibo/Factura</h1>
        <p><strong>Número de Pedido:</strong> ${tenantOrderId}</p>
        <p><strong>Fecha:</strong> ${formattedDate}</p>
      </div>

      <!-- Detalle del Pedido -->
      <h2>Detalle del Pedido</h2>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Cantidad Pickeada</th>
            <th>Peso Final</th>
          </tr>
        </thead>
        <tbody>
          ${productosRows}
        </tbody>
      </table>

      <!-- Recursos Utilizados -->
      <h2>Recursos Utilizados</h2>
      <table>
        <thead>
          <tr>
            <th>Recurso</th>
            <th>Código de Barras</th>
            <th>Posición en Depósito</th>
          </tr>
        </thead>
        <tbody>
          ${recursosRows}
        </tbody>
      </table>

      <!-- Pie de Página -->
      <div class="footer">
        <p>Gracias por su compra.</p>
        <p>Contacto: contacto@empresa.com | Teléfono: +123 456 7890</p>
      </div>
    </body>
    </html>
  `
}
