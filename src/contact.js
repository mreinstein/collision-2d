import { vec2 } from 'gl-matrix'


/*
information related to a physics system collision.
position is the point of contact between the two objects (or an estimation of it, in some sweep tests).
normal is the surface normal at the point of contact.
delta is the overlap between the two objects, and is a vector that can be added to the colliding object’s position to move it back to a non-colliding state.
time is a fraction from 0 to 1 indicating how far along the line the collision occurred. (This is the t value for the line equation L(t) = A + t * (B - A))
*/
export default function contact () {
    return {
        // for segments-segment-overlap and segments-sphere-sweep1 this is set to the index in the array of line segments passed into the collision routine
        collider : null,
        position : vec2.create(),
        delta    : vec2.create(),
        normal   : vec2.create(),
        time     : 0
    }
}