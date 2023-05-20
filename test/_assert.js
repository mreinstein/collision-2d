
function equal (a, b) {
    if (a !== b)
        throw new Error(`${a} is not equal to ${b}`)
}


function deepEqual (a, b) {
    if (a.length !== b.length)
        throw new Error(`${a} is not equal to ${b}`)

    for (let i=0; i < a.length; i++)
        if (a[i] !== b[i])
            throw new Error(`${a} is not equal to ${b}`)
}


function almostEqual (actual, expected, epsilon=1e-8) {
    if (Math.abs(actual - expected) > epsilon)
        equal(actual, expected)
}


function notNull (value) {
    if (value === null) 
        throw new Error('value is unexpectedly null')
  
    return value
}


export default { almostEqual, notNull, equal, deepEqual }
