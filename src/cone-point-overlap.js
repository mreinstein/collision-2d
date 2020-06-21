import { vec2 } from './deps.js'


// static temp variables to avoid creating new ones each invocation
const heading = vec2.create()
const delta = vec2.create()

// cone structure:
// @param Vec2 position of cone origin
// @param number rotation observer rotation in radians
// @param number fieldOfView angle of cone in degrees
// @param number maxDistance  max length of cone

// TODO: consider passing the cone data as individual elements rather than a struct

/*
Determine if a point is within a cone

@param Object cone
@param Object point  vec2 position of item being checked against cone
@return bool true if point is in cone, false otherwise
*/
export default function conePointOverlap (cone, point) {
    if (vec2.distance(cone.position, point) > cone.maxDistance)
      return false

    if (cone.fieldOfView >= 360)
      return true

    vec2.set(heading, Math.cos(cone.rotation), Math.sin(cone.rotation))
    vec2.subtract(delta, point, cone.position)
    const dotProd = vec2.dot(delta, heading)

    // field of view is the total angle. divide by 2 because dot product
    // yields vector difference in either direction (clockwise or counter)
    const maxDelta = cone.fieldOfView / 180

    // dot product result indicates how similar the 2 vectors are:
    //   1 : exactly same
    // 0.5 : 60 degrees off
    //   0 : perpendicular
    //  -1 : exactly behind
    return (1 - dotProd) <= maxDelta
}
