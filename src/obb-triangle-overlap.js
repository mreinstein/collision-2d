import { vec2 }   from 'wgpu-matrix'
import obbToPoints from './obb-to-points.js'
import satOverlap   from './sat-overlap.js'


// static temp variables to avoid creating new ones each invocation
const _o = [ vec2.create(), vec2.create(), vec2.create(), vec2.create() ]
const _t = [ vec2.create(), vec2.create(), vec2.create() ]


/*
Determine if an oriented bounding box overlaps a triangle, using a separating
axis test.

@param Object obb    { position:[x,y], width, height, rotation } rotation in radians
@param Array v0, v1, v2  the 3 points of the triangle expressed as vec2
@param Object contact  if specified, filled with collision details. delta is the
                       vector to add to the triangle's points to move it out of collision.
@returns bool true if the box and triangle overlap, false otherwise
*/
export default function obbTriangleOverlap (obb, v0, v1, v2, contact = null) {
    obbToPoints(obb, _o)
    vec2.copy(v0, _t[0])
    vec2.copy(v1, _t[1])
    vec2.copy(v2, _t[2])

    return satOverlap(_o, _t, contact, obb)
}
