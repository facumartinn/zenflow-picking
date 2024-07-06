import { io } from 'socket.io-client'

const socket = io('http://localhost:4000') // Reemplaza con la URL de tu API

export default socket
