// Import routes
const demoRoutes = require("./demo.route")
const registerRoute = require("./register.route")
const loginRoute = require("./login.route")
const friendRequestRoute = require("./friendRequest.route")
const authorize = require("../middlewares/authenticate")

// Function constructor
function routes(app) {
    // Route: demo
    app.use("/demo", demoRoutes)

    app.post("/test", authorize, (req, res) => {
        return res.json({
            b: "haha"
        })
    })

    // Route: create-account
    app.use("/create-account", registerRoute)

    // Route: login
    app.use("/login-account", loginRoute)
    
    // Route: Friend-Management
    app.use("/friend-request", friendRequestRoute)
}

module.exports = routes