import lineSphereSweep from './line-sphere-sweep.js'
import Pool            from 'https://cdn.jsdelivr.net/gh/mreinstein/vec2-gap/pool.js'
import * as vec2       from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.3.0/esm/vec2.js'
import vec2SetLength   from 'https://cdn.jsdelivr.net/gh/mreinstein/vec2-gap/set-length.js'


const VERY_CLOSE_DISTANCE = 0.05


// collision detection/resolution
// handle collisions between a moving entity (position and radius) and static line segments
// http://www.peroxide.dk/papers/collision/collision.pdf
//
// @param array lines non-moving line segments to collide against
// @param vec2 position the moving AABB sphere center point
// @param number radius moving AABB sphere radius
// @param vec2 delta the displacement vector of the entity
// @param object contact
export default function collideAndSlide (lines, position, radius, delta, contact) {
    
    // TODO: handle gravity and movement separately
    // TODO: handle ellipsoid space
    const p = collideWithWorld(lines, position, radius, delta, contact)
    vec2.copy(position, p)
}


function signedDistanceTo (planeNormal, planeOrigin, p) {
    const eq3 = -(planeNormal[0] * planeOrigin[0] + planeNormal[1] * planeOrigin[1])
    return vec2.dot(p, planeNormal) + eq3
}


function collideWithWorld (lines, pos, radius, vel, contact, collisionRecursionDepth=0) {
    if (collisionRecursionDepth > 5)
        return pos

    // get nearest collision from line segments
    if (!lineSphereSweep(lines, pos, radius, vel, contact)) {
        // no collision, move the full distance
        return vec2.add(Pool.malloc(), pos, vel)
    }

    // find the point of desired final location of the entity
    const destinationPoint = vec2.add(Pool.malloc(), pos, vel)
    const newBasePoint = vec2.copy(Pool.malloc(), pos)

    // only update if we are not already very close and if so, we only
    // move very close to the intersection, not the exact spot.
    const movementDistance = vec2.length(vel) * contact.time
    if (movementDistance >= VERY_CLOSE_DISTANCE) {
        const V = vec2SetLength(Pool.malloc(), vel, movementDistance - VERY_CLOSE_DISTANCE)

        vec2.add(newBasePoint, pos, V)

        // adjust line intersection point (so sliding plane will be unaffected by the fact
        // that we move slightly less than the collision tells us)
        vec2.normalize(V, V)
        vec2.scale(V, V, VERY_CLOSE_DISTANCE)
        vec2.subtract(contact.position, contact.position, V)

        Pool.free(V)
    }

    // determine the sliding plane

    // project the destination point onto the sliding plane
    const slidePlaneOrigin = contact.position

    const slidePlaneNormal = vec2.subtract(Pool.malloc(), newBasePoint, contact.position)
    vec2.normalize(slidePlaneNormal, slidePlaneNormal)

    const planeDistance = signedDistanceTo(slidePlaneNormal, slidePlaneOrigin, destinationPoint)

    const newDestinationPoint = vec2.scaleAndAdd(Pool.malloc(), destinationPoint, slidePlaneNormal, -planeDistance)

    // Generate slide vector. Becomes the new velocity vector in next iteration
    const newVelocityVector = vec2.subtract(Pool.malloc(), newDestinationPoint, contact.position)


    Pool.free(destinationPoint)
    Pool.free(newDestinationPoint)
    Pool.free(slidePlaneNormal)

    // dont recurse if the new velocity is very small
    if (vec2.length(newVelocityVector) < VERY_CLOSE_DISTANCE)
        return newBasePoint

    return collideWithWorld(lines, newBasePoint, radius, newVelocityVector, contact, collisionRecursionDepth+1)
}
