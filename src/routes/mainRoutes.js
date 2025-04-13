// Import routes
const demoRoutes = require("./demo.route")
const registerRoute = require("./register.route")

// Function constructor
function routes(app) {
    // Route: demo
    app.use("/demo", demoRoutes)

    // Route: create-account
    app.use("/create-account", registerRoute)
}

module.exports = routes