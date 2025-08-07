import assert         from './_assert.js'
import contact        from '../src/contact.js'
import intersectPoint from '../src/aabb-point-overlap.js'


// should return null when not colliding
let aabb = {
    position: [ -8, -8 ],
    width: 16,
    height: 16
}

const points = [
    [ -16, -16 ],
    [ 0, -16 ],
    [ 16, -16 ],
    [ 16, 0 ],
    [ 16, 16 ],
    [ 0, 16 ],
    [ -16, 16 ],
    [ -16, 0 ]
]

const hit = contact()

// should return false when not colliding
points.forEach(point => {
    assert.equal(intersectPoint(aabb, point), false);
})


// should return hit when colliding
aabb.position = [ 0, 0 ]
assert.equal(intersectPoint(aabb, [ 4, 4 ]), true)


// should set hit pos and normal to nearest edge of box
assert.equal(intersectPoint(aabb, [ -4, -2 ], hit), true)
assert.almostEqual(hit.position[0], -8)
assert.almostEqual(hit.position[1], -2)
assert.almostEqual(hit.delta[0], -4)
assert.almostEqual(hit.delta[1], 0)
assert.almostEqual(hit.normal[0], -1)
assert.almostEqual(hit.normal[1], 0)

assert.equal(intersectPoint(aabb, [ 4, -2], hit), true)
assert.almostEqual(hit.position[0], 8)
assert.almostEqual(hit.position[1], -2)
assert.almostEqual(hit.delta[0], 4)
assert.almostEqual(hit.delta[1], 0)
assert.almostEqual(hit.normal[0], 1)
assert.almostEqual(hit.normal[1], 0)

assert.equal(intersectPoint(aabb, [ 2, -4 ], hit), true)
assert.almostEqual(hit.position[0], 2)
assert.almostEqual(hit.position[1], -8)
assert.almostEqual(hit.delta[0], 0)
assert.almostEqual(hit.delta[1], -4)
assert.almostEqual(hit.normal[0], 0)
assert.almostEqual(hit.normal[1], -1)

assert.equal(intersectPoint(aabb, [ 2, 4 ], hit), true)
assert.almostEqual(hit.position[0], 2)
assert.almostEqual(hit.position[1], 8)
assert.almostEqual(hit.delta[0], 0)
assert.almostEqual(hit.delta[1], 4)
assert.almostEqual(hit.normal[0], 0)
assert.almostEqual(hit.normal[1], 1)
