import sign      from 'https://cdn.jsdelivr.net/gh/mreinstein/math-gap/sign.js'
import * as vec2 from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.3.0/esm/vec2.js'


/*
http://noonat.github.io/intersect/#aabb-vs-aabb

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
  const halfwidth_a = rect.width / 2
  const halfheight_a = rect.height / 2
  const posx_a = rect.position[0]
  const posy_a = rect.position[1]

  const halfwidth_b = rect2.width / 2
  const halfheight_b = rect2.height / 2
  const posx_b = rect2.position[0]
  const posy_b = rect2.position[1]

  const dx = posx_b - posx_a
  const px = (halfwidth_b + halfwidth_a) - Math.abs(dx)

  if (px <= 0)
    return false

  const dy = posy_b - posy_a
  const py = (halfheight_b + halfheight_a) - Math.abs(dy)

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
    contact.position[0] = posx_a + (halfwidth_a * sx)
    contact.position[1] = posy_b
  } else {
    const sy = sign(dy)
    contact.delta[1] = py * sy
    contact.normal[1] = sy
    contact.position[0] = posx_b
    contact.position[1] = posy_a + (halfheight_a * sy)
  }

  return true
}
