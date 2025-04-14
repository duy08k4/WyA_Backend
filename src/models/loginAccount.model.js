// Import database
const db = require("../config/firebaseSDK")
const hs256 = require("js-sha256")

// Model
const loginAccount_Model = async (inputData) => {
    // Check for required fields
    if (!inputData || !inputData.username || !inputData.password) {
        console.log('Missing required fields:', inputData);
    }

    const { username, password } = inputData;
    // Search for user by username
    console.log('Searching for user:', username);
    const result = await db.collection("accounts").get()
        .then((querySnapshot) => {
            // Check documents for user
            let foundUser = null;
            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                if (userData.username === username) {
                    foundUser = userData;
                }
            });
            
            if (!foundUser) {
                console.log('User not found:', username);
                return {
                    status: E,
                    data: {
                        mess: "Invalid credentials"
                    }
                };
            }
            
            // Check password
            if (foundUser.password === hs256(password)) {
                console.log('Password correct');
                return {
                    status: S,
                    data: {
                        mess: "Successful"
                    }
                };
            } else {
                console.log('Password incorrect');
                return {
                    status: E,
                    data: {
                        mess: "Unsuccessful"
                    }
                };
            }
        })
        // .catch((error) => {
        //     // console.error('Error during login:', error);
        //     return {
        //         status: 404,
        //         data: {
        //             mess: "Unsuccessful"
        //         }
        //     }
        // })

    return result
}

module.exports = loginAccount_Model

// example for postman
// {
//     "data": {
//       "username": "testuser",
//       "gmail": "testuser@gmail.com",
//       "password": "password123"
//     }
//   }
