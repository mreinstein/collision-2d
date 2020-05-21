
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


export default { equal, deepEqual }
