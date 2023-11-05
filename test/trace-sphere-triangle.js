import assert from './_assert.js'
import toji   from '../src/toji-tris.js'


const start = [ 0, 32 ]
const end = [ 128, 32 ]
const radius = 16

const ti = new toji.TraceInfo()
ti.resetTrace(start, end, radius)

const b = [ 128, 0 ]
const a = [ 128, 128 ]

toji.traceSphereTriangle(a, b, ti);

assert.equal(ti.collision, true)
assert.equal(ti.t, 0.875)
assert.deepEqual(ti.intersectTriNorm, [ -1, 0 ])
assert.deepEqual(ti.intersectPoint, [ 128, 32 ])


// when the sphere is 0 distance from a line segment, collide with it
{
	const start = [ 112, 64 ]
	const end = [ 140, 64 ]
	const radius = 16

	const ti = new toji.TraceInfo()
	ti.resetTrace(start, end, radius)

	toji.traceSphereTriangle(a, b, ti);
	assert.equal(ti.collision, true)
	assert.equal(ti.t, 0.0)
}
