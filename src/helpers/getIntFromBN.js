export const getIntFromBN = (numBN) => {
    try {
        if (typeof(numBN) === 'object') {
            if (numBN['_hex']) {
                return parseInt(numBN['_hex'], 16)
            } else {
                return (0)
            } 
        }
        return parseInt(numBN+"", 10)
    } catch (error) {
        console.log(error)
        return (0)
    }
}