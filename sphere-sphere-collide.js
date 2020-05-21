import * as vec2 from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.3.0/esm/vec2.js'


const RESTITUTION = 0.85

const delta = pool.malloc()
const mtd = pool.malloc()
const scaled = pool.malloc()
const v = pool.malloc()
const normalized = pool.malloc()
const impulse = pool.malloc()
const scaledImpulse = pool.malloc()


// TODO: this code is totally untested! Before using this needs to be evaluated


// collide 2 spherical rigid bodies, updating their positions and velocities
export default function itemCollide (ball1, ball2) {
    const body1 = ball1.findComponent('rigidbody')
    const body2 = ball2.findComponent('rigidbody')

    vec2.subtract(delta, ball1.aabb.position, ball2.aabb.position)

    const r = body1.radius + body2.radius

    const dist2 = vec2.dot(delta, delta)

    if (dist2 > r*r)
        return // they aren't colliding

    let d = vec2.length(delta)

    if (d !== 0.0) {
        // minimum translation distance to push balls apart after intersecting
        vec2.scale(mtd, delta, ((body1.radius + body2.radius)-d)/d)
    } else {
        // Special case. Balls are exactly on top of each other. Prevent divide by zero.
        d = body2.radius + body1.radius - 1.0
        vec2.set(delta, body2.radius + body1.radius, 0.0)
        vec2.scale(mtd, delta, ((body1.radius + body2.radius)-d)/d)
    }

    // resolve intersection
    const im1 = (body1.mass !== 0) ? 1 / body1.mass : 1 / 500
    const im2 = (body2.mass !== 0) ? 1 / body2.mass : 1 / 500

    // push-pull them apart
    // 0 mass means static body unmoved by collisions (doors, machines, etc.)
    if (body1.mass !== 0)
        vec2.scaleAndAdd(ball1.aabb.position, ball1.aabb.position, mtd, im1 / (im1 + im2))

    if (body2.mass !== 0) {
        vec2.scale(scaled, mtd, im2 / (im1 + im2))
        vec2.subtract(ball2.aabb.position, ball2.aabb.position, scaled)
    }

    // impact speed
    vec2.subtract(v, body1.velocity, body2.velocity)
    vec2.normalize(normalized, mtd)
    const vn = vec2.dot(v, normalized)

    // sphere intersecting but moving away from each other already
    if (vn > 0.0)
        return

    // collision impulse
    const i = (-(1.0 + RESTITUTION) * vn) / (im1 + im2)
    vec2.scale(impulse, mtd, i)

    // change in momentum
    if (body1.mass !== 0)
        vec2.scaleAndAdd(body1.velocity, body1.velocity, impulse, im1)

    if (body2.mass !== 0) {
        vec2.scale(scaledImpulse, impulse, im2)
        vec2.subtract(body2.velocity, body2.velocity, scaledImpulse)
    }
}
