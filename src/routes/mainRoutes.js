// Import routes
const demoRoutes = require("./demo.route")
const registerRoute = require("./register.route")
const loginRoute = require("./login.route")
const getInfoRoute = require("./getUserInfo.route")
const friendRequestRoute = require("./friendRequest.route")
const checkTokenRouter = require("./checkToken.route")
const searchUserRouter = require("./searchUser.route")

// Import middleware
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

    // Route: login-account
    app.use("/login-account", loginRoute)

    // Route: create-account
    app.use("/create-account", registerRoute)
    
    // Route: getInfo
    app.use("/getInfo", authorize, getInfoRoute)

    // Route: search-user
    app.use("/search-user", authorize, searchUserRouter)

    // Route: check-token
    app.use("/check-token", checkTokenRouter)
    
    // Route: friend-request
    app.use("/friend-request", authorize, friendRequestRoute)
}

module.exports = routes