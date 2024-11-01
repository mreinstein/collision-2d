import { sign } from '@footgun/math-gap'
import { vec2 } from 'gl-matrix'


/*
https://noonat.github.io/intersect/#aabb-vs-point

If a point is behind all of the edges of the box, it’s colliding.
The function returns true if the point is in the aabb, false otherwise

contact.position and contact.delta will be set to the nearest edge of the box.

This code first finds the overlap on the X and Y axis. If the overlap is less than zero for either,
a collision is not possible. Otherwise, we find the axis with the smallest overlap and use that to
create an intersection point on the edge of the box.

@param Object contact  if specified, filled with collision details
*/
export default function aabbPointOverlap (aabb, point, contact=null) {
    const halfX = aabb.width / 2

    const dx = point[0] - aabb.position[0]
    const px = halfX - Math.abs(dx)
    if (px <= 0)
        return false

    const halfY = aabb.height / 2
    const dy = point[1] - aabb.position[1]
    const py = halfY - Math.abs(dy)
    if (py <= 0)
        return false

    if (contact) {
        if (px < py) {
            const sx = sign(dx)
            vec2.set(contact.delta, px * sx, 0)
            vec2.set(contact.normal, sx, 0)
            contact.position[0] = aabb.position[0] + (halfX * sx)
            contact.position[1] = point[1]
        } else {
            const sy = sign(dy)
            vec2.set(contact.delta, 0, py * sy)
            vec2.set(contact.normal, 0, sy)
            contact.position[0] = point[0]
            contact.position[1] = aabb.position[1] + (halfY * sy)
        }

        contact.time = 1
        contact.collider = point
    }

    return true
}
