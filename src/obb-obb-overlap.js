import { vec2 }   from 'wgpu-matrix'
import obbToPoints from './obb-to-points.js'
import satOverlap   from './sat-overlap.js'


// static temp variables to avoid creating new ones each invocation
const _a = [ vec2.create(), vec2.create(), vec2.create(), vec2.create() ]
const _b = [ vec2.create(), vec2.create(), vec2.create(), vec2.create() ]


/*
Determine if 2 oriented bounding boxes overlap, using a separating axis test.

"overlap" is a static check; use a sweep test instead for moving boxes.

@param Object obb    { position:[x,y], width, height, rotation } rotation in radians
@param Object obb2   the second oriented bounding box
@param Object contact  if specified, filled with collision details. delta is the
                       vector to add to obb2's position to move it out of collision.
@returns bool true if the boxes overlap, false otherwise
*/
export default function obbOverlap (obb, obb2, contact = null) {
    obbToPoints(obb, _a)
    obbToPoints(obb2, _b)

    return satOverlap(_a, _b, contact, obb)
}
