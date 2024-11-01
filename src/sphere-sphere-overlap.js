import contact  from './contact.js'
import { vec2 } from 'gl-matrix'


const _delta = vec2.create()
const _mtd = vec2.create()


// determine if 2 spheres overlap, and provide contact details
export default function sphereSphereOverlap (centerA, radiusA, centerB, radiusB, contact) {
    if (!contact)
        return vec2.squaredDistance(centerA, centerB) <= ((radiusA + radiusB) ** 2)

    vec2.subtract(_delta, centerA, centerB)

    const r = radiusA + radiusB

    const dist2 = vec2.dot(_delta, _delta)

    if (dist2 > r*r)
        return false // they aren't colliding

    let d = vec2.length(_delta)

    if (d !== 0.0) {
        // minimum translation distance to push balls apart after intersecting
        vec2.scale(_mtd, _delta, ((radiusA + radiusB)-d)/d)
    } else {
        // Special case. spheres are exactly on top of each other. Prevent divide by zero.
        d = r - 1.0
        vec2.set(_delta, r, 0.0)
        vec2.scale(_mtd, _delta, (r-d)/d)
    }

    // delta is the overlap between the two spheres, and is a vector that can be added to 
    // sphere A’s position to move them into a non-colliding state.
    vec2.copy(contact.delta, _mtd)

    // position is the point of contact of these 2 spheres (assuming they no longer penetrate)
    vec2.normalize(contact.position, _delta)
    vec2.scaleAndAdd(contact.position, centerA, contact.position, -radiusA)

    return true
}
