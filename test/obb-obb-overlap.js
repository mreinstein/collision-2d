import assert     from './_assert.js'
import obbOverlap  from '../src/obb-obb-overlap.js'
import contact     from '../src/contact.js'
import { vec2 }    from 'wgpu-matrix'


const obb1 = { position: vec2.create(), width: 16, height: 16, rotation: 0 }
const obb2 = { position: vec2.create(), width: 16, height: 16, rotation: 0 }

const hit = contact()


// axis-aligned: behaves like aabb when rotation is 0
{
    vec2.set(0, 0, obb1.position); obb1.rotation = 0
    vec2.set(32, 0, obb2.position); obb2.rotation = 0
    assert.equal(obbOverlap(obb1, obb2), false)

    vec2.set(8, 0, obb2.position)
    assert.equal(obbOverlap(obb1, obb2), true)
}


// flush edges do not count as overlap
{
    vec2.set(0, 0, obb1.position); obb1.rotation = 0
    vec2.set(16, 0, obb2.position); obb2.rotation = 0
    assert.equal(obbOverlap(obb1, obb2), false)
}


// rotation matters: a 45deg box separated on its diagonal
{
    vec2.set(0, 0, obb1.position); obb1.rotation = 0

    // half-diagonal reach along x is (8 * sqrt2) ~= 11.31, plus obb1's 8 -> ~19.31
    obb2.rotation = Math.PI / 4
    vec2.set(20, 0, obb2.position)
    assert.equal(obbOverlap(obb1, obb2), false)  // gap: 20 > 19.31

    vec2.set(18, 0, obb2.position)
    assert.equal(obbOverlap(obb1, obb2), true)   // overlap: 18 < 19.31
}


// contact delta pushes obb2 out of collision along the axis of least penetration
{
    vec2.set(0, 0, obb1.position); obb1.rotation = 0
    vec2.set(4, 0, obb2.position); obb2.rotation = 0

    assert.equal(obbOverlap(obb1, obb2, hit), true)
    assert.almostEqual(hit.normal[0], 1)
    assert.almostEqual(hit.normal[1], 0)
    assert.almostEqual(hit.delta[0], 12)
    assert.almostEqual(hit.delta[1], 0)

    obb2.position[0] += hit.delta[0]
    obb2.position[1] += hit.delta[1]
    assert.equal(obbOverlap(obb1, obb2), false)
}


// a rotated pair resolves and separates after applying delta
{
    vec2.set(0, 0, obb1.position); obb1.rotation = Math.PI / 6
    vec2.set(10, 3, obb2.position); obb2.rotation = -Math.PI / 5

    assert.equal(obbOverlap(obb1, obb2, hit), true)

    obb2.position[0] += hit.delta[0]
    obb2.position[1] += hit.delta[1]
    assert.equal(obbOverlap(obb1, obb2), false)
}
