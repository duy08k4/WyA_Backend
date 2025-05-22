// Import routes
const loginRouter = require("./login.route")
const logoutRouter = require("./logout.route")
const registerRouter = require("./register.route")
const searchUserRouter = require("./searchUser.route")
const checkTokenRouter = require("./checkToken.route")
const sendMessageRouter = require("./sendMessage.route")
const mapFunctionRouter = require("./mapFunction.route")
const changeDataRouter = require("./changeData.route")
const friendRequestRouter = require("./friendRequest.route")
const demoRoutes = require("./demo.route")
const db = require("../config/firebaseSDK")

// Import middleware
const authorize = require("../middlewares/authenticate")

// Function constructor
function routes(app) {
    // Route: demo
    app.use("/demo", demoRoutes)

    app.post("/test", (req, res) => {
        db.collection("test").doc("test").set({
            content: "test"
        })
        return res.json({
            b: "haha"
        })
    })

    // Route: login-account
    app.use("/login-account", loginRouter)

    // Route: logout-account
    app.use("/logout-account", logoutRouter)

    // Route: create-account
    app.use("/create-account", registerRouter)
    
    // Route: change-data
    app.use("/change-data", authorize, changeDataRouter)

    // Route: search-user
    app.use("/search-user", authorize, searchUserRouter)

    // Route: check-token
    app.use("/check-token", checkTokenRouter)
    
    // Route: friend-request
    app.use("/friend-request", authorize, friendRequestRouter)

    // Route: send-message
    app.use("/send-message", authorize, sendMessageRouter)

    // Route: map-function
    app.use("/map-function", authorize, mapFunctionRouter)
}

module.exports = routes