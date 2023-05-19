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

points.forEach(point => {
    assert.equal(intersectPoint(aabb, point), false);
})


// should return hit when colliding
aabb.position = [ 0, 0 ]
assert.equal(intersectPoint(aabb, [ 4, 4 ]), true)


/*
// should set hit pos and normal to nearest edge of box
const aabb = new AABB(new Point(0, 0), new Point(8, 8));
let hit = assert.notNull(aabb.intersectPoint(new Point(-4, -2)));
assert.almostEqual(hit.pos.x, -8);
assert.almostEqual(hit.pos.y, -2);
assert.almostEqual(hit.delta.x, -4);
assert.almostEqual(hit.delta.y, 0);
assert.almostEqual(hit.normal.x, -1);
assert.almostEqual(hit.normal.y, 0);

hit = assert.notNull(aabb.intersectPoint(new Point(4, -2)));
assert.almostEqual(hit.pos.x, 8);
assert.almostEqual(hit.pos.y, -2);
assert.almostEqual(hit.delta.x, 4);
assert.almostEqual(hit.delta.y, 0);
assert.almostEqual(hit.normal.x, 1);
assert.almostEqual(hit.normal.y, 0);

hit = assert.notNull(aabb.intersectPoint(new Point(2, -4)));
assert.almostEqual(hit.pos.x, 2);
assert.almostEqual(hit.pos.y, -8);
assert.almostEqual(hit.delta.x, 0);
assert.almostEqual(hit.delta.y, -4);
assert.almostEqual(hit.normal.x, 0);
assert.almostEqual(hit.normal.y, -1);

hit = assert.notNull(aabb.intersectPoint(new Point(2, 4)));
assert.almostEqual(hit.pos.x, 2);
assert.almostEqual(hit.pos.y, 8);
assert.almostEqual(hit.delta.x, 0);
assert.almostEqual(hit.delta.y, 4);
assert.almostEqual(hit.normal.x, 0);
assert.almostEqual(hit.normal.y, 1);
*/
