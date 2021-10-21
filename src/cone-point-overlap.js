import { vec2 } from './deps.js'


// static temp variables to avoid creating new ones each invocation
const heading = vec2.create()
const delta = vec2.create()


/*
Determine if a point is within a cone

@param Vec2 conePosition position of cone origin
@param number coneRotation observer rotation in radians
@param number coneFieldOfView angle of cone in degrees
@param number coneMinDistance  min distance from cone position
@param number coneMaxDistance  max distance from cone position
@param Object point  vec2 position of item being checked against cone
@return Bool true if point is in cone, false otherwise
*/
export default function conePointOverlap (conePosition, coneRotation, coneFieldOfView, coneMinDistance, coneMaxDistance, point) {
    const dist = vec2.distance(conePosition, point)
    if (dist > coneMaxDistance)
        return false

    if (dist < coneMinDistance)
        return false

    if (coneFieldOfView >= 360)
        return true

    vec2.set(heading, Math.cos(coneRotation), Math.sin(coneRotation))
    vec2.subtract(delta, point, conePosition)
    const dotProd = vec2.dot(delta, heading)

    // field of view is the total angle. divide by 2 because dot product
    // yields vector difference in either direction (clockwise or counter)
    const maxDelta = coneFieldOfView / 180

    // dot product result indicates how similar the 2 vectors are:
    //   1 : exactly same
    // 0.5 : 60 degrees off
    //   0 : perpendicular
    //  -1 : exactly behind
    return (1 - dotProd) <= maxDelta
}
