// plane implementation adapted from Appendix B of http://www.peroxide.dk/papers/collision/collision.pdf
import segmentNormal from './segment-normal.js'
import { vec2 }      from 'gl-matrix'


function create () {
    return {
        origin: vec2.create(),
        normal: vec2.create(),
        D: 0,
    }
}


// create a new plane from a normal and origin (a point on the plane)
function fromPlane (out, origin, normal) {
    vec2.copy(out.origin, origin)
    vec2.copy(out.normal, normal)
    out.D = -(normal[0] * origin[0] + normal[1] * origin[1])
    return out
}


// create a new plane from a line segment
function fromSegment (out, p0, p1) {
    vec2.copy(out.origin, p0)
    segmentNormal(out.normal, p0, p1)
    out.D = -(out.normal[0] * out.origin[0] + out.normal[1] * out.origin[1])
    return out
}


function isFrontFacingTo (plane, dir) {
    const dot = vec2.dot(plane.normal, dir)
    return dot <= 0
}


// returns the distance from the ray origin to the plane along the ray
// @param vec2 rOrigin starting point of ray
// @param vec2 rVector must be normalized
// @return Number the distance from the ray origin to the plane along the ray
function rayDistance (plane, rOrigin, rVector) {
    const numer = vec2.dot(plane.normal, rOrigin) + plane.D
    const denom = vec2.dot(plane.normal, rVector)
    if (denom === 0)   // normal is orthogonal to vector, cant intersect
        return -1

    return -(numer / denom)
}


// determine how far a point is from a plane
// returns a signed number indicating plane distance (negative numbers means behind the plane)
function signedDistanceTo (plane, point) {
    return vec2.dot(point, plane.normal) + plane.D
}


export default { create, fromPlane, fromSegment, isFrontFacingTo, rayDistance, signedDistanceTo }
