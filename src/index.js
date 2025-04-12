// Import libraries
const express = require("express")
const morgan = require("morgan")
const app = express()
const dotenv = require("dotenv")
const port = process.env.PORT || 9021

// Import other
const routes = require("./routes/mainRoutes")

// Use
app.use(morgan("combined"))
dotenv.config()

// Route
routes(app)

// Start
app.listen(port, () => {
    console.log(`Server is running in PORT ${port}`)
})