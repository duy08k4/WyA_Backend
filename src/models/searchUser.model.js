const db = require("../config/firebaseSDK")

// Model
const searchUser_Model = async (req, res) => {
    const data = req.body.data
    const typeSearch = data.type // Client can search another user with gmail or username
    const searchContent = data.searchContent

    const searchCollection = db.collection("userInformation")
    const result = []

    if (typeSearch == "gmail") {
        const user = await searchCollection.doc(btoa(searchContent)).get()
        if (user.exists) {
            const userData = user.data()

            return {
                status: 200,
                data: {
                    mess: `Found`,
                    result: [{
                        gmail: userData.gmail,
                        username: userData.username
                    }]
                }
            }
        } else {
            return {
                status: 200,
                data: {
                    mess: `Can not find user '${searchContent}'`,
                    result: []
                }
            }
        }
    } else if (typeSearch == "username") {
        const users = await searchCollection.where("username", "==", searchContent).get()
        if (users.empty) {
            return {
                status: 200,
                data: {
                    mess: `Can not find user '${searchContent}'`,
                    result: []
                }
            }
        }

        users.forEach(user => {
            const userData = user.data()
            result.push({
                gmail: userData.gmail,
                username: userData.username,
                avartarCode: userData.avartarCode
            })
        })

    } else {
        return {
            status: 405,
            data: {
                mess: `TypeError: Type-search '${typeSearch}' is wrong.`
            }
        }
    }

    return {
        status: 200,
        data: {
            mess: "Found",
            result
        }
    }
}

const structureSearch = {
    data: {
        type: "gmail" || "username",
        searchContent: "abcxyz"
    }
}

module.exports = searchUser_Model