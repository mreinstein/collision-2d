import assert      from './_assert.js'
import aabbOverlap from '../src/aabb-aabb-overlap.js'
import contact     from '../src/contact.js'
import { vec2 }    from 'wgpu-matrix'


const aabb1 = {
	position: vec2.create(),
	width: 16,
	height: 16
}

const aabb2 = {
  position: vec2.create(),
  width: 16,
  height: 16
}

const hit = contact()

// should return false when not colliding
{
    vec2.set(0, 0, aabb1.position)
    vec2.set(32, 0, aabb2.position)

    assert.equal(aabbOverlap(aabb1, aabb2), false)

    vec2.set(-32, 0, aabb2.position)
    assert.equal(aabbOverlap(aabb1, aabb2), false)

    vec2.set(0, 32, aabb2.position)
    assert.equal(aabbOverlap(aabb1, aabb2), false)

    vec2.set(0, -32, aabb2.position)
    assert.equal(aabbOverlap(aabb1, aabb2), false)

    vec2.set(0, -32, aabb2.position)
    assert.equal(aabbOverlap(aabb1, aabb2), false)
}


// should return false when edges are flush
{
    vec2.set(0, 0, aabb1.position)
    vec2.set(16, 0, aabb2.position)

    assert.equal(aabbOverlap(aabb1, aabb2), false)

    vec2.set(-16, 0, aabb2.position)
    assert.equal(aabbOverlap(aabb1, aabb2), false)

    vec2.set(0, 16, aabb2.position)
    assert.equal(aabbOverlap(aabb1, aabb2), false)

    vec2.set(0, -16, aabb2.position)
    assert.equal(aabbOverlap(aabb1, aabb2), false)

    vec2.set(0, -16, aabb2.position)
    assert.equal(aabbOverlap(aabb1, aabb2), false)
}

// should return true when colliding
{
    vec2.set(0, 0, aabb1.position)
    vec2.set(8, 0, aabb2.position)
    assert.equal(aabbOverlap(aabb1, aabb2), true)
}

// should set hit.pos and hit.normal to nearest edge of box 1
{
    vec2.set(0, 0, aabb1.position)
    vec2.set(4, 0, aabb2.position)

    assert.equal(aabbOverlap(aabb1, aabb2, hit), true)
    assert.almostEqual(hit.position[0], 8);
    assert.almostEqual(hit.position[1], 0);
    assert.almostEqual(hit.normal[0], 1);
    assert.almostEqual(hit.normal[1], 0);

    vec2.set(-4, 0, aabb2.position)
    assert.equal(aabbOverlap(aabb1, aabb2, hit), true)
    assert.almostEqual(hit.position[0], -8);
    assert.almostEqual(hit.position[1], 0);
    assert.almostEqual(hit.normal[0], -1);
    assert.almostEqual(hit.normal[1], 0);

    vec2.set(0, 4, aabb2.position)
    assert.equal(aabbOverlap(aabb1, aabb2, hit), true)
    assert.almostEqual(hit.position[0], 0);
    assert.almostEqual(hit.position[1], 8);
    assert.almostEqual(hit.normal[0], 0);
    assert.almostEqual(hit.normal[1], 1);

    vec2.set(0, -4, aabb2.position)
    assert.equal(aabbOverlap(aabb1, aabb2, hit), true)
    assert.almostEqual(hit.position[0], 0);
    assert.almostEqual(hit.position[1], -8);
    assert.almostEqual(hit.normal[0], 0);
    assert.almostEqual(hit.normal[1], -1);
}

// should set hit.delta to move box 2 out of collision
{
    vec2.set(0, 0, aabb1.position)
    vec2.set(4, 0, aabb2.position)

    assert.equal(aabbOverlap(aabb1, aabb2, hit), true)

    assert.almostEqual(hit.delta[0], 12);
    assert.almostEqual(hit.delta[1], 0);
    aabb2.position[0] += hit.delta[0];
    aabb2.position[1] += hit.delta[1];
    assert.equal(aabbOverlap(aabb1, aabb2, hit), false)

    vec2.set(-4, 0, aabb2.position)
    assert.equal(aabbOverlap(aabb1, aabb2, hit), true)
    assert.almostEqual(hit.delta[0], -12);
    assert.almostEqual(hit.delta[1], 0);
    aabb2.position[0] += hit.delta[0];
    aabb2.position[1] += hit.delta[1];
    assert.equal(aabbOverlap(aabb1, aabb2, hit), false)

    vec2.set(0, 4, aabb2.position)
    assert.equal(aabbOverlap(aabb1, aabb2, hit), true)
    assert.almostEqual(hit.delta[0], 0);
    assert.almostEqual(hit.delta[1], 12);
    aabb2.position[0] += hit.delta[0];
    aabb2.position[1] += hit.delta[1];
    assert.equal(aabbOverlap(aabb1, aabb2, hit), false)

    vec2.set(0, -4, aabb2.position)
    assert.equal(aabbOverlap(aabb1, aabb2, hit), true)
    assert.almostEqual(hit.delta[0], 0);
    assert.almostEqual(hit.delta[1], -12);
    aabb2.position[0] += hit.delta[0];
    aabb2.position[1] += hit.delta[1];
    assert.equal(aabbOverlap(aabb1, aabb2, hit), false)
}
