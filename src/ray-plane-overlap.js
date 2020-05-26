import { vec2 } from './deps.js'


// returns the distance from the ray origin to the plane along the ray
// @param v2 rVector must be normalized
export default function rayPlaneOverlap (rOrigin, rVector, pOrigin, pNormal) {
    const d = -vec2.dot(pNormal, pOrigin)
    const numer = vec2.dot(pNormal, rOrigin) + d
    const denom = vec2.dot(pNormal, rVector)
    if (denom === 0)   // normal is orthogonal to vector, cant intersect
        return -1

    return -(numer / denom)
}
