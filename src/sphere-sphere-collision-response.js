import contact       from './contact.js'
import sphereOverlap from './sphere-sphere-overlap.js'
import { vec2 }      from 'wgpu-matrix'


// TODO: make this function actually work.  Right now the data structure is hardcoded to
// use crossroads entity data structures that have no analog in collision-2d (rigidBody, transform components)
/*
const mtd = vec2.create()
const scaled = vec2.create()
const v = vec2.create()
const normalized = vec2.create()
const impulse = vec2.create()
const tmpContact = contact()


// collide 2 spherical rigid bodies, updating their positions and velocities
export default function sphereSphereCollisionResponse (sphere1, sphere2, restitution=0.85) {
    const body1 = sphere1.rigidBody
    const body2 = sphere2.rigidBody

    const overlap = sphereOverlap(sphere1.transform.position,
                                  body1.radius,
                                  sphere2.transform.position,
                                  body2.radius,
                                  tmpContact)

    if (!overlap)
        return

    vec2.copy(tmpContact.delta, mtd)

    // resolve intersection
    const im1 = (body1.mass !== 0) ? 1 / body1.mass : 1 / 500
    const im2 = (body2.mass !== 0) ? 1 / body2.mass : 1 / 500

    // push-pull them apart
    // 0 mass means static body unmoved by collisions (doors, machines, etc.)
    if (body1.mass !== 0)
        vec2.addScaled(sphere1.transform.position, mtd, im1 / (im1 + im2), sphere1.transform.position)

    if (body2.mass !== 0) {
        vec2.scale(mtd, im2 / (im1 + im2), scaled)
        vec2.subtract(sphere2.transform.position, scaled, sphere2.transform.position)
    }

    // impact speed
    vec2.subtract(body1.velocity, body2.velocity, v)
    vec2.normalize(mtd, normalized)
    const vn = vec2.dot(v, normalized)

    // sphere intersecting but moving away from each other already
    if (vn > 0.0)
        return

    // collision impulse
    const i = (-(1.0 + restitution) * vn) / (im1 + im2)
    vec2.scale(mtd, i, impulse)

    // change in momentum
    if (body1.mass !== 0)
        vec2.addScaled(body1.velocity, impulse, im1, body1.velocity)

    if (body2.mass !== 0)
        vec2.addScaled(body2.velocity, impulse, -im2, body2.velocity)
}
*/
