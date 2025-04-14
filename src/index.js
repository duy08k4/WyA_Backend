// Import libraries
const express = require("express")
const morgan = require("morgan")
const app = express()
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const port = process.env.PORT || 9021

// Import other
const routes = require("./routes/mainRoutes")

// Use
app.use(express.json())
dotenv.config()
app.use(morgan("combined"))
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_GATE
}))

// Route
routes(app)

// Start
app.listen(port, () => {
    console.log(`Server is running in PORT ${port}`)
})