const numberOfSymbolsForId = 6
const numberOfSymbolsForToken = 16
const startValue = 1

function trailZeros(str) {
    let length = numberOfSymbolsForId - str.length
    for (let i = 0; i < length; i++) {
        str = '0' + str
    }
    return str
}

/*
* @param n - stands for number of symbols in the result code
* */
function generate(n) {
    const maxValue = 2 ** (n * 4)
    const randomized = startValue + Math.floor(Math.random() * (maxValue - startValue + 1))
    return trailZeros(randomized.toString(16))
}

export function generateId() {
    return generate(numberOfSymbolsForId)
}

export function generateToken() {
    return generate(numberOfSymbolsForToken)
}