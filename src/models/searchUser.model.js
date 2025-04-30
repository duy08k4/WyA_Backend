const db = require("../config/firebaseSDK")



/*

 ****** GIẢI THÍCH CƠ CHẾ ******

*** Hàm checking
- Nguyên nhân: Chức năng gửi kết bạn có thể sẽ bị lỗi nếu client gửi lời mời kết bạn đến
một người đã tồn tại trong danh sách bạn bè hoặc đã gửi lời mời kết bạn trước đó.
- Mục đích: Ngăn việc tìm kiếm những người dùng đã là bạn bè hoặc đã gửi kết bạn bằng cách trả về 
mảng chứa các gmail không phù hợp (đã tồn tại trong danh sách bạn bè hoặc đã gửi lời mời kết bạn trước đó)
- Nhận 3 tham số: gmail, typeSearch, searchContent
    + gmail: là gmail của client
    + typeSearch: là loại tìm kiếm. Gồm tìm kiến bằng username hoặc gmail
    + searchContent: là nội dung tìm kiếm

CÁCH HOẠT ĐỘNG
- Kiểm tra xem người dùng đang thực hiện tìm kiếm bằng dữ liệu gì:
    + Tìm kiếm bằng username:
        ** Lấy tất cả gmail của các người dùng có tên trùng với searchContent => Tạo thành 1 mảng (users)
        ** Lấy danh sách gmail của bạn bè => Tạo thành 1 mảng (client_listFriend)
        ** Lấy danh sách gmail người gửi lời mời kết bạn => Tạo thành 1 mảng (client_listRequest)
        ** Kiểm tra xem trong users có gmail nào đã tồn tại trong client_listFriend và client_listRequest không
            **** Nếu có thì giữ loại
            **** Nếu không có thì loại ra
        ** Trả về danh sách các gmail không được tìm kiếm
    + Tìm kiếm bằng gmail tương tự
*/




const checking = async (gmail, typeSearch, searchContent) => {
    const checkCollection = db.collection("userInformation")

    if (typeSearch == "username") {
        const client = await checkCollection.doc(btoa(gmail)).get()

        if (client.exists) {
            const users = await checkCollection.where("username", "==", searchContent).get()
            const client_listFriend = client.data().friends.map(request => request.gmail)
            const client_listRequest = client.data().requests.map(request => request.request_gmail)
            const listGmail_DenySearch = [] // Contain gmails which exist in friendList or friendRequest of client

            users.forEach(user => {
                const userGmail = user.data().gmail

                if (
                    client_listFriend.includes(userGmail) ||
                    client_listRequest.includes(userGmail)
                ) {
                    listGmail_DenySearch.push(userGmail)
                }
            })

            return listGmail_DenySearch

        } else {
            return false
        }

    } else {
        const client = await checkCollection.doc(btoa(gmail)).get()

        if (client.exists) {
            const client_listFriend = client.data().friends
            const client_listRequest = client.data().requests.map(request => request.request_gmail)
            const listGmail_DenySearch = [] // Contain gmails which exist in friendList or friendRequest of client

            if (
                client_listFriend.includes(searchContent) ||
                client_listRequest.includes(searchContent)
            ) {
                listGmail_DenySearch.push(searchContent)
            }

            return listGmail_DenySearch

        } else {
            return false
        }
    }
}

// Model
const searchUser_Model = async (req, res) => {
    const data = req.body.data
    const typeSearch = data.type // Client can search another user with gmail or username
    const searchContent = data.searchContent
    const gmail = data.gmail

    const listGmail_DenySearch = await checking(gmail, typeSearch, searchContent).then((result) => {
        return result
    }).catch((error) => {
        console.error(`Custom error: ${error}`)
        return undefined
    })

    if (!listGmail_DenySearch) {
        return {
            status: 400,
            data: {
                mess: `Dev Error: Not Found`,
                result: []
            }
        }
    }

    const searchCollection = db.collection("userInformation")
    let result = []

    if (typeSearch == "gmail") {
        if (gmail == searchContent) {
            return {
                status: 400,
                data: {
                    mess: `That is your gmail`,
                    result: []
                }
            }
        }

        const user = await searchCollection.doc(btoa(searchContent)).get()
        if (user.exists) {
            const userData = user.data()

            if (listGmail_DenySearch.includes(userData.gmail)) {
                return {
                    status: 400,
                    data: {
                        mess: `Not found`,
                        result: []
                    }
                }
            } else {
                return {
                    status: 200,
                    data: {
                        mess: `Found`,
                        result: [{
                            gmail: userData.gmail,
                            username: userData.username,
                            avartarCode: userData.avartarCode
                        }]
                    }
                }
            }

        } else {
            return {
                status: 400,
                data: {
                    mess: `Not found`,
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



        if (listGmail_DenySearch.length == 0) {
            return {
                status: 200,
                data: {
                    mess: "Found",
                    result
                }
            }
        } else {
            return {
                status: 200,
                data: {
                    mess: "Found",
                    result: result.filter(item => !listGmail_DenySearch.includes(item.gmail))
                }
            }
        }


    } else {
        return {
            status: 405,
            data: {
                mess: `TypeError: Type-search '${typeSearch}' is wrong.`
            }
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