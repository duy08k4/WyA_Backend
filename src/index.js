// Import libraries
const express = require("express")
const morgan = require("morgan")
const app = express()
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const { Server } = require("socket.io")
const setupSocket = require("./socket")
const http = require("http")
const port = process.env.PORT || 9021

// Import other
const routes = require("./routes/mainRoutes")

// Use
app.use(cookieParser())
app.use(express.json())
dotenv.config()
app.use(morgan("combined"))

// const allowedOrigins = [
//   process.env.FRONTEND_GATE,
//   'https://localhost',
//   'capacitor://localhost',
//   'http://localhost:5173',
//   'http://localhost:8100'
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true)
//     } else {
//       console.log('❌ Blocked by CORS:', origin)
//       callback(new Error('Not allowed by CORS'))
//     }
//   },
//   credentials: true
// }))

// Socket server
const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         console.log('❌ Blocked by CORS (Socket.IO):', origin);
//         callback(new Error('Not allowed by CORS (Socket.IO)'));
//       }
//     },
//     credentials: true
//   }
// });

// Express
app.use(cors({
  origin: '*',
  credentials: true
}));

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true
  }
});


setupSocket(io);

// Route
routes(app)

// Start
server.listen(port, () => {
  console.log(`Server is running in PORT ${port}`)
})