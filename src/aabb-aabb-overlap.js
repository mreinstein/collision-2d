import { sign } from '@footgun/math-gap'
import { vec2 } from 'gl-matrix'


/*
https://noonat.github.io/intersect/#aabb-vs-aabb

This test uses a separating axis test, which checks for overlaps between the
two boxes on each axis. If either axis is not overlapping, the boxes aren’t
colliding.

The function returns a Hit object, or null if the two static boxes do not
overlap, and gives the axis of least overlap as the contact point. That is, it
sets hit.delta so that the colliding box will be pushed out of the nearest edge
This can cause weird behavior for moving boxes, so you should use sweepAABB
instead for moving boxes.

@param Object contact  if specified, filled with collision details
*/
export default function aabbAABBOverlap (rect, rect2, contact=null) {

    const dx = rect2.position[0] - rect.position[0]
    const px = (rect.width / 2 + rect2.width / 2) - Math.abs(dx)

    if (px <= 0)
        return false

    const dy = rect2.position[1] - rect.position[1]
    const py = (rect.height / 2 + rect2.height / 2) - Math.abs(dy)

    if (py <= 0)
        return false

    // if we don't have to provide details on the collision, it's sufficient to
    // return true, indicating the rectangles do intersect
    if (!contact)
        return true

    /*
    pos is the point of contact between the two objects (or an estimation of it, in some sweep tests).
    normal is the surface normal at the point of contact.
    delta is the overlap between the two objects, and is a vector that can be added to the colliding object’s position to move it back to a non-colliding state.
    */
    contact.collider = rect
    vec2.set(contact.delta, 0, 0)
    vec2.set(contact.normal, 0, 0)
    contact.time = 0  // boxes overlap

    if (px < py) {
        const sx = sign(dx)
        contact.delta[0] = px * sx
        contact.normal[0] = sx
        contact.position[0] = rect.position[0] + (rect.width / 2 * sx)
        contact.position[1] = rect2.position[1]
    } else {
        const sy = sign(dy)
        contact.delta[1] = py * sy
        contact.normal[1] = sy
        contact.position[0] = rect2.position[0]
        contact.position[1] = rect.position[1] + (rect.height / 2 * sy)
    }

    return true
}
