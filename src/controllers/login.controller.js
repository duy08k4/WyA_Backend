// Import model
const loginAccount_Model = require("../models/loginAccount.model")

// Controller
class LoginController {
    // [POST] /login-account
    async loginAccount(req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case "POST":
                const inputData = req.body.data
                console.log(req.body)
                const loginAccount_response = await loginAccount_Model(inputData)

                return res.json(loginAccount_response)
        
            default:
                return res.json({
                    status: 405,
                    data: {
                        mes: "Wrong method"
                    }
                })
        }
    }
}

// Handle login
// document.querySelectorAll(" input box here").forEach((input) => {
//     input.addEventListener("keydown", (e) => {
//         if (e.keyCode === 13) {
//             document.querySelector("bla bla some html btn").click()
//         }
//     })
// })

// document.querySelector("bla bla some html btn").addEventListener("click", () => {
//     let inputGmail = document.querySelector("bla bla some html input gmail").value
//     let inputPassword = document.querySelector("bla bla some html input password").value

    if(!inputUsername && !inputPassword) {
        createAnnouceTag("E", "Please complete the form!", 3)
        return
    }

    if(!inputUsername || !inputPassword) {
        createAnnouceTag("E", "Please complete the form!", 3)
        return
    }

    if(inputUsername.replaceAll(" ", "").length == 0 || inputPassword.replaceAll(" ", "").length == 0) {
        createAnnouceTag("W", "Please enter valid information!", 3)
        return
    }

    fetch("./login.controller.js", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            inputUsername: btoa(inputUsername), 
            inputPassword: btoa(inputPassword) 
        })
    })
// })

module.exports = new LoginController