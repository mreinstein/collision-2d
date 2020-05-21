import * as vec2 from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.3.0/esm/vec2.js'


if (!window.poolVec2)
    window.poolVec2 = [ ]

// key is array size, value is array of available arrays
const pool = window.poolVec2


function malloc (x=0, y=0) {
    return pool.length ? vec2.set(pool.pop(), x, y) : vec2.fromValues(x, y)
}


function free (item) {
    pool.push(item)
}

export default { free, malloc }
