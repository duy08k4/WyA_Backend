// Import routes
const demoRoutes = require("./demo.route")
const registerRoute = require("./register.route")
const loginRoute = require("./login.route")
const authRoute = require("./auth.route")

// Import middleware
const { authorizeLogin } = require("../middleware/auth.middleware")

// Function constructor
function routes(app) {
    // Apply authorizeLogin middleware to all routes
    app.use(authorizeLogin)
    // Route: demo
    app.use("/demo", demoRoutes)

    // Route: create-account
    app.use("/create-account", registerRoute)

    // Route: login-account
    app.use("/login-account", loginRoute)

    // Route: auth (for token refresh)
    app.use("/auth", authRoute)
}

module.exports = routes

//http://localhost:9021/