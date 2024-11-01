import { vec2 } from 'gl-matrix'


// static temp variables to avoid creating new ones each invocation
const c = vec2.create()
const b = vec2.create()
const p = vec2.create()


/*
Determine if a point is inside a triangle

https://observablehq.com/@kelleyvanevert/2d-point-in-triangle-test

@param Array v0, v1, v2  3 points of the triangle expressed as vec2
@param Array point     to check for containment within the triangle
@returns bool true if the point is in the triangle, false otherwise
*/
export default function trianglePointOverlap (v0, v1, v2, point) {
    // compute vectors        
    vec2.sub(c, v2, v0)
    vec2.sub(b, v1, v0)
    vec2.sub(p, point, v0)

    // compute dot products
    const cc = vec2.dot(c, c)
    const bc = vec2.dot(b, c)
    const pc = vec2.dot(c, p)
    const bb = vec2.dot(b, b)
    const pb = vec2.dot(b, p)

    // compute barycentric coordinates
    const denom = cc * bb - bc * bc
    const u = (bb*pc - bc*pb) / denom
    const v = (cc*pb - bc*pc) / denom

    return (u >= 0) && (v >= 0) && (u + v < 1)
}
