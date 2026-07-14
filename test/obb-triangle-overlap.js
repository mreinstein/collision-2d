import assert            from './_assert.js'
import obbTriangleOverlap from '../src/obb-triangle-overlap.js'
import contact            from '../src/contact.js'
import { vec2 }           from 'wgpu-matrix'


// box centered on origin, x/y in [-5, 5]
const obb = { position: vec2.create(), width: 10, height: 10, rotation: 0 }

const hit = contact()


// triangle far away does not overlap
{
    vec2.set(0, 0, obb.position); obb.rotation = 0
    const v0 = [ 20, 0 ], v1 = [ 30, 0 ], v2 = [ 25, 10 ]
    assert.equal(obbTriangleOverlap(obb, v0, v1, v2), false)
}


// a triangle vertex inside the box overlaps
{
    vec2.set(0, 0, obb.position); obb.rotation = 0
    const v0 = [ 0, 0 ], v1 = [ 20, 0 ], v2 = [ 0, 20 ]
    assert.equal(obbTriangleOverlap(obb, v0, v1, v2), true)
}


// separated on the x axis even though bounding ranges are close
{
    vec2.set(0, 0, obb.position); obb.rotation = 0
    const v0 = [ 10, 10 ], v1 = [ 20, 10 ], v2 = [ 15, 20 ]
    assert.equal(obbTriangleOverlap(obb, v0, v1, v2), false)
}


// large triangle enclosing the box overlaps
{
    vec2.set(0, 0, obb.position); obb.rotation = 0
    const v0 = [ 0, -50 ], v1 = [ 50, 50 ], v2 = [ -50, 50 ]
    assert.equal(obbTriangleOverlap(obb, v0, v1, v2), true)
}


// contact delta moves the triangle out of collision
{
    vec2.set(0, 0, obb.position); obb.rotation = 0
    const v0 = [ 3, 0 ], v1 = [ 20, 0 ], v2 = [ 20, 20 ]

    assert.equal(obbTriangleOverlap(obb, v0, v1, v2, hit), true)

    v0[0] += hit.delta[0]; v0[1] += hit.delta[1]
    v1[0] += hit.delta[0]; v1[1] += hit.delta[1]
    v2[0] += hit.delta[0]; v2[1] += hit.delta[1]
    assert.equal(obbTriangleOverlap(obb, v0, v1, v2), false)
}


// rotated box still detects an overlapping triangle
{
    vec2.set(0, 0, obb.position); obb.rotation = Math.PI / 4
    const v0 = [ 6, 0 ], v1 = [ 12, 4 ], v2 = [ 12, -4 ]
    // box's rotated corner reaches ~7.07 along x, so a vertex at x=6 is inside
    assert.equal(obbTriangleOverlap(obb, v0, v1, v2), true)
}
