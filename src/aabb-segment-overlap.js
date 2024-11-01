import clamp    from 'clamp'
import { sign } from '@footgun/math-gap'


/*
determine if a line segment intersects a bounding box
https://noonat.github.io/intersect/#aabb-vs-segment

@param object rect bounding box to check, with { position, width, height }
@param vec2 pos line segment origin/start position
@param vec2 delta line segment move/displacement vector
@param number paddingX added to the radius of the bounding box
@param number paddingY added to the radius of the bounding box
@param object contact physics contact descriptor. filled when argument isn't null and a collision occurs
@return bool true if they intersect, false otherwise
*/
export default function aabbSegmentOverlap (rect, pos, delta, paddingX, paddingY, contact=null) {
    // if x or y is 0, result will be javascript Infinity
    let scaleX = 1.0 / delta[0]
    let scaleY = 1.0 / delta[1]

    let signX = sign(scaleX)
    let signY = sign(scaleY)
    let halfx = rect.width / 2
    let halfy = rect.height / 2
    let posx = rect.position[0]
    let posy = rect.position[1]
    let nearTimeX = (posx - signX * (halfx + paddingX) - pos[0]) * scaleX
    let nearTimeY = (posy - signY * (halfy + paddingY) - pos[1]) * scaleY
    let farTimeX = (posx + signX * (halfx + paddingX) - pos[0]) * scaleX
    let farTimeY = (posy + signY * (halfy + paddingY) - pos[1]) * scaleY

    if (Number.isNaN(nearTimeY))
        nearTimeY = Infinity

    if (Number.isNaN(farTimeY))
        farTimeY = Infinity

    if (nearTimeX > farTimeY || nearTimeY > farTimeX)
        return false

    const nearTime = nearTimeX > nearTimeY ? nearTimeX : nearTimeY
    const farTime = farTimeX < farTimeY ? farTimeX : farTimeY

    if (nearTime >= 1 || farTime <= 0)
        return false


    // if we don't have to provide details on the collision, it's sufficient to
    // return true, indicating the rectangles do intersect
    if (!contact)
        return true

    /*
    position is the point of contact between the two objects (or an estimation of it, in some sweep tests).
    normal is the surface normal at the point of contact.
    delta is the overlap between the two objects, and is a vector that can be added to the colliding object’s position to move it back to a non-colliding state.
    time is a fraction from 0 to 1 indicating how far along the line the collision occurred. (This is the t value for the line equation L(t) = A + t * (B - A))
    */
    contact.collider = rect
    contact.time = clamp(nearTime, 0, 1)
    if (nearTimeX > nearTimeY) {
        contact.normal[0] = -signX
        contact.normal[1] = 0
    } else {
        contact.normal[0] = 0
        contact.normal[1] = -signY
    }

    // NEW
    contact.delta[0] = (1.0 - contact.time) * -delta[0];
    contact.delta[1] = (1.0 - contact.time) * -delta[1];
    contact.position[0] = pos[0] + delta[0] * contact.time;
    contact.position[1] = pos[1] + delta[1] * contact.time;

    return true
}
