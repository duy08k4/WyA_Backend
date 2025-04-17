// Import routes
const demoRoutes = require("./demo.route")
const registerRoute = require("./register.route")
const loginRoute = require("./login.route")

// Function constructor
function routes(app) {
    // Route: demo
    app.use("/demo", demoRoutes)

    // Route: create-account
    app.use("/create-account", registerRoute)

    // Route: login
    app.use("/login-account", loginRoute)
}

module.exports = routes