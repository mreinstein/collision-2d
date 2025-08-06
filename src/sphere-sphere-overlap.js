import contact  from './contact.js'
import { vec2 } from 'wgpu-matrix'


const _delta = vec2.create()
const _mtd = vec2.create()


// determine if 2 spheres overlap, and provide contact details
export default function sphereSphereOverlap (centerA, radiusA, centerB, radiusB, contact) {
    if (!contact)
        return vec2.distanceSq(centerA, centerB) <= ((radiusA + radiusB) ** 2)

    vec2.subtract(centerA, centerB, _delta)

    const r = radiusA + radiusB

    const dist2 = vec2.dot(_delta, _delta)

    if (dist2 > r*r)
        return false // they aren't colliding

    let d = vec2.length(_delta)

    if (d !== 0.0) {
        // minimum translation distance to push balls apart after intersecting
        vec2.scale(_delta, ((radiusA + radiusB)-d)/d, _mtd)
    } else {
        // Special case. spheres are exactly on top of each other. Prevent divide by zero.
        d = r - 1.0
        vec2.set(r, 0.0, _delta)
        vec2.scale(_delta, (r-d)/d, _mtd)
    }

    // delta is the overlap between the two spheres, and is a vector that can be added to 
    // sphere A’s position to move them into a non-colliding state.
    vec2.copy(_mtd, contact.delta)

    // position is the point of contact of these 2 spheres (assuming they no longer penetrate)
    vec2.normalize(contact.position, _delta)
    vec2.addScaled(centerA, contact.position, -radiusA, contact.position)

    return true
}
