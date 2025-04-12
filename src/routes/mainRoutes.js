// Import routes
const demoRoutes = require("./demo.route")

// Function constructor
function routes(app) {
    // Route: demo
    app.use("/demo", demoRoutes)
}

module.exports = routes