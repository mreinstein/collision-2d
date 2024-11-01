import { toRadians } from '@footgun/math-gap'
import { vec2 }      from 'gl-matrix'


// static temp variables to avoid creating new ones each invocation
const v1 = vec2.create(), v2 = vec2.create()


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
    
    vec2.subtract(v1, point, conePosition)
    vec2.set(v2, Math.cos(coneRotation), Math.sin(coneRotation))
    const angle = vec2.angle(v1, v2)
    return angle <= toRadians(coneFieldOfView/2)
}
