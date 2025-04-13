// Import libraries
const express = require("express")
const morgan = require("morgan")
const app = express()
const dotenv = require("dotenv")
const cors = require("cors")
const port = process.env.PORT || 9021

// Import other
const routes = require("./routes/mainRoutes")

// Use
app.use(morgan("combined"))
app.use(cors({
    origin: 'http://localhost:8100'
}))
dotenv.config()

// Route
routes(app)

// Start
app.listen(port, () => {
    console.log(`Server is running in PORT ${port}`)
})