// Import routes
const demoRoutes = require("./demo.route")
const registerRoute = require("./register.route")
const loginRoute = require("./login.route")
const authRoute = require("./auth.route")

// Function constructor
function routes(app) {
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