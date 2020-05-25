import * as vec2 from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.3.0/esm/vec2.js'


// TODO: look at sphere-sphere sweep test:
// http://www.gamasutra.com/view/feature/131790/simple_intersection_tests_for_games.php?page=2


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
