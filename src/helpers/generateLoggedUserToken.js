const charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+?><"

export const generateLoggedUserToken = (userId) => {
    let token = ""
    if (userId.length <= 0) {
        return ""
    }

    for (let i=0; i<userId.length; i++) {
        token+=generateRandomStringFromCharSet(5)
    }

    return token
}

function generateRandomStringFromCharSet(numCharacter) {
    let charString = ''

    for (let i=0; i<numCharacter; i++) {
        charString += charSet[Math.floor(Math.random() * charSet.length)]
    }

    return charString
}